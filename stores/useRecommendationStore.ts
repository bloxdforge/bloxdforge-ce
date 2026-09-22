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

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbKeyval } from '@/lib/idb';
export type ItemType = 'build' | 'texture' | 'script';
interface ViewEvent {
  itemId: string;
  itemType: ItemType;
  timestamp: number;
  timeSpent: number;
  tags: string[];
  author: string;
}
interface SearchEvent {
  query: string;
  timestamp: number;
  resultClicked?: string;
}
interface DownloadEvent {
  itemId: string;
  itemType: ItemType;
  timestamp: number;
  tags: string[];
  author: string;
}
interface UserPreferences {
  favoriteTags: Record<string, number>;
  favoriteAuthors: Record<string, number>;
  preferredTypes: Record<string, number>;
  searchHistory: string[];
}
export interface RecommendationItem {
  id: string;
  type?: string;
  tags?: string[];
  author?: string;
  is_ai?: boolean;
  [key: string]: unknown;
}
interface RecommendationState {
  viewHistory: ViewEvent[];
  searchHistory: SearchEvent[];
  downloadHistory: DownloadEvent[];
  impressionCounts: Record<string, number>;
  preferences: UserPreferences;
  authorAiRatios: Record<string, number>;
  currentViewStart: number | null;
  currentItemId: string | null;
  currentViewItem: { itemType: ItemType; tags: string[]; author: string } | null;
  startViewing: (itemId: string, itemType: ItemType, tags: string[], author: string) => void;
  endViewing: () => void;
  recordSearch: (query: string, resultClicked?: string) => void;
  recordDownload: (itemId: string, itemType: ItemType, tags: string[], author: string) => void;
  recordImpression: (itemId: string) => void;
  calculateAuthorStats: (items: RecommendationItem[]) => void;
  getRecommendationScore: (item: RecommendationItem) => number;
  getSortedRecommendations: <T extends RecommendationItem>(items: T[]) => T[];
  getExplorationItem: <T extends RecommendationItem>(items: T[]) => T | null;
  clearHistory: () => void;
}
const CONFIG = {
  TIME_DECAY_FACTOR: 0.995,
  MAX_HISTORY_SIZE: 500,
  MAX_SEARCH_HISTORY: 50,
  WEIGHTS: {
    TAG: 2.0,
    AUTHOR: 1.5,
    TYPE: 1.0,
    DOWNLOAD: 3.0,
    VIEW_BASE: 1.0,
    SEARCH_MATCH: 0.5,
    PENALTY_VIEWED: 0.85,
    PENALTY_DOWNLOADED: 0.7,
    PENALTY_IMPRESSION: 0.95,
    PENALTY_AI_AUTHOR_MAX: 0.95,
  },
  THRESHOLDS: {
    MIN_VIEWS_FOR_SCORE: 3,
    MIN_DOWNLOADS_FOR_SCORE: 1,
    EXPLORATION_VIEWS: 5,
    EXPLORATION_DOWNLOADS: 2,
    MIN_VIEW_TIME_SEC: 2,
    VIEW_ENGAGEMENT_CAP: 3,
    RECENCY_PENALTY_DAYS: 14,
  },
};
function getTimeDecay(timestamp: number): number {
  const daysSinceEvent = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
  return Math.pow(CONFIG.TIME_DECAY_FACTOR, daysSinceEvent);
}
function normalizeWeights(weights: Record<string, number>): Record<string, number> {
  const values = Object.values(weights);
  if (values.length === 0) return {};
  const max = Math.max(...values, 1);
  const normalized: Record<string, number> = {};
  for (const [key, value] of Object.entries(weights)) {
    normalized[key] = value / max;
  }
  return normalized;
}
function normalizeTag(tag: string): string {
  return tag.toLowerCase().trim();
}
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function isRecentEvent(timestamp: number, daysThreshold: number): boolean {
  return (Date.now() - timestamp) / (1000 * 60 * 60 * 24) < daysThreshold;
}
const DEFAULT_PREFERENCES: UserPreferences = {
  favoriteTags: {},
  favoriteAuthors: {},
  preferredTypes: { build: 0, texture: 0, script: 0 },
  searchHistory: [],
};
export const useRecommendationStore = create<RecommendationState>()(
  persist(
    (set, get) => ({
      viewHistory: [],
      searchHistory: [],
      downloadHistory: [],
      impressionCounts: {},
      preferences: { ...DEFAULT_PREFERENCES },
      authorAiRatios: {},
      currentViewStart: null,
      currentItemId: null,
      currentViewItem: null,
      startViewing: (itemId, itemType, tags, author) => {
        get().endViewing();
        set({
          currentViewStart: Date.now(),
          currentItemId: itemId,
          currentViewItem: { itemType, tags: tags.map(normalizeTag), author },
        });
      },
      endViewing: () => {
        const { currentViewStart, currentItemId, currentViewItem } = get();
        set({ currentViewStart: null, currentItemId: null, currentViewItem: null });
        if (!currentViewStart || !currentItemId || !currentViewItem) return;
        const timeSpent = (Date.now() - currentViewStart) / 1000;
        if (timeSpent < CONFIG.THRESHOLDS.MIN_VIEW_TIME_SEC) return;
        const decay = getTimeDecay(Date.now());
        const engagement = Math.min(timeSpent / 30, CONFIG.THRESHOLDS.VIEW_ENGAGEMENT_CAP);
        const weight = CONFIG.WEIGHTS.VIEW_BASE * engagement * decay;
        set((prev) => {
          const isDuplicate = prev.viewHistory.length > 0 &&
            prev.viewHistory[0].itemId === currentItemId &&
            (Date.now() - prev.viewHistory[0].timestamp) < 60000;
          const newHistory = isDuplicate
            ? prev.viewHistory
            : [
              {
                itemId: currentItemId,
                ...currentViewItem,
                timestamp: Date.now(),
                timeSpent,
              } as ViewEvent,
              ...prev.viewHistory,
            ].slice(0, CONFIG.MAX_HISTORY_SIZE);
          const newTags = { ...prev.preferences.favoriteTags };
          currentViewItem.tags.forEach(tag => {
            newTags[tag] = (newTags[tag] || 0) + weight;
          });
          const newAuthors = { ...prev.preferences.favoriteAuthors };
          newAuthors[currentViewItem.author] = (newAuthors[currentViewItem.author] || 0) + weight;
          const newTypes = { ...prev.preferences.preferredTypes };
          newTypes[currentViewItem.itemType] = (newTypes[currentViewItem.itemType] || 0) + (CONFIG.WEIGHTS.VIEW_BASE * decay);
          return {
            viewHistory: newHistory,
            preferences: {
              ...prev.preferences,
              favoriteTags: newTags,
              favoriteAuthors: newAuthors,
              preferredTypes: newTypes,
            },
          };
        });
      },
      recordSearch: (query, resultClicked) => {
        const cleanQuery = query.toLowerCase().trim();
        if (!cleanQuery) return;
        const event: SearchEvent = {
          query: cleanQuery,
          timestamp: Date.now(),
          resultClicked,
        };
        set((prev) => {
          const newHistory = [event, ...prev.searchHistory].slice(0, CONFIG.MAX_HISTORY_SIZE);
          const newSearchList = [
            cleanQuery,
            ...prev.preferences.searchHistory.filter(q => q !== cleanQuery),
          ].slice(0, CONFIG.MAX_SEARCH_HISTORY);
          return {
            searchHistory: newHistory,
            preferences: { ...prev.preferences, searchHistory: newSearchList },
          };
        });
      },
      recordDownload: (itemId, itemType, tags, author) => {
        const event: DownloadEvent = {
          itemId,
          itemType,
          timestamp: Date.now(),
          tags: tags.map(normalizeTag),
          author,
        };
        const decay = getTimeDecay(Date.now());
        const weight = CONFIG.WEIGHTS.DOWNLOAD * decay;
        set((prev) => {
          const newHistory = [event, ...prev.downloadHistory].slice(0, CONFIG.MAX_HISTORY_SIZE);
          const newTags = { ...prev.preferences.favoriteTags };
          tags.forEach(tag => {
            const key = normalizeTag(tag);
            newTags[key] = (newTags[key] || 0) + weight;
          });
          const newAuthors = { ...prev.preferences.favoriteAuthors };
          newAuthors[author] = (newAuthors[author] || 0) + weight;
          const newTypes = { ...prev.preferences.preferredTypes };
          newTypes[itemType] = (newTypes[itemType] || 0) + weight;
          return {
            downloadHistory: newHistory,
            preferences: {
              ...prev.preferences,
              favoriteTags: newTags,
              favoriteAuthors: newAuthors,
              preferredTypes: newTypes,
            },
          };
        });
      },
      recordImpression: (itemId) => {
        set((prev) => {
          const currentCount = prev.impressionCounts[itemId] || 0;
          const newCounts = {
            ...prev.impressionCounts,
            [itemId]: currentCount + 1
          };
          const keys = Object.keys(newCounts);
          if (keys.length > 1000) {
            const sorted = keys.sort((a, b) => newCounts[b] - newCounts[a]);
            const trimmed: Record<string, number> = {};
            for (const key of sorted.slice(0, 500)) {
              trimmed[key] = newCounts[key];
            }
            return { impressionCounts: trimmed };
          }
          return { impressionCounts: newCounts };
        });
      },
      calculateAuthorStats: (items) => {
        const stats: Record<string, { total: number; ai: number }> = {};
        items.forEach(item => {
          const author = item.author || 'Unknown';
          if (!stats[author]) stats[author] = { total: 0, ai: 0 };
          stats[author].total += 1;
          if (item.is_ai) stats[author].ai += 1;
        });
        const ratios: Record<string, number> = {};
        Object.entries(stats).forEach(([author, counts]) => {
          if (counts.total > 0) {
            ratios[author] = counts.ai / counts.total;
          }
        });
        set({ authorAiRatios: ratios });
      },
      getRecommendationScore: (item) => {
        const { preferences, viewHistory, downloadHistory, searchHistory, impressionCounts, authorAiRatios } = get();
        if (
          viewHistory.length < CONFIG.THRESHOLDS.MIN_VIEWS_FOR_SCORE &&
          downloadHistory.length < CONFIG.THRESHOLDS.MIN_DOWNLOADS_FOR_SCORE
        ) {
          if (item.author && authorAiRatios[item.author]) {
            const aiRatio = authorAiRatios[item.author];
            if (aiRatio > 0.5) return -0.1 * aiRatio; 
          }
          return 0;
        }
        const normalizedTags = normalizeWeights(preferences.favoriteTags);
        const normalizedAuthors = normalizeWeights(preferences.favoriteAuthors);
        const normalizedTypes = normalizeWeights(preferences.preferredTypes);
        let score = 0;
        (item.tags ?? []).forEach(tag => {
          const key = normalizeTag(tag);
          if (normalizedTags[key]) {
            score += normalizedTags[key] * CONFIG.WEIGHTS.TAG;
          }
        });
        if (item.author && normalizedAuthors[item.author]) {
          score += normalizedAuthors[item.author] * CONFIG.WEIGHTS.AUTHOR;
        }
        if (item.type && normalizedTypes[item.type]) {
          score += normalizedTypes[item.type] * CONFIG.WEIGHTS.TYPE;
        }
        const recentSearches = searchHistory
          .filter(s => isRecentEvent(s.timestamp, 7))
          .map(s => s.query);
        if (recentSearches.length > 0) {
          const itemText = [
            ...(item.tags ?? []).map(normalizeTag),
            item.author?.toLowerCase() ?? '',
          ].join(' ');
          const matchCount = recentSearches.filter(q => itemText.includes(q)).length;
          if (matchCount > 0) {
            score += Math.min(matchCount / recentSearches.length, 1) * CONFIG.WEIGHTS.SEARCH_MATCH;
          }
        }
        const recentlyViewed = viewHistory.some(
          v => v.itemId === item.id && isRecentEvent(v.timestamp, CONFIG.THRESHOLDS.RECENCY_PENALTY_DAYS)
        );
        const recentlyDownloaded = downloadHistory.some(
          d => d.itemId === item.id && isRecentEvent(d.timestamp, CONFIG.THRESHOLDS.RECENCY_PENALTY_DAYS)
        );
        if (recentlyViewed) score *= CONFIG.WEIGHTS.PENALTY_VIEWED;
        if (recentlyDownloaded) score *= CONFIG.WEIGHTS.PENALTY_DOWNLOADED;
        const impressions = impressionCounts[item.id] || 0;
        if (impressions > 0) {
           score *= Math.pow(CONFIG.WEIGHTS.PENALTY_IMPRESSION, impressions);
        }
        if (item.author && authorAiRatios[item.author]) {
          const aiRatio = authorAiRatios[item.author];
          const penaltyFactor = 1 - (aiRatio * CONFIG.WEIGHTS.PENALTY_AI_AUTHOR_MAX);
          score *= penaltyFactor;
        }
        return score;
      },
      getSortedRecommendations: (items) => {
        const { getRecommendationScore, viewHistory, downloadHistory } = get();
        const isExplorationMode =
          viewHistory.length < CONFIG.THRESHOLDS.EXPLORATION_VIEWS &&
          downloadHistory.length < CONFIG.THRESHOLDS.EXPLORATION_DOWNLOADS;
        if (isExplorationMode) {
          return shuffleArray(items);
        }
        const scoredItems = items.map(item => ({
          item,
          score: getRecommendationScore(item)
        }));
        scoredItems.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.item.id.localeCompare(b.item.id);
        });
        return scoredItems.map(s => s.item);
      },
      getExplorationItem: (items) => {
          const { getRecommendationScore } = get();
          const scoredItems = items.map(item => ({
            item,
            score: getRecommendationScore(item)
          })).filter(i => i.score > 0);
          const pool = scoredItems.length > 10 
            ? scoredItems 
            : items.map(item => ({ item, score: 0 }));
          pool.sort((a, b) => b.score - a.score);
          const cutOffIndex = Math.floor(pool.length * 0.7);
          const candidatePool = pool.slice(cutOffIndex);
          if (candidatePool.length === 0) return items[Math.floor(Math.random() * items.length)];
          return candidatePool[Math.floor(Math.random() * candidatePool.length)].item;
      },
      clearHistory: () => {
        set({
          viewHistory: [],
          searchHistory: [],
          downloadHistory: [],
          impressionCounts: {},
          preferences: {
            ...DEFAULT_PREFERENCES,
            preferredTypes: { build: 0, texture: 0, script: 0 },
          },
          currentViewStart: null,
          currentItemId: null,
          currentViewItem: null,
          authorAiRatios: {},
        });
      },
    }),
    {
      name: 'bloxdforge_recommendations',
      storage: createJSONStorage(() => ({
        getItem: async (name: string): Promise<string | null> => {
          try {
            const val = await idbKeyval.get(name);
            return val ? JSON.stringify(val) : null;
          } catch (e) {
            console.error("Error fetching recommendations from IDB:", e);
            return null;
          }
        },
        setItem: async (name: string, value: string): Promise<void> => {
          try {
            await idbKeyval.set(name, JSON.parse(value));
          } catch (e) {
            console.error("Error saving recommendations to IDB:", e);
          }
        },
        removeItem: async (name: string): Promise<void> => {
          try {
            await idbKeyval.del(name);
          } catch (e) {
            console.error("Error removing recommendations from IDB:", e);
          }
        },
      })),
      partialize: (state) => ({
        viewHistory: state.viewHistory,
        searchHistory: state.searchHistory,
        downloadHistory: state.downloadHistory,
        impressionCounts: state.impressionCounts,
        preferences: state.preferences,
      }),
    }
  )
);