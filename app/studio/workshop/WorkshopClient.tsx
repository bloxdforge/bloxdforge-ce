"use client";

/**
 *  Copyright (c) 2026 khrotu. Apache License 2.0.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { useState, useEffect, useMemo, useRef, useCallback, TouchEvent, Suspense, useTransition } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ChevronFirst, 
  ChevronLast, 
  Box, 
  Package, 
  Eye, 
  X, 
  Code2, 
  Terminal, 
  Loader2, 
  List, 
  Compass,
  RefreshCcw,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Info,
  Sparkles
} from "lucide-react";
import { fuzzySearch } from "@/lib/search";
import { clsx } from "clsx";
import ScriptModal, { ScriptItem } from "@/components/workshop/ScriptModal";
import { WorkshopSkeleton, TextureSkeleton, ScriptSkeleton } from "@/components/workshop/WorkshopSkeleton";
import imageKitLoader from "@/lib/image-loader";
import WikiBanner from "@/components/workshop/WikiBanner";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRecommendationStore, type RecommendationItem } from "@/stores/useRecommendationStore";
import toast from "react-hot-toast";
import { secureDownload } from "@/lib/client-download";
import { useDownloadAnimation } from "@/hooks/useDownloadAnimation";
import { fetchSecureData } from "@/lib/secure-data";
import { truncateAuthor } from "@/lib/filename-utils";
import SanitizationModal from "@/components/workshop/SanitizationModal";
import { useSettingsStore } from "@/stores/useSettingsStore";
import Dropdown from "@/components/ui/Dropdown";
import { useInView } from "@/hooks/useInView";
const PreviewModal = dynamic(() => import('@/components/workshop/PreviewModal'), {
  ssr: false,
  loading: () => null
});
const SchematicPreviewModal = dynamic(() => import('@/components/workshop/SchematicPreviewModal'), {
  ssr: false,
  loading: () => null
});
interface BuildItem {
  url: string;
  img?: string | null;
  name: string;
  author: string;
  tags: string[];
  submitted_at?: string | null;
  created_at?: string | number | null;
  updated_at?: string | number | null;
  asset_time_ms?: number | null;
  is_ai?: boolean;
}
interface TextureItem {
  name: string;
  file: string;
  img?: string;
  author?: string;
  tags?: string[];
  submitted_at?: string | null;
  created_at?: string | number | null;
  updated_at?: string | number | null;
  asset_time_ms?: number | null;
  is_ai?: boolean;
}
interface LocalScriptItem extends ScriptItem {
    is_ai?: boolean;
}
type LoadingState = 'idle' | 'loading' | 'success' | 'error';
type DateSortOrder = 'date_desc' | 'date_asc';
type WorkshopAsset = BuildItem | TextureItem | LocalScriptItem;
const FALLBACK_IMAGE_SRC = "/placeholder.svg";
const normalizeImageSrc = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};
const parseTimestamp = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};
const getAssetTimestamp = (item: WorkshopAsset): number => {
  const timedItem = item as WorkshopAsset & {
    asset_time_ms?: number | null;
    updated_at?: string | number | null;
    created_at?: string | number | null;
    submitted_at?: string | null;
  };
  if (typeof timedItem.asset_time_ms === 'number' && Number.isFinite(timedItem.asset_time_ms)) {
    return timedItem.asset_time_ms;
  }
  return Math.max(
    parseTimestamp(timedItem.updated_at),
    parseTimestamp(timedItem.created_at),
    parseTimestamp(timedItem.submitted_at)
  );
};
const getAssetStableId = (item: WorkshopAsset): string => {
  const buildItem = item as BuildItem;
  const textureItem = item as TextureItem;
  const scriptItem = item as LocalScriptItem;
  return buildItem.url || textureItem.file || scriptItem.hash || scriptItem.title || 'unknown';
};
const sortByDate = <T extends WorkshopAsset>(
  items: T[],
  order: DateSortOrder,
  getRecommendationBoost?: (item: T) => number
): T[] => {
  const direction = order === 'date_asc' ? 1 : -1;
  return [...items].sort((a, b) => {
    const timestampDiff = (getAssetTimestamp(a) - getAssetTimestamp(b)) * direction;
    if (timestampDiff !== 0) return timestampDiff;
    if (getRecommendationBoost) {
      const recDiff = getRecommendationBoost(b) - getRecommendationBoost(a);
      if (recDiff !== 0) return recDiff;
    }
    return getAssetStableId(a).localeCompare(getAssetStableId(b));
  });
};
const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));
const toRecommendationItem = (
  item: WorkshopAsset,
  tab: 'builds' | 'textures' | 'scripts'
): RecommendationItem => {
  const buildItem = item as BuildItem;
  const textureItem = item as TextureItem;
  const scriptItem = item as LocalScriptItem;
  return {
    ...item,
    id: buildItem.url || textureItem.file || scriptItem.hash || scriptItem.title,
    type: tab === 'builds' ? 'build' : tab === 'textures' ? 'texture' : 'script',
  };
};
const getDynamicWildcardSpawnChance = (
  items: WorkshopAsset[],
  tab: 'builds' | 'textures' | 'scripts',
  getRecommendationScore: (item: RecommendationItem) => number
): number => {
  if (items.length === 0) return 0;
  const scores = items.map((item) => getRecommendationScore(toRecommendationItem(item, tab)));
  const positiveScores = scores.filter((score) => score > 0);
  if (positiveScores.length === 0) return 0.65;
  const scoreMean = positiveScores.reduce((total, score) => total + score, 0) / positiveScores.length;
  const normalizedMean = clamp(scoreMean / 3, 0, 1);
  const positiveCoverage = positiveScores.length / scores.length;
  const recommendationConfidence = clamp(
    (positiveCoverage * 0.7) + (normalizedMean * 0.3),
    0,
    1
  );
  return clamp(0.65 - (recommendationConfidence * 0.45), 0.2, 0.65);
};
function TrackedWorkshopItem({ 
  id, 
  children 
}: { 
  id: string, 
  children: React.ReactNode 
}) {
  const { ref, inView } = useInView({ threshold: 0.5 });
  const { recordImpression } = useRecommendationStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasRecorded = useRef(false);
  useEffect(() => {
    if (inView && !hasRecorded.current) {
      timerRef.current = setTimeout(() => {
        recordImpression(id);
        hasRecorded.current = true;
      }, 1000);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [inView, id, recordImpression]);
  return <div ref={ref} className="h-full">{children}</div>;
}
function ExplorationCard({ onClick, isRevealed, children }: { onClick: () => void, isRevealed: boolean, children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = () => {
    if (isRevealed) return;
    setIsLoading(true);
    setTimeout(() => {
      onClick();
      setIsLoading(false);
    }, 800);
  };
  if (isRevealed) {
    return <div className="animate-in fade-in zoom-in duration-500 h-full">{children}</div>;
  }
  return (
    <div 
      onClick={handleClick}
      className="group relative h-full min-h-[360px] bg-linear-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-white/30 transition-all active:scale-[0.98]"
    >
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
      <div className="relative h-full flex flex-col items-center justify-center p-6 text-center z-10 space-y-4">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-500">
          {isLoading ? (
            <RefreshCcw className="w-8 h-8 text-white animate-spin" />
          ) : (
            <Compass className="w-8 h-8 text-white group-hover:rotate-45 transition-transform duration-500" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Discover Something New</h3>
          <p className="text-sm text-gray-300 max-w-[200px] mx-auto leading-relaxed">
            Break your routine. Reveal a hidden gem from the workshop.
          </p>
        </div>
        <button className="px-6 py-2 bg-white text-black font-bold rounded-full text-sm hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
          {isLoading ? 'Revealing...' : 'Show Me'}
        </button>
      </div>
    </div>
  );
}
function WorkshopContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'builds' | 'textures' | 'scripts'>('builds');
  const [builds, setBuilds] = useState<BuildItem[]>([]);
  const [textures, setTextures] = useState<TextureItem[]>([]);
  const [scripts, setScripts] = useState<LocalScriptItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const [previewPack, setPreviewPack] = useState<{url: string, name: string, img?: string, author?: string} | null>(null);
  const [previewSchematic, setPreviewSchematic] = useState<BuildItem | null>(null);
  const [selectedScript, setSelectedScript] = useState<LocalScriptItem | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [showSanitizedModal, setShowSanitizedModal] = useState(false);
  const [wildcardRevealed, setWildcardRevealed] = useState(false);
  const [wildcardItem, setWildcardItem] = useState<WorkshopAsset | null>(null);
  const [wildcardPos, setWildcardPos] = useState<{ page: number, index: number } | null>(null);
  const [dateSortOrder, setDateSortOrder] = useState<DateSortOrder>('date_desc');
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { workshopItemsPerPage, setWorkshopItemsPerPage } = useSettingsStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const itemsPerPage = mounted ? workshopItemsPerPage : 12;
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const { startDownload, endDownload, isDownloading } = useDownloadAnimation();
  useEffect(() => {
    const handler = () => setShowSanitizedModal(true);
    window.addEventListener('bf-show-sanitization-warning', handler);
    return () => window.removeEventListener('bf-show-sanitization-warning', handler);
  }, []);
  const tabs: ('builds' | 'textures' | 'scripts')[] = ['builds', 'textures', 'scripts'];
  const currentTabIndex = tabs.indexOf(activeTab);
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setDebouncedQuery(inputValue);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);  
  const filterData = useCallback(<T extends { name?: string, title?: string, author?: string, tags?: string[] }>(data: T[]) => {
    let results = data;
    if (selectedAuthor) results = results.filter(item => item.author === selectedAuthor);
    if (selectedTags.length > 0) {
      results = results.filter(item => selectedTags.every(selectedTag => item.tags?.includes(selectedTag)));
    }
    if (debouncedQuery) {
        results = fuzzySearch(results, debouncedQuery, ['name', 'title', 'author', 'tags']);
    }
    return results;
  }, [debouncedQuery, selectedAuthor, selectedTags]);
  const filteredBuilds = useMemo(() => filterData(builds), [builds, filterData]);
  const filteredTextures = useMemo(() => filterData(textures), [textures, filterData]);
  const filteredScripts = useMemo(() => filterData(scripts), [scripts, filterData]);
  const { getExplorationItem, getRecommendationScore, recordSearch, calculateAuthorStats } = useRecommendationStore();
  const [usePersonalizedRanking, setUsePersonalizedRanking] = useState(true);
  const buildScoreById = useMemo(() => {
    const map = new Map<string, number>();
    filteredBuilds.forEach((build) => {
      const recommendationItem: RecommendationItem = { ...build, id: build.url, type: 'build' };
      map.set(build.url, getRecommendationScore(recommendationItem));
    });
    return map;
  }, [filteredBuilds, getRecommendationScore]);
  const textureScoreById = useMemo(() => {
    const map = new Map<string, number>();
    filteredTextures.forEach((texture) => {
      const recommendationItem: RecommendationItem = { ...texture, id: texture.file, type: 'texture' };
      map.set(texture.file, getRecommendationScore(recommendationItem));
    });
    return map;
  }, [filteredTextures, getRecommendationScore]);
  const scriptScoreById = useMemo(() => {
    const map = new Map<string, number>();
    filteredScripts.forEach((script) => {
      const id = script.hash || script.title;
      const recommendationItem: RecommendationItem = { ...script, id, type: 'script' };
      map.set(id, getRecommendationScore(recommendationItem));
    });
    return map;
  }, [filteredScripts, getRecommendationScore]);
  const sortedBuilds = useMemo(
    () => sortByDate(
      filteredBuilds,
      dateSortOrder,
      usePersonalizedRanking ? (item) => buildScoreById.get(item.url) ?? 0 : undefined
    ),
    [filteredBuilds, dateSortOrder, usePersonalizedRanking, buildScoreById]
  );
  const sortedTextures = useMemo(
    () => sortByDate(
      filteredTextures,
      dateSortOrder,
      usePersonalizedRanking ? (item) => textureScoreById.get(item.file) ?? 0 : undefined
    ),
    [filteredTextures, dateSortOrder, usePersonalizedRanking, textureScoreById]
  );
  const sortedScripts = useMemo(
    () => sortByDate(
      filteredScripts,
      dateSortOrder,
      usePersonalizedRanking ? (item) => scriptScoreById.get(item.hash || item.title) ?? 0 : undefined
    ),
    [filteredScripts, dateSortOrder, usePersonalizedRanking, scriptScoreById]
  );
  const currentData = useMemo<WorkshopAsset[]>(() => {
    if (activeTab === 'builds') return sortedBuilds;
    if (activeTab === 'textures') return sortedTextures;
    return sortedScripts;
  }, [activeTab, sortedBuilds, sortedTextures, sortedScripts]);
  const wildcardSpawnChance = useMemo(
    () => getDynamicWildcardSpawnChance(currentData, activeTab, getRecommendationScore),
    [activeTab, currentData, getRecommendationScore]
  );
  useEffect(() => {
    if (debouncedQuery) {
      recordSearch(debouncedQuery);
    }
  }, [debouncedQuery, recordSearch]);
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, selectedTags, selectedAuthor, activeTab]);
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
      touchEndRef.current = null; 
      touchStartRef.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
      touchEndRef.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
      if (touchStartRef.current === null || touchEndRef.current === null) return;
      const distance = touchStartRef.current - touchEndRef.current;
      const isSwipe = Math.abs(distance) > 75;
      if (isSwipe) {
          if (distance > 0) {
              const nextIndex = (currentTabIndex + 1) % tabs.length;
              setActiveTab(tabs[nextIndex]);
          } else {
              const prevIndex = (currentTabIndex - 1 + tabs.length) % tabs.length;
              setActiveTab(tabs[prevIndex]);
          }
      }
      touchStartRef.current = null;
      touchEndRef.current = null;
  };
  useEffect(() => {
    const fetchAssets = async () => {
      setLoadingState('loading');
      try {
        const [buildsData, texturesData, scriptsData] = await Promise.all([
          fetchSecureData<BuildItem[]>('builds'),
          fetchSecureData<TextureItem[]>('textures'),
          fetchSecureData<LocalScriptItem[]>('scripts-list').catch(() => [])
        ]);
        const allItems: RecommendationItem[] = [
            ...buildsData.map(b => ({ ...b, id: b.url, type: 'build' })),
            ...texturesData.map(t => ({ ...t, id: t.file, type: 'texture' })),
            ...scriptsData.map(s => ({ ...s, id: s.hash || s.title, type: 'script' }))
        ];
        calculateAuthorStats(allItems);
        setBuilds(buildsData);
        setTextures(texturesData);
        setScripts(scriptsData);
        setLoadingState('success');
      } catch (err) {
        console.error("Failed to load workshop assets:", err);
        setLoadingState('error');
      }
    };
    fetchAssets();
  }, [calculateAuthorStats]);
  useEffect(() => {
    if (loadingState !== 'success') return;
    const scriptHash = searchParams.get('script');
    const textureUrl = searchParams.get('texture');
    const schematicUrl = searchParams.get('schematic');
    if (scriptHash) {
        fetch(`/api/scripts/${scriptHash}`)
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Script not found');
            })
            .then(scriptData => {
                setSelectedScript(scriptData);
                setActiveTab('scripts');
            })
            .catch(err => toast.error(err.message));
    } else if (textureUrl) {
        const decodedUrl = decodeURIComponent(textureUrl);
        const texture = textures.find(t => t.file === decodedUrl);
        if (texture) {
            setPreviewPack({ url: texture.file, name: texture.name, img: texture.img, author: texture.author });
            setActiveTab('textures');
        } else {
            toast.error("Texture not found in workshop.");
        }
    } else if (schematicUrl) {
        const decodedUrl = decodeURIComponent(schematicUrl);
        const build = builds.find(b => b.url === decodedUrl);
        if (build) {
            setPreviewSchematic(build);
            setActiveTab('builds');
        } else {
            toast.error("Schematic not found in workshop.");
        }
    }
  }, [searchParams, loadingState, textures, builds]);
  const allTags = useMemo(() => {
    const uniqueTags = new Set<string>();
    let sourceData: WorkshopAsset[] = [];
    if (activeTab === 'builds') sourceData = builds;
    if (activeTab === 'textures') sourceData = textures;
    if (activeTab === 'scripts') sourceData = scripts;
    sourceData.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach((tag: string) => uniqueTags.add(tag));
      }
    });
    return Array.from(uniqueTags).sort();
  }, [activeTab, builds, textures, scripts]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const isAnyFilterActive = !!(selectedAuthor || selectedTags.length > 0);
  const isSearching = inputValue.length > 0;
  useEffect(() => {
    if (!isSearching && !isAnyFilterActive && loadingState === 'success' && currentData.length > 0) {
      if (Math.random() < wildcardSpawnChance) {
        const totalP = Math.ceil(currentData.length / itemsPerPage);
        const randomPage = Math.floor(Math.random() * totalP) + 1;
        const randomIndex = Math.floor(Math.random() * itemsPerPage);
        setWildcardPos({ page: randomPage, index: randomIndex });
      } else {
        setWildcardPos(null);
      }
    } else {
      setWildcardPos(null);
    }
    setWildcardRevealed(false);
    setWildcardItem(null);
  }, [activeTab, isSearching, isAnyFilterActive, loadingState, itemsPerPage, currentData.length, wildcardSpawnChance]);
  const shouldShowWildcard = wildcardPos !== null && currentPage === wildcardPos.page;
  const handleAuthorClick = (author: string) => {
    setSelectedAuthor(author);
    setInputValue('');
    setSelectedTags([]);
  };
  const handleTagClick = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };
  const clearFilters = () => {
    setSelectedAuthor(null);
    setSelectedTags([]);
    setInputValue('');
  };
  const handleDownloadWithAnimation = async (url: string, filename: string, downloadId: string) => {
    startDownload(downloadId);
    try {
      await secureDownload(url, filename);
      endDownload(downloadId);
    } catch (error) {
      endDownload(downloadId);
      console.error('Download failed:', error);
    }
  };
  const handleRevealWildcard = () => {
    const explorationItem = getExplorationItem(currentData.map(i => {
      const itemAsBuild = i as BuildItem;
      const itemAsTexture = i as TextureItem;
      const itemAsScript = i as LocalScriptItem;
      return {
        ...i,
        id: itemAsBuild.url || itemAsTexture.file || itemAsScript.hash || itemAsScript.title
      };
    }));
    setWildcardItem(explorationItem as unknown as WorkshopAsset);
    setWildcardRevealed(true);
  };
  const renderCard = (type: 'build' | 'texture' | 'script', item: WorkshopAsset) => {
    const isAi = item.is_ai;
    if (type === 'build') {
      const build = item as BuildItem;
      const buildImageSrc = normalizeImageSrc(build.img) ?? FALLBACK_IMAGE_SRC;
      return (
        <TrackedWorkshopItem key={build.url} id={build.url}>
          <div className={clsx(
              "group bg-background border border-surface-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all flex flex-col min-h-[360px] content-visibility-auto contain-strict h-full relative",
              isAi && "opacity-25 hover:opacity-100 transition-opacity duration-300"
            )}>
            {isAi && (
              <div className="absolute top-2 right-2 z-30 group/ai" onClick={(e) => e.stopPropagation()}>
                  <div className="p-1.5 bg-black/80 backdrop-blur-md rounded-full border border-yellow-500/50 text-yellow-500 cursor-help shadow-lg hover:bg-yellow-500/10 transition-colors">
                      <Info size={14} strokeWidth={2.5} />
                  </div>
                  <div className="absolute right-0 mt-2 w-48 p-3 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl opacity-0 group-hover/ai:opacity-100 transition-opacity duration-200 pointer-events-none group-hover/ai:pointer-events-auto z-40">
                      <div className="flex items-start gap-2">
                          <p className="text-[10px] leading-relaxed text-gray-300">
                              BloxdForge shuns creations that use AI to misrepresent their work or may not work as expected.
                          </p>
                      </div>
                  </div>
              </div>
            )}
            <div className="aspect-video bg-background relative overflow-hidden shrink-0">
              <Image
                loader={imageKitLoader}
                src={buildImageSrc}
                alt={build.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
                placeholder="empty"
                onError={(e) => {
                  if (e.currentTarget.src.includes(FALLBACK_IMAGE_SRC)) return;
                  e.currentTarget.srcset = FALLBACK_IMAGE_SRC;
                  e.currentTarget.src = FALLBACK_IMAGE_SRC;
                }}
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-lg text-white truncate mb-1">{build.name}</h3>
              <p className="text-xs text-text-muted mb-3">by 
                <button 
                  onClick={(e) => { e.preventDefault(); handleAuthorClick(build.author); }}
                  className="text-primary hover:underline ml-1 font-semibold"
                >
                  {truncateAuthor(build.author)}
                </button>
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {build.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs text-gray-300 bg-surface-hover border border-surface-border px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex gap-2">
                <button 
                  onClick={() => setPreviewSchematic(build)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-surface-hover hover:bg-white/10 text-white rounded-lg font-medium transition-colors text-sm border border-surface-border"
                >
                  <Eye size={14} />
                  Preview
                </button>
                <button 
                  onClick={() => handleDownloadWithAnimation(build.url, `${build.name.replace(/\s+/g, '_')}.bloxdschem`, `build-${build.url}`)}
                  disabled={isDownloading(`build-${build.url}`)}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-2 py-2 text-white rounded-lg font-medium text-sm border transition-colors",
                    isDownloading(`build-${build.url}`) ? "bg-primary/20 border-primary/50 cursor-wait" : "bg-surface-hover hover:bg-primary border-surface-border hover:border-primary"
                  )}
                >
                  {isDownloading(`build-${build.url}`) ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  Dwnld
                </button>
              </div>
            </div>
          </div>
        </TrackedWorkshopItem>
      );
    }
    if (type === 'texture') {
      const tex = item as TextureItem;
      const textureImageSrc = normalizeImageSrc(tex.img);
      return (
        <TrackedWorkshopItem key={tex.file} id={tex.file}>
          <div className={clsx(
              "group bg-background border border-surface-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all flex flex-col min-h-[360px] content-visibility-auto contain-strict h-full relative",
              isAi && "opacity-25 hover:opacity-100 transition-opacity duration-300"
            )}>
            {isAi && (
              <div className="absolute top-2 right-2 z-30 group/ai" onClick={(e) => e.stopPropagation()}>
                  <div className="p-1.5 bg-black/80 backdrop-blur-md rounded-full border border-yellow-500/50 text-yellow-500 cursor-help shadow-lg hover:bg-yellow-500/10 transition-colors">
                      <Info size={14} strokeWidth={2.5} />
                  </div>
                  <div className="absolute right-0 mt-2 w-48 p-3 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl opacity-0 group-hover/ai:opacity-100 transition-opacity duration-200 pointer-events-none group-hover/ai:pointer-events-auto z-40">
                      <div className="flex items-start gap-2">
                          <p className="text-[10px] leading-relaxed text-gray-300">
                              BloxdForge shuns creations that use AI to misrepresent their work or may not work as expected.
                          </p>
                      </div>
                  </div>
              </div>
            )}
            {textureImageSrc ? (
              <div className="aspect-video relative overflow-hidden bg-background border-b border-surface-border shrink-0">
                <Image
                  loader={imageKitLoader}
                  src={textureImageSrc}
                  alt={tex.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                  placeholder="empty"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            ) : (
              <div className="aspect-video bg-linear-to-br from-gray-800 to-black relative flex items-center justify-center border-b border-surface-border shrink-0">
                <Package className="w-12 h-12 text-white/20 group-hover:text-primary/40 transition-colors" />
              </div>
            )}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-lg text-white truncate mb-1">{tex.name}</h3>
              {tex.author && (
                <p className="text-xs text-text-muted mb-2">by 
                  <button 
                    onClick={(e) => { e.preventDefault(); handleAuthorClick(tex.author!); }}
                    className="text-primary hover:underline ml-1 font-semibold"
                  >
                    {truncateAuthor(tex.author)}
                  </button>
                </p>
              )}
              {tex.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                  {tex.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs text-gray-300 bg-surface-hover border border-surface-border px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-auto flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewPack({url: tex.file, name: tex.name, img: tex.img, author: tex.author});
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-surface-hover hover:bg-white/10 text-white rounded-lg font-medium transition-colors text-sm border border-surface-border"
                >
                  <Eye size={14} />
                  Preview
                </button>
                  <button 
                  onClick={() => handleDownloadWithAnimation(tex.file, `${tex.name.replace(/\s+/g, '_')}.zip`, `texture-${tex.file}`)}
                  disabled={isDownloading(`texture-${tex.file}`)}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-2 py-2 text-white rounded-lg font-medium transition-colors text-sm border",
                    isDownloading(`texture-${tex.file}`) ? "bg-primary/20 border-primary/50 cursor-wait" : "bg-surface-hover hover:bg-primary border-surface-border hover:border-primary"
                  )}
                >
                  {isDownloading(`texture-${tex.file}`) ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  Zip
                </button>
              </div>
            </div>
          </div>
        </TrackedWorkshopItem>
      );
    }
    if (type === 'script') {
      const script = item as LocalScriptItem;
      const scriptImageSrc = normalizeImageSrc(script.img);
      return (
        <TrackedWorkshopItem key={script.hash || script.title} id={script.hash || script.title}>
          <div
             onClick={() => {
               if (script.hash) {
                 fetch(`/api/scripts/${script.hash}`)
                   .then(r => r.ok ? r.json() : Promise.reject(new Error('Not found')))
                   .then(full => setSelectedScript(full))
                   .catch(() => toast.error('Failed to load script'));
               } else {
                 setSelectedScript(script);
               }
             }}
             className={clsx(
              "group bg-background border border-surface-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all flex flex-col cursor-pointer min-h-[360px] content-visibility-auto contain-strict h-full relative",
              isAi && "opacity-25 hover:opacity-100 transition-opacity duration-300"
            )}
          >
            {isAi && (
              <div className="absolute top-2 right-2 z-30 group/ai" onClick={(e) => e.stopPropagation()}>
                  <div className="p-1.5 bg-black/80 backdrop-blur-md rounded-full border border-yellow-500/50 text-yellow-500 cursor-help shadow-lg hover:bg-yellow-500/10 transition-colors">
                      <Info size={14} strokeWidth={2.5} />
                  </div>
                  <div className="absolute right-0 mt-2 w-48 p-3 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl opacity-0 group-hover/ai:opacity-100 transition-opacity duration-200 pointer-events-none group-hover/ai:pointer-events-auto z-40">
                      <div className="flex items-start gap-2">
                          <p className="text-[10px] leading-relaxed text-gray-300">
                              BloxdForge shuns creations that use AI to misrepresent their work or may not work as expected.
                          </p>
                      </div>
                  </div>
              </div>
            )}
            <div className="aspect-video bg-background relative overflow-hidden border-b border-surface-border shrink-0">
              {scriptImageSrc ? (
                <Image
                  loader={imageKitLoader}
                  src={scriptImageSrc}
                  alt={script.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                  placeholder="empty"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-900 to-black">
                  <Code2 className="w-10 h-10 text-gray-700" />
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-lg text-white truncate">{script.title}</h3>
              </div>
              <p className="text-xs text-text-muted mb-3">by 
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAuthorClick(script.author); }}
                  className="text-primary hover:underline ml-1 font-semibold"
                >
                  {truncateAuthor(script.author)}
                </button>
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {script.tags.map(tag => (
                  <span key={tag} className="text-xs text-gray-300 bg-surface-hover border border-surface-border px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto">
                  <button className="w-full py-2 bg-surface-hover group-hover:bg-primary text-white rounded-lg font-medium transition-colors text-sm border border-surface-border group-hover:border-primary flex items-center justify-center gap-2">
                    <Terminal size={14} /> View Code
                  </button>
              </div>
            </div>
          </div>
        </TrackedWorkshopItem>
      );
    }
    return null;
  };
  const tabContent = {
    builds: loadingState === 'loading' ? (
      <WorkshopSkeleton />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedBuilds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((build, idx) => {
           if (shouldShowWildcard && idx === wildcardPos?.index) {
              return (
                <ExplorationCard 
                  key="wildcard" 
                  onClick={handleRevealWildcard} 
                  isRevealed={wildcardRevealed}
                >
                   {wildcardRevealed && wildcardItem ? renderCard('build', wildcardItem) : null}
                </ExplorationCard>
              );
           }
           return renderCard('build', build);
        })}
      </div>
    ),
    textures: loadingState === 'loading' ? (
      <TextureSkeleton />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {sortedTextures.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((tex, idx) => {
            if (shouldShowWildcard && idx === wildcardPos?.index) {
              return (
                <ExplorationCard 
                  key="wildcard" 
                  onClick={handleRevealWildcard} 
                  isRevealed={wildcardRevealed}
                >
                   {wildcardRevealed && wildcardItem ? renderCard('texture', wildcardItem) : null}
                </ExplorationCard>
              );
            }
            return renderCard('texture', tex);
         })}
      </div>
    ),
    scripts: loadingState === 'loading' ? (
      <ScriptSkeleton />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {sortedScripts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((script, idx) => {
            if (shouldShowWildcard && idx === wildcardPos?.index) {
              return (
                <ExplorationCard 
                  key="wildcard" 
                  onClick={handleRevealWildcard} 
                  isRevealed={wildcardRevealed}
                >
                   {wildcardRevealed && wildcardItem ? renderCard('script', wildcardItem) : null}
                </ExplorationCard>
              );
            }
            return renderCard('script', script);
         })}
      </div>
    )
  };
  const totalP = Math.ceil(currentData.length / itemsPerPage);
  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      <div className="overflow-y-auto p-4 md:p-8 scroll-smooth pb-24 md:pb-8 flex-1">
        <div className="max-w-7xl mx-auto min-h-full flex flex-col space-y-8">
          {previewPack && (
            <PreviewModal 
              isOpen={!!previewPack}
              onClose={() => setPreviewPack(null)}
              zipUrl={previewPack?.url || ''}
              packName={previewPack?.name || ''}
              initialImg={previewPack.img}
              initialAuthor={previewPack.author}
            />
          )}
          <SchematicPreviewModal
            isOpen={!!previewSchematic}
            onClose={() => setPreviewSchematic(null)}
            schematic={previewSchematic}
          />
          <ScriptModal 
            isOpen={!!selectedScript}
            onClose={() => setSelectedScript(null)}
            script={selectedScript}
          />
          {showSanitizedModal && <SanitizationModal onClose={() => setShowSanitizedModal(false)} />}
          <header className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-white">Workshop</h1>
              <p className="text-sm text-text-subtle mt-1">Community builds, textures &amp; scripts</p>
            </div>
            <div className="hidden md:flex relative p-1 bg-background border border-surface-border rounded-xl overflow-hidden">
              <div
                className="absolute inset-y-1 rounded-lg bg-surface-hover border border-surface-border pointer-events-none transition-transform duration-300"
                style={{
                  left: '4px',
                  width: `calc((100% - 8px) / ${tabs.length})`,
                  transform: `translateX(calc(${currentTabIndex} * 100%))`,
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    "relative z-10 flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors duration-200",
                    activeTab === tab ? "text-white" : "text-text-muted hover:text-foreground"
                  )}
                >
                  {tab === 'builds' && <Box size={16} />}
                  {tab === 'textures' && <Package size={16} />}
                  {tab === 'scripts' && <Terminal size={16} />}
                  <span className="capitalize">{tab}</span>
                </button>
              ))}
            </div>
          </header>
          <div className="md:hidden relative flex p-1 bg-background border border-surface-border rounded-xl overflow-hidden">
            <div
              className="absolute inset-y-1 rounded-lg bg-surface-hover border border-surface-border pointer-events-none transition-transform duration-300"
              style={{
                left: '4px',
                width: `calc((100% - 8px) / ${tabs.length})`,
                transform: `translateX(calc(${currentTabIndex} * 100%))`,
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors duration-200",
                  activeTab === tab ? "text-white" : "text-text-muted"
                )}
              >
                {tab === 'builds' && <Box size={16} />}
                {tab === 'textures' && <Package size={16} />}
                {tab === 'scripts' && <Terminal size={16} />}
                <span className="capitalize text-xs">{tab}</span>
              </button>
            ))}
          </div>
          <div className="sticky top-4 md:top-0 z-40 space-y-2">
            <div className="flex items-center gap-2 bg-background border border-surface-border rounded-xl px-3 focus-within:border-white/20 transition-colors shadow-lg">
              <Search className={`shrink-0 w-4 h-4 ${isPending ? 'text-primary animate-pulse' : 'text-text-subtle'}`} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-text-subtle focus:outline-none focus-visible:outline-none"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              {inputValue && (
                <button onClick={() => setInputValue('')} className="shrink-0 text-text-subtle hover:text-white transition-colors">
                  <X size={14} />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-0.5 pl-2 border-l border-surface-border relative" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(prev => !prev)}
                  className={clsx(
                    "p-2 rounded-lg transition-colors",
                    isFilterOpen || isAnyFilterActive ? "text-primary bg-primary/10" : "text-text-subtle hover:text-white hover:bg-white/5"
                  )}
                  aria-label="Open filters"
                  aria-expanded={isFilterOpen}
                  aria-haspopup="true"
                >
                  <Filter size={15} />
                </button>
                <button
                  onClick={() => setDateSortOrder(prev => prev === 'date_desc' ? 'date_asc' : 'date_desc')}
                  className={clsx(
                    "p-2 rounded-lg transition-colors",
                    dateSortOrder === 'date_asc' ? "text-primary bg-primary/10" : "text-text-subtle hover:text-white hover:bg-white/5"
                  )}
                  title={dateSortOrder === 'date_desc' ? 'Newest first – click for oldest' : 'Oldest first – click for newest'}
                  aria-label={`Sort by date ${dateSortOrder === 'date_desc' ? 'descending' : 'ascending'}`}
                >
                  {dateSortOrder === 'date_desc' ? <ArrowDownNarrowWide size={15} /> : <ArrowUpNarrowWide size={15} />}
                </button>
                <button
                  onClick={() => setUsePersonalizedRanking(prev => !prev)}
                  className={clsx(
                    "p-2 rounded-lg transition-colors",
                    usePersonalizedRanking ? "text-primary bg-primary/10" : "text-text-subtle hover:text-white hover:bg-white/5"
                  )}
                  title={usePersonalizedRanking ? 'Personalized sorting enabled' : 'Personalized sorting disabled'}
                  aria-label={usePersonalizedRanking ? 'Disable personalized sorting' : 'Enable personalized sorting'}
                >
                  <Sparkles size={15} />
                </button>
                <div className="pl-1">
                  <Dropdown
                    options={[
                      { id: '12', name: '12' },
                      { id: '24', name: '24' },
                      { id: '48', name: '48' },
                      { id: '96', name: '96' },
                    ]}
                    value={String(itemsPerPage)}
                    onChange={(val) => setWorkshopItemsPerPage(Number(val))}
                    icon={<List size={14} />}
                    className="w-24"
                  />
                </div>
                {isFilterOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-surface border border-surface-border rounded-xl shadow-2xl p-3 z-40 animate-in fade-in zoom-in-95" role="dialog" aria-label="Filter options">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Filter by Tags</h4>
                      <button onClick={() => setSelectedTags([])} className="text-xs text-primary hover:underline" aria-label="Clear selected tags">Clear</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto custom-scrollbar" role="group" aria-label="Available tags">
                      {allTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          aria-pressed={selectedTags.includes(tag)}
                          className={clsx(
                            "px-2 py-1 text-[10px] font-bold rounded-full border transition-colors",
                            selectedTags.includes(tag)
                              ? "bg-primary text-white border-primary"
                              : "bg-surface-hover border-surface-border text-gray-300 hover:bg-primary/20 hover:text-white"
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {isAnyFilterActive && (
              <div className="flex items-center gap-2 flex-wrap text-xs text-text-muted px-1">
                <span className="font-medium text-text-subtle">Filtering by:</span>
                {selectedAuthor && (
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">
                    Author: {selectedAuthor}
                  </span>
                )}
                {selectedTags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">
                    #{tag}
                  </span>
                ))}
                <button onClick={clearFilters} className="ml-auto text-text-subtle hover:text-white flex items-center gap-1 transition-colors"><X size={11}/> Clear</button>
              </div>
            )}
          </div>
          <WikiBanner />
          {isMobile ? (
            <div className="space-y-4">
              <div 
                className="w-full overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentTabIndex * 100}%)` }}
                >
                  {tabs.map(tab => (
                    <div 
                      key={tab} 
                      className="w-full flex-shrink-0"
                    >
                      {tab === activeTab && tabContent[tab]}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center items-center gap-2 py-2">
                {tabs.map((tab, idx) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    aria-label={`Switch to ${tab}`}
                    className={clsx(
                      "rounded-full transition-all duration-300",
                      idx === currentTabIndex
                        ? "w-6 h-2 bg-primary"
                        : "w-2 h-2 bg-gray-600 hover:bg-gray-400"
                    )}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              {tabContent[activeTab]}
            </div>
          )}
          {loadingState === 'success' && currentData.length > 0 && (
            <div className="flex flex-col items-center gap-4 mt-8">
              {totalP > 1 && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="First Page"
                  >
                    <ChevronFirst size={18} />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Previous Page"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {(() => {
                    const pageNumbers = [];
                    const maxVisiblePages = 5;
                    if (totalP <= maxVisiblePages) {
                      for (let i = 1; i <= totalP; i++) pageNumbers.push(i);
                    } else {
                      let startPage = Math.max(1, currentPage - 2);
                      let endPage = Math.min(totalP, currentPage + 2);
                      if (currentPage <= 3) {
                        endPage = 5;
                      } else if (currentPage >= totalP - 2) {
                        startPage = totalP - 4;
                      }
                      if (startPage > 1) {
                        pageNumbers.push(1);
                        if (startPage > 2) pageNumbers.push('...');
                      }
                      for (let i = startPage; i <= endPage; i++) {
                        pageNumbers.push(i);
                      }
                      if (endPage < totalP) {
                        if (endPage < totalP - 1) pageNumbers.push('...');
                        pageNumbers.push(totalP);
                      }
                    }
                    return pageNumbers.map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="text-text-subtle px-2">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page as number)}
                          className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg border text-sm font-bold transition-colors ${
                            currentPage === page 
                              ? 'bg-primary text-white border-primary' 
                              : 'bg-surface border-surface-border text-text-muted hover:bg-surface-hover hover:text-white'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ));
                  })()}
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalP, p + 1))}
                    disabled={currentPage === totalP}
                    className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next Page"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(totalP)}
                    disabled={currentPage === totalP}
                    className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Last Page"
                  >
                    <ChevronLast size={18} />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-text-subtle sm:hidden">
                <span>Items per page:</span>
                <Dropdown
                  options={[
                    { id: '12', name: '12' },
                    { id: '24', name: '24' },
                    { id: '48', name: '48' },
                    { id: '96', name: '96' },
                  ]}
                  value={String(itemsPerPage)}
                  onChange={(val) => {
                    setWorkshopItemsPerPage(Number(val));
                  }}
                  icon={<List size={14} />}
                  className="w-24"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default function WorkshopPage() {
  return (
    <Suspense fallback={
      <div className="h-full w-full flex flex-col items-center justify-center bg-[#0a0a0a] text-text-subtle gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" data-force-animation="on" />
        <p>Loading Workshop...</p>
      </div>
    }>
      <WorkshopContent />
    </Suspense>
  );
}