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

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Loader2, Download, User, Info, FileText, Hammer, Layers, Share2, Check, Keyboard } from 'lucide-react';
import JSZip from 'jszip';
import TexturePreview from './TexturePreview';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import imageKitLoader from '@/lib/image-loader';
import Link from 'next/link';
import { secureDownload, fetchThroughProxy } from '@/lib/client-download';
import { useDownloadAnimation } from '@/hooks/useDownloadAnimation';
import { clsx } from 'clsx';
interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  zipUrl: string;
  packName: string;
  initialImg?: string;
  initialAuthor?: string;
}
interface PackMetadata {
  author: string;
  description: string;
  bannerUrl: string | null;
}
export default function PreviewModal({ isOpen, onClose, zipUrl, packName, initialImg, initialAuthor }: PreviewModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { startDownload, endDownload, isDownloading } = useDownloadAnimation();
  const handleDownload = async () => {
    const downloadId = 'preview-modal-download';
    startDownload(downloadId);
    try {
      await secureDownload(zipUrl, `${packName.replace(/\s+/g, '_')}.zip`);
      endDownload(downloadId);
    } catch {
      endDownload(downloadId);
    }
  };
  const [error, setError] = useState<string | null>(null);
  const [textures, setTextures] = useState<{ [key: string]: string }>({});
  const [skybox, setSkybox] = useState<{ px: string | null; nx: string | null; py: string | null; ny: string | null; pz: string | null; nz: string | null } | null>(null);
  const [metadata, setMetadata] = useState<PackMetadata | null>(null);
  const [copied, setCopied] = useState(false);
  const blobUrlsRef = useRef<string[]>([]);
  useEffect(() => {
    if (!isOpen) {
      setTextures({});
      setSkybox(null);
      setMetadata(null);
      setLoading(true);
      setError(null);
      setCopied(false);
    }
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen || !zipUrl) return;
    const processPack = async () => {
      try {
        setLoading(true);
        const response = await fetchThroughProxy(zipUrl, `${packName}.zip`);
        if (!response.ok) throw new Error("Failed to download texture pack");
        const blob = await response.blob();
        const zip = await JSZip.loadAsync(blob);
        const findFileRegex = (regex: RegExp) => {
          return Object.keys(zip.files).find(path => regex.test(path));
        };
        const getBlobUrl = async (path: string | undefined) => {
          if (!path) return null;
          const fileBlob = await zip.files[path].async('blob');
          const url = URL.createObjectURL(fileBlob);
          blobUrlsRef.current.push(url);
          return url;
        };
        const getText = async (path: string | undefined) => {
          if (!path) return null;
          return await zip.files[path].async('string');
        };
        const textureMappings: Record<string, RegExp> = {
          stone: /(^|\/)stone\.png$/i,
          dirt: /(^|\/)dirt\.png$/i,
          grass_top: /(^|\/)grass_top\.png$/i,
          log_maple: /(^|\/)log_maple\.png$/i,
          leaves_maple: /(^|\/)leaves_maple\.png$/i,
          chest_front: /(^|\/)chest_front\.png$/i,
          chest_side: /(^|\/)chest_side\.png$/i,
          chest_top: /(^|\/)chest_top\.png$/i,
          coal_ore: /(^|\/)coal_ore\.png$/i,
          iron_ore: /(^|\/)iron_ore\.png$/i,
          gold_ore: /(^|\/)gold_ore\.png$/i,
          diamond_ore: /(^|\/)diamond_ore\.png$/i,
          emerald_ore: /(^|\/)emerald_ore\.png$/i,
          lapis_ore: /(^|\/)lapis_ore\.png$/i,
          moonstone_ore: /(^|\/)moonstone_ore\.png$/i,
        };
        const loadedTextures: Record<string, string> = {};
        const defaults = {
          stone: '/textures/default/textures/stone.png',
          dirt: '/textures/default/textures/dirt.png',
          grass_top: '/textures/default/textures/grass_top.png',
          log_maple: '/textures/default/textures/log_maple.png',
          leaves_maple: '/textures/default/textures/leaves_maple.png',
          chest_front: '/textures/default/textures/chest_front.png',
          chest_side: '/textures/default/textures/chest_side.png',
          chest_top: '/textures/default/textures/chest_top.png',
          coal_ore: '/textures/default/textures/coal_ore.png',
          iron_ore: '/textures/default/textures/iron_ore.png',
          gold_ore: '/textures/default/textures/gold_ore.png',
          diamond_ore: '/textures/default/textures/diamond_ore.png',
          emerald_ore: '/textures/default/textures/emerald_ore.png',
          lapis_ore: '/textures/default/textures/lapis_ore.png',
          moonstone_ore: '/textures/default/textures/moonstone_ore.png',
        };
        for (const [key, regex] of Object.entries(textureMappings)) {
          const filePath = findFileRegex(regex);
          const url = await getBlobUrl(filePath);
          loadedTextures[key] = url || defaults[key as keyof typeof defaults];
        }
        setTextures(loadedTextures);
        const skyboxMappings: { key: 'px' | 'nx' | 'py' | 'ny' | 'pz' | 'nz'; regex: RegExp }[] = [
          { key: 'px', regex: /(^|\/)_?px\.(png|jpg|jpeg)$/i },
          { key: 'nx', regex: /(^|\/)_?nx\.(png|jpg|jpeg)$/i },
          { key: 'py', regex: /(^|\/)_?py\.(png|jpg|jpeg)$/i },
          { key: 'ny', regex: /(^|\/)_?ny\.(png|jpg|jpeg)$/i },
          { key: 'pz', regex: /(^|\/)_?pz\.(png|jpg|jpeg)$/i },
          { key: 'nz', regex: /(^|\/)_?nz\.(png|jpg|jpeg)$/i },
        ];
        const loadedSkybox: { px: string | null; nx: string | null; py: string | null; ny: string | null; pz: string | null; nz: string | null } = {
          px: null, nx: null, py: null, ny: null, pz: null, nz: null,
        };
        for (const { key, regex } of skyboxMappings) {
          const filePath = findFileRegex(regex);
          const url = await getBlobUrl(filePath);
          if (url) loadedSkybox[key] = url;
        }
        if (loadedSkybox.px || loadedSkybox.nx || loadedSkybox.py || loadedSkybox.ny || loadedSkybox.pz || loadedSkybox.nz) {
          setSkybox(loadedSkybox);
        } else {
          setSkybox(null);
        }
        const bannerPath = findFileRegex(/(^|\/)banner\.(png|jpg|jpeg)$/i);
        let bannerUrl = await getBlobUrl(bannerPath);
        const descPath = findFileRegex(/(^|\/)desc\.txt$/i);
        const description = (await getText(descPath)) || "No description available.";
        const creditsPath = findFileRegex(/(^|\/)credits?\.txt$/i);
        const creditsText = await getText(creditsPath);
        let author = "Community";
        if (creditsText) {
          const lines = creditsText.split('\n').map(l => l.trim());
          const textureHeaderIndex = lines.findIndex(l => l.toLowerCase().includes('textures:'));
          if (textureHeaderIndex !== -1) {
            for (let i = textureHeaderIndex + 1; i < lines.length; i++) {
              const line = lines[i];
              if (line && !line.includes('---')) {
                author = line.replace(/^-\s*/, '').trim();
                break;
              }
            }
          }
        }
        if (!bannerUrl && initialImg) bannerUrl = initialImg;
        if (author === "Community" && initialAuthor) author = initialAuthor;
        setMetadata({
          author,
          description,
          bannerUrl
        });
        setLoading(false);
      } catch (err) {
        console.error("Preview generation error:", err);
        setError("Failed to load pack data. The file might be corrupted or in an unsupported format.");
        setLoading(false);
      }
    };
    processPack();
    return () => {
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      blobUrlsRef.current = [];
    };
  }, [isOpen, zipUrl, initialImg, initialAuthor, packName]);
  const handleOpenInCreator = () => {
    router.push(`/studio/creator?importPack=${encodeURIComponent(zipUrl)}`);
  };
  const handleShare = () => {
    const url = `${window.location.origin}/studio/workshop?texture=${encodeURIComponent(zipUrl)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-background border border-surface-border w-full max-w-6xl h-[92vh] md:h-[85vh] rounded-t-2xl md:rounded-2xl flex flex-col md:flex-row overflow-hidden relative shadow-2xl z-10 animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white z-20 hover:bg-red-500/80 transition-colors"
          aria-label="Close preview modal"
        >
          <X size={20} />
        </button>
        <div className="order-1 md:order-2 flex-1 bg-[#0a0a0a] relative flex flex-col h-[40vh] md:h-auto min-h-[300px]">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-text-subtle">
              <p>Loading 3D Preview...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Preview Unavailable</h3>
              <p className="text-text-subtle max-w-md">{error}</p>
            </div>
          ) : (
            <TexturePreview textures={textures} skybox={skybox} />
          )}
          {!loading && !error && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-xs text-gray-300 pointer-events-none border border-white/10 whitespace-nowrap">
              Drag to rotate • Scroll to zoom
            </div>
          )}
        </div>
        <div className="order-2 md:order-1 w-full md:w-[400px] bg-surface flex flex-col border-t md:border-t-0 md:border-r border-surface-border flex-1 md:flex-none h-[calc(60vh)] md:h-auto overflow-hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="flex flex-col items-center gap-4 text-text-subtle">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm font-medium">Unzipping pack contents...</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="relative aspect-[3/1] md:aspect-square w-full bg-[#0a0a0a] border-b border-surface-border shrink-0 hidden md:block">
                {metadata?.bannerUrl ? (
                  <Image
                    loader={imageKitLoader}
                    src={metadata.bannerUrl}
                    alt="Pack Banner"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-hairline-strong">
                    <Image loader={imageKitLoader} src="/placeholder.svg" width={120} height={120} alt="Placeholder" className="opacity-20" style={{ width: "auto", height: "auto" }} />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-surface to-transparent pt-20">
                  <h2 className="text-2xl font-bold text-white leading-tight shadow-black drop-shadow-md">
                    {packName}
                  </h2>
                </div>
              </div>
              <div className="p-4 md:hidden border-b border-surface-border">
                 <h2 className="text-xl font-bold text-white leading-tight truncate">
                    {packName}
                  </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                <div className="flex items-center gap-3 bg-surface-hover p-3 rounded-xl border border-surface-border">
                  <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center text-text-muted">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-text-subtle uppercase font-bold tracking-wider">Created By</div>
                    <div className="text-white font-medium">{metadata?.author}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
                    <Info size={16} />
                    <span>About this Pack</span>
                  </div>
                  <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap bg-surface p-4 rounded-lg border border-surface-border">
                    {metadata?.description}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
                    <FileText size={16} />
                    <span>License / Credits</span>
                  </div>
                  <div className="text-xs text-text-subtle font-mono">
                    Free to use for personal gameplay.
                  </div>
                </div>
              </div>
              <div className="p-4 md:p-6 border-t border-surface-border bg-surface grid grid-cols-2 gap-3 pb-8 md:pb-6">
                 <button
                  onClick={handleShare}
                  className={`col-span-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-bold transition-colors border text-sm ${copied ? 'bg-green-500/10 text-green-400 border-green-500/50' : 'bg-surface-hover hover:bg-surface text-white border-surface-border'}`}
                >
                  {copied ? <Check size={16} /> : <Share2 size={16} />}
                  {copied ? 'Link Copied!' : 'Share'}
                </button>
                <button
                  onClick={handleOpenInCreator}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-surface-hover hover:bg-surface text-white rounded-lg font-bold transition-colors border border-surface-border text-sm"
                >
                  <Hammer size={16} />
                  Creator
                </button>
                <Link
                  href={`/studio/remix?source=${encodeURIComponent(zipUrl)}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-surface-hover hover:bg-surface text-white rounded-lg font-bold transition-colors border border-surface-border text-sm"
                >
                  <Layers size={16} />
                  Remix
                </Link>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading('preview-modal-download')}
                  className={clsx(
                    "col-span-2 flex items-center justify-center gap-2 w-full py-2.5 text-white rounded-lg font-bold transition-all shadow-lg",
                    isDownloading('preview-modal-download') ? "bg-primary/20 cursor-wait shadow-none" : "bg-primary hover:bg-primary-hover shadow-sm shadow-primary/10"
                  )}
                >
                  {isDownloading('preview-modal-download') ? <Loader2 size={18} className="animate-spin text-primary" /> : <Download size={18} />}
                  Download Pack
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 items-center gap-2 text-xs text-text-subtle bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <Keyboard size={12} />
          <span>Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-300 font-mono">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}