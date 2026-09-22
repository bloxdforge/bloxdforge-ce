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

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { SectionHeader } from './SettingComponents';
import ModelIcon from './ModelIcon';
import { useCustomModels } from '@/hooks/useCustomModels';
import { CustomAiModel, isValidOpenRouterModelId } from '@/lib/ai-models';
import {
  OpenRouterCatalogModel,
  fetchOpenRouterCatalog,
  formatIntelligence,
  formatLatency,
  formatTps,
  isBatchModelId,
} from '@/lib/openrouter-catalog';
const MAX_RECURSION_KEY = 'bloxdforge_ai_max_recursion_depth';
const MAX_REPEATED_TOOLS_KEY = 'bloxdforge_ai_max_repeated_tool_calls';
const BROWSER_PAGE_SIZE = 60;
const parseSetting = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};
function formatContext(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '-';
  if (n >= 1000000) {
    const v = n / 1000000;
    return `${Number.isInteger(v) ? v : v.toFixed(1)}M`;
  }
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
}
function describeModel(m: { contextLimit: number; vision?: boolean; intelligence?: number | null; latencyMs?: number | null; tps?: number | null }): string {
  const parts = [`${formatContext(m.contextLimit)} context`];
  if (m.vision) parts.push('Vision');
  if (typeof m.intelligence === 'number') parts.push(`${formatIntelligence(m.intelligence)} intelligence`);
  if (typeof m.latencyMs === 'number') parts.push(`${formatLatency(m.latencyMs)} latency`);
  if (typeof m.tps === 'number') parts.push(`${formatTps(m.tps)} throughput`);
  return parts.join(' · ');
}
type CatalogSort = 'intelligence' | 'latency' | 'throughput' | 'context' | 'name';
const SORT_LABELS: Record<CatalogSort, string> = {
  intelligence: 'Intelligence',
  latency: 'Latency',
  throughput: 'Throughput',
  context: 'Context',
  name: 'Name',
};
function sortCatalog(models: OpenRouterCatalogModel[], sort: CatalogSort): OpenRouterCatalogModel[] {
  const arr = [...models];
  switch (sort) {
    case 'intelligence':
      return arr.sort((a, b) => (b.intelligence ?? -1) - (a.intelligence ?? -1));
    case 'latency':
      return arr.sort((a, b) => {
        if (a.latencyMs == null && b.latencyMs == null) return 0;
        if (a.latencyMs == null) return 1;
        if (b.latencyMs == null) return -1;
        return a.latencyMs - b.latencyMs;
      });
    case 'throughput':
      return arr.sort((a, b) => (b.tps ?? -1) - (a.tps ?? -1));
    case 'context':
      return arr.sort((a, b) => b.contextLength - a.contextLength);
    case 'name':
    default:
      return arr.sort((a, b) => a.name.localeCompare(b.name));
  }
}
function CustomModelsManager({ hasKey }: { hasKey: boolean }) {
  const { customModels, addCustomModel, removeCustomModel } = useCustomModels();
  const [browserOpen, setBrowserOpen] = useState(false);
  const [catalog, setCatalog] = useState<OpenRouterCatalogModel[] | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<CatalogSort>('intelligence');
  const [manualId, setManualId] = useState('');
  const [visibleCount, setVisibleCount] = useState(BROWSER_PAGE_SIZE);
  const deferredQuery = useDeferredValue(query);
  const listRef = useRef<HTMLUListElement | null>(null);
  const sentinelRef = useRef<HTMLLIElement | null>(null);
  const customIds = useMemo(() => new Set(customModels.map(m => m.id)), [customModels]);
  const loadCatalog = async () => {
    setCatalogLoading(true);
    setCatalogError(null);
    try {
      const models = await fetchOpenRouterCatalog();
      setCatalog(models);
    } catch (e) {
      setCatalogError(e instanceof Error ? e.message : 'Could not load the model list.');
    } finally {
      setCatalogLoading(false);
    }
  };
  useEffect(() => {
    if (browserOpen && !catalog && !catalogLoading && !catalogError) {
      void loadCatalog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browserOpen]);
  const searchIndex = useMemo(() => {
    if (!catalog) return [];
    return catalog.map(entry => ({
      entry,
      haystack: `${entry.id} ${entry.name} ${entry.author}`.toLowerCase(),
    }));
  }, [catalog]);
  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const matches = q ? searchIndex.filter(item => item.haystack.includes(q)).map(item => item.entry) : (catalog ?? []);
    return sortCatalog(matches, sort);
  }, [searchIndex, catalog, deferredQuery, sort]);
  useEffect(() => {
    setVisibleCount(BROWSER_PAGE_SIZE);
  }, [deferredQuery, sort, catalog]);
  useEffect(() => {
    if (!browserOpen || !catalog) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setVisibleCount(c => Math.min(c + BROWSER_PAGE_SIZE, filtered.length));
        }
      },
      { root: listRef.current, rootMargin: '100px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [browserOpen, catalog, filtered.length, visibleCount]);
  const visible = filtered.slice(0, visibleCount);
  const toCustomModel = (entry: OpenRouterCatalogModel): CustomAiModel => ({
    id: entry.id,
    name: entry.name,
    contextLimit: entry.contextLength,
    ...(entry.vision ? { vision: true as const } : {}),
    iconUrl: entry.iconUrl,
    ...(typeof entry.latencyMs === 'number' ? { latencyMs: entry.latencyMs } : {}),
    ...(typeof entry.tps === 'number' ? { tps: entry.tps } : {}),
    ...(typeof entry.intelligence === 'number' ? { intelligence: entry.intelligence } : {}),
  });
  const handleAdd = (entry: OpenRouterCatalogModel) => {
    if (customIds.has(entry.id)) {
      toast.error('That model is already added.');
      return;
    }
    if (customModels.length >= 50) {
      toast.error('Custom model limit reached (50). Remove one first.');
      return;
    }
    addCustomModel(toCustomModel(entry));
    toast.success(`Added ${entry.id}.`);
  };
  const handleAddManual = () => {
    const id = manualId.trim();
    if (!id) return;
    if (!isValidOpenRouterModelId(id)) {
      toast.error('Use an OpenRouter model ID like author/model-name or author/model-name:variant.');
      return;
    }
    if (isBatchModelId(id)) {
      toast.error('Batch models are not supported for chat. Pick a standard variant instead.');
      return;
    }
    if (customIds.has(id)) {
      toast.error('That model is already added.');
      return;
    }
    const enriched = catalog?.find(m => m.id.toLowerCase() === id.toLowerCase());
    addCustomModel(enriched ? toCustomModel(enriched) : { id, name: id, contextLimit: 131072 });
    setManualId('');
    toast.success(`Added ${id}.`);
  };
  if (!hasKey) {
    return (
      <div className="bg-background border border-surface-border rounded-2xl p-5 space-y-2">
        <h3 className="text-base font-semibold text-white">Custom Models</h3>
        <p className="text-sm text-text-muted">
          Add your OpenRouter key above to unlock custom models. You can then add multiple models from the
          OpenRouter catalog and use them with your own key.
        </p>
      </div>
    );
  }
  return (
    <div className="bg-background border border-surface-border rounded-2xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">Custom Models</h3>
          <p className="text-sm text-text-muted mt-1">
            Add OpenRouter models to use with your key. Stored locally on this device ({customModels.length}/50).
          </p>
        </div>
        <button
          onClick={() => setBrowserOpen(v => !v)}
          className="shrink-0 px-4 py-2 bg-surface-hover hover:bg-hairline-strong text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5"
        >
          <Plus size={14} /> {browserOpen ? 'Close' : 'Browse models'}
        </button>
      </div>
      {customModels.length > 0 && (
        <ul className="divide-y divide-surface-border border border-surface-border rounded-xl overflow-hidden">
          {customModels.map(m => (
            <li key={m.id} className="flex items-center gap-3 bg-[#0a0a0a] px-3 py-2.5">
              <div className="p-2 bg-surface-hover rounded-xl text-text-muted shrink-0">
                <ModelIcon src={m.iconUrl} alt={m.name} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{m.name}</p>
                <p className="text-[11px] text-text-subtle font-mono truncate">{m.id}</p>
                <p className="text-[11px] text-text-subtle truncate">{describeModel(m)}</p>
              </div>
              <button
                onClick={() => {
                  removeCustomModel(m.id);
                  toast.success('Custom model removed.');
                }}
                className="p-2 text-text-subtle hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                title={`Remove ${m.id}`}
                aria-label={`Remove ${m.id}`}
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {customModels.length === 0 && !browserOpen && (
        <p className="text-sm text-text-subtle">No custom models yet. Browse the catalog to add one.</p>
      )}
      {browserOpen && (
        <div className="space-y-3 border-t border-surface-border pt-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search all OpenRouter models…"
                className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary placeholder:text-text-subtle"
              />
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as CatalogSort)}
              className="bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-primary"
              aria-label="Sort models"
            >
              {(Object.keys(SORT_LABELS) as CatalogSort[]).map(k => (
                <option key={k} value={k}>
                  {SORT_LABELS[k]}
                </option>
              ))}
            </select>
          </div>
          {catalogLoading && (
            <p className="flex items-center gap-2 text-sm text-text-muted">
              <Loader2 size={14} className="animate-spin" /> Loading OpenRouter catalog…
            </p>
          )}
          {catalogError && (
            <div className="flex items-center justify-between gap-2 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
              <span className="text-red-300">{catalogError} You can still add a model ID manually below.</span>
              <button
                onClick={() => void loadCatalog()}
                className="shrink-0 px-3 py-1.5 bg-surface-hover hover:bg-hairline-strong text-white rounded-md text-xs font-bold transition-colors"
              >
                Retry
              </button>
            </div>
          )}
          {catalog && !catalogLoading && (
            <div>
              <ul ref={listRef} className="divide-y divide-surface-border border border-surface-border rounded-xl overflow-hidden max-h-96 overflow-y-auto custom-scrollbar">
                {visible.map(entry => {
                  const isAdded = customIds.has(entry.id);
                  return (
                    <li key={entry.id} className="flex items-center gap-3 bg-[#0a0a0a] px-3 py-2">
                      <ModelIcon src={entry.iconUrl} fallbackSrc={entry.iconFallbackUrl} alt={entry.name} size={20} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{entry.name}</p>
                        <p className="text-[11px] text-text-subtle font-mono truncate">{entry.id}</p>
                        <p className="text-[11px] text-text-subtle truncate">
                          {describeModel({ ...entry, contextLimit: entry.contextLength })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAdd(entry)}
                        disabled={isAdded}
                        className="shrink-0 px-3 py-1.5 rounded-md text-xs font-bold transition-colors bg-surface-hover hover:bg-hairline-strong text-white disabled:opacity-40 disabled:cursor-default disabled:hover:bg-surface-hover"
                      >
                        {isAdded ? 'Added' : 'Add'}
                      </button>
                    </li>
                  );
                })}
                {visibleCount < filtered.length && (
                  <li aria-hidden="true" ref={sentinelRef} className="h-px bg-[#0a0a0a]" style={{ borderTopWidth: 0 }} />
                )}
              </ul>
              {filtered.length === 0 && (
                <p className="text-sm text-text-subtle px-1 py-2">No models match “{deferredQuery.trim()}”.</p>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={manualId}
              onChange={e => setManualId(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddManual();
                }
              }}
              placeholder="Or paste a model ID (author/model:variant)"
              className="flex-1 bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-primary placeholder:text-text-subtle placeholder:font-sans"
            />
            <button
              onClick={handleAddManual}
              className="px-4 py-2 bg-surface-hover hover:bg-hairline-strong text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default function AiSettings() {
  const [apiKey, setApiKey] = useState('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [maxRecursionDepth, setMaxRecursionDepth] = useState(5);
  const [maxRepeatedToolCalls, setMaxRepeatedToolCalls] = useState(3);
  useEffect(() => {
    const savedKey = localStorage.getItem("bloxdforge_nvidia_key");
    if (savedKey) setApiKey(savedKey);
    setMaxRecursionDepth(parseSetting(localStorage.getItem(MAX_RECURSION_KEY), 5));
    setMaxRepeatedToolCalls(parseSetting(localStorage.getItem(MAX_REPEATED_TOOLS_KEY), 3));
  }, []);
  const saveApiKey = () => {
    localStorage.setItem("bloxdforge_nvidia_key", apiKey);
    try {
      window.dispatchEvent(new StorageEvent('storage', { key: 'bloxdforge_nvidia_key' }));
    } catch {
    }
    toast.success("API Key saved securely.");
  };
  const clearApiKey = () => {
    localStorage.removeItem("bloxdforge_nvidia_key");
    setApiKey('');
    try {
      window.dispatchEvent(new StorageEvent('storage', { key: 'bloxdforge_nvidia_key' }));
    } catch {
    }
    toast.success("API Key removed.");
  };
  const saveRuntimeLimits = () => {
    const nextRecursion = Math.max(0, Math.floor(maxRecursionDepth));
    const nextRepeated = Math.max(0, Math.floor(maxRepeatedToolCalls));
    setMaxRecursionDepth(Number.isFinite(nextRecursion) ? nextRecursion : 0);
    setMaxRepeatedToolCalls(Number.isFinite(nextRepeated) ? nextRepeated : 0);
    localStorage.setItem(MAX_RECURSION_KEY, String(Number.isFinite(nextRecursion) ? nextRecursion : 0));
    localStorage.setItem(MAX_REPEATED_TOOLS_KEY, String(Number.isFinite(nextRepeated) ? nextRepeated : 0));
    toast.success("AI runtime limits saved.");
  };
  return (
    <div className="space-y-6">
      <SectionHeader title="AI Assistant" description="Configure the intelligence behind the coding tools." />
      <div className="bg-background border border-surface-border rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white">Bring Your Own Key (BYOK)</h3>
          <p className="text-sm text-text-muted mt-1">
            Use your own OpenRouter key to bypass shared rate limits.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type={apiKeyVisible ? "text" : "password"}
              placeholder="sk-or-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg pl-3 pr-14 py-2.5 text-sm text-white focus:outline-none focus:border-primary placeholder:text-text-subtle font-mono"
            />
            <button
              onClick={() => setApiKeyVisible(!apiKeyVisible)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-text-subtle hover:text-white px-1.5 py-1 rounded transition-colors"
            >
              {apiKeyVisible ? "Hide" : "Show"}
            </button>
          </div>
          <button
            onClick={saveApiKey}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold transition-all shadow-sm shadow-primary/10"
          >
            Save
          </button>
        </div>
        {apiKey && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300 flex items-center gap-1.5">
              <Check size={14} className="text-green-400" /> Stored locally
            </span>
            <button
              onClick={clearApiKey}
              className="text-text-muted hover:text-red-300 flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors"
            >
              <Trash2 size={14} /> Remove
            </button>
          </div>
        )}
      </div>
      <CustomModelsManager hasKey={apiKey.trim().length > 0} />
      <div className="bg-background border border-surface-border rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white">Runtime Limits</h3>
          <p className="text-sm text-text-muted mt-1">Control loop safeguards for AI tool execution.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Max recursion depth</span>
            <input
              type="number"
              min={0}
              value={maxRecursionDepth}
              onChange={(e) => setMaxRecursionDepth(Number.parseInt(e.target.value || '0', 10))}
              className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Max repeated tool calls</span>
            <input
              type="number"
              min={0}
              value={maxRepeatedToolCalls}
              onChange={(e) => setMaxRepeatedToolCalls(Number.parseInt(e.target.value || '0', 10))}
              className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
            />
          </label>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-subtle">Defaults: recursion 20, repeated tool calls 10. Set 0 for no limit.</p>
          <button
            onClick={saveRuntimeLimits}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold transition-all shadow-sm shadow-primary/10"
          >
            Save Limits
          </button>
        </div>
      </div>
    </div>
  );
}
