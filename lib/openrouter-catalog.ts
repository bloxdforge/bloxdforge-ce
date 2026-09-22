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

export interface OpenRouterCatalogModel {
  id: string;
  slug: string;
  permaslug: string;
  name: string;
  contextLength: number;
  vision: boolean;
  author: string;
  iconUrl: string;
  iconFallbackUrl: string;
  latencyMs: number | null;
  tps: number | null;
  intelligence: number | null;
  codingIndex: number | null;
  agenticIndex: number | null;
  isFree: boolean;
}
const PUBLIC_MODELS_URL = "https://openrouter.ai/api/v1/models";
const FRONTEND_FIND_URL = "https://openrouter.ai/api/frontend/v1/models/find?active=true&fmt=cards";
const OPENROUTER_ICON_BASE = "https://openrouter.ai/images/icons";
const HUGGING_FACE_URL = "https://huggingface.co/";
function getLocalIconUri(file: string): string {
  return `${OPENROUTER_ICON_BASE}/${file}`;
}
export function getFaviconUrl(siteUrl: string, size = 256): string {
  return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(siteUrl)}&size=${size}`;
}
export function getHuggingFaceFallbackUrl(): string {
  return getFaviconUrl(HUGGING_FACE_URL, 256);
}
const AUTHOR_ICON_MAP: Record<string, string> = {
  openai: getLocalIconUri("OpenAI.svg"),
  anthropic: getLocalIconUri("Anthropic.svg"),
  claudeonaws: getLocalIconUri("Anthropic.svg"),
  google: getLocalIconUri("GoogleGemini.svg"),
  qwen: getLocalIconUri("Qwen.png"),
  "meta": getLocalIconUri("Meta.png"),
  "meta-llama": getLocalIconUri("Meta.png"),
  mistralai: getLocalIconUri("Mistral.png"),
  deepseek: getLocalIconUri("DeepSeek.png"),
  microsoft: getLocalIconUri("Microsoft.svg"),
  "nex-agi": getLocalIconUri("NexAGI.svg"),
  openrouter: getLocalIconUri("openrouter-glyph-light.svg"),
  "x-ai": getFaviconUrl("https://x.ai/"),
  "z-ai": getFaviconUrl("https://z.ai/"),
  alibaba: getFaviconUrl("https://www.alibabacloud.com"),
  inclusionai: getFaviconUrl("https://www.inclusion-ai.org/"),
  "black-forest-labs": getFaviconUrl("https://bfl.ai"),
  amazon: getFaviconUrl("https://nova.amazon.com/"),
  minimax: getFaviconUrl("https://minimaxi.com/"),
  sakana: getFaviconUrl("https://sakana.ai"),
};
function isNonImageDataUri(uri: string): boolean {
  if (!uri.startsWith("data:")) return false;
  return !uri.startsWith("data:image/");
}
export function resolveAuthorIcon(args: {
  permaslug?: string | null;
  author?: string | null;
  iconUri?: string | null;
}): { url: string; fallbackUrl: string } {
  const fallbackUrl = getHuggingFaceFallbackUrl();
  const rawPermaslug = (args.permaslug || "").toLowerCase();
  const permaslug = rawPermaslug.startsWith("~") ? rawPermaslug.slice(1) : rawPermaslug;
  if (permaslug.startsWith("microsoft/mai-")) {
    return { url: getLocalIconUri("MAI.png"), fallbackUrl };
  }
  const author = (args.author || "").toLowerCase();
  const iconUri = (args.iconUri || "").trim();
  const mapped = author ? AUTHOR_ICON_MAP[author] : undefined;
  if (iconUri && !isNonImageDataUri(iconUri)) {
    if (iconUri.startsWith("data:image/") || iconUri.startsWith("/")) {
      const url = iconUri.startsWith("/") ? `https://openrouter.ai${iconUri}` : iconUri;
      return { url, fallbackUrl: mapped || fallbackUrl };
    }
    if (iconUri.startsWith("//")) {
      return { url: getFaviconUrl(`https:${iconUri}`), fallbackUrl: mapped || fallbackUrl };
    }
    if (/^https?:\/\//i.test(iconUri)) {
      return { url: getFaviconUrl(iconUri), fallbackUrl: mapped || fallbackUrl };
    }
    return { url: getLocalIconUri(iconUri), fallbackUrl: mapped || fallbackUrl };
  }
  if (mapped) return { url: mapped, fallbackUrl };
  return { url: fallbackUrl, fallbackUrl };
}
export function isBatchModelId(id: string): boolean {
  const parts = id.split(":");
  return parts.length > 1 && (parts[parts.length - 1] || "").toLowerCase() === "batch";
}
interface PublicApiModel {
  id: string;
  name?: string;
  context_length?: number;
  architecture?: { input_modalities?: string[]; output_modalities?: string[] };
  pricing?: { prompt?: string | number };
}
interface FrontendFindModel {
  slug: string;
  permaslug: string;
  name: string;
  context_length?: number;
  input_modalities?: string[];
  output_modalities?: string[];
  has_text_output?: boolean;
  author?: string;
  author_icon_uri?: string | null;
  endpoint?: { id?: string };
}
interface FrontendFindResponse {
  data?: {
    models?: FrontendFindModel[];
    endpoint_perf?: Record<string, { p50_latency?: number | null; p50_throughput?: number | null }>;
    benchmarks?: Record<string, { aa?: { intelligence_index?: number; coding_index?: number; agentic_index?: number } }>;
  };
}
let cachedPromise: Promise<OpenRouterCatalogModel[]> | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;
function baseSlugOf(id: string): string {
  return id.split(":")[0]?.toLowerCase() ?? id.toLowerCase();
}
function toCatalogEntry(
  pub: PublicApiModel,
  front: FrontendFindModel | undefined,
  endpointPerf: Record<string, { p50_latency?: number | null; p50_throughput?: number | null }>,
  benchmarks: Record<string, { aa?: { intelligence_index?: number; coding_index?: number; agentic_index?: number } }>,
): OpenRouterCatalogModel | null {
  const id = pub.id;
  if (!id || typeof id !== "string") return null;
  if (isBatchModelId(id)) return null;
  const publicOutput = pub.architecture?.output_modalities ?? [];
  const outModalities = publicOutput.length > 0 ? publicOutput : (front?.output_modalities ?? []);
  const writesText = outModalities.map(m => String(m).toLowerCase()).includes("text");
  if (!writesText || front?.has_text_output === false) return null;
  const slug = front?.slug || baseSlugOf(id);
  const permaslug = front?.permaslug || id;
  const name = (pub.name || front?.name || id).trim() || id;
  const publicContext = typeof pub.context_length === "number" && pub.context_length > 0 ? pub.context_length : 0;
  const frontContext = typeof front?.context_length === "number" && front.context_length > 0 ? front.context_length : 0;
  const contextLength = publicContext || frontContext || 131072;
  const publicInput = pub.architecture?.input_modalities ?? [];
  const inputModalities = publicInput.length > 0 ? publicInput : (front?.input_modalities ?? []);
  const vision = inputModalities.map(m => String(m).toLowerCase()).includes("image");
  const author = front?.author || id.split("/")[0] || "";
  const icon = resolveAuthorIcon({ permaslug, author, iconUri: front?.author_icon_uri ?? null });
  const endpointId = front?.endpoint?.id;
  const perf = endpointId ? endpointPerf[endpointId] : undefined;
  const bench = benchmarks[permaslug]?.aa;
  const promptPrice = Number(pub.pricing?.prompt ?? NaN);
  return {
    id,
    slug,
    permaslug,
    name,
    contextLength,
    vision,
    author,
    iconUrl: icon.url,
    iconFallbackUrl: icon.fallbackUrl,
    latencyMs: typeof perf?.p50_latency === "number" ? perf.p50_latency : null,
    tps: typeof perf?.p50_throughput === "number" ? perf.p50_throughput : null,
    intelligence: typeof bench?.intelligence_index === "number" ? bench.intelligence_index : null,
    codingIndex: typeof bench?.coding_index === "number" ? bench.coding_index : null,
    agenticIndex: typeof bench?.agentic_index === "number" ? bench.agentic_index : null,
    isFree: Number.isFinite(promptPrice) ? promptPrice === 0 : /:free$/i.test(id),
  };
}
export function fetchOpenRouterCatalog(options?: { force?: boolean }): Promise<OpenRouterCatalogModel[]> {
  const now = Date.now();
  if (!options?.force && cachedPromise && now - cachedAt < CACHE_TTL_MS) return cachedPromise;
  cachedAt = now;
  cachedPromise = (async () => {
    const [pubRes, frontRes] = await Promise.all([
      fetch(PUBLIC_MODELS_URL, { headers: { Accept: "application/json" } }),
      fetch(FRONTEND_FIND_URL, { headers: { Accept: "application/json" } }),
    ]);
    if (!pubRes.ok) throw new Error(`Model list request failed (${pubRes.status}).`);
    const pubJson = (await pubRes.json()) as { data?: PublicApiModel[] };
    const pubModels = Array.isArray(pubJson.data) ? pubJson.data : [];
    let frontModels: FrontendFindModel[] = [];
    let endpointPerf: FrontendFindResponse["data"] extends infer D
      ? D extends { endpoint_perf?: infer P }
        ? NonNullable<P>
        : Record<string, never>
      : Record<string, never> = {} as Record<string, { p50_latency?: number | null; p50_throughput?: number | null }>;
    let benchmarks: Record<string, { aa?: { intelligence_index?: number; coding_index?: number; agentic_index?: number } }> = {};
    if (frontRes.ok) {
      try {
        const frontJson = (await frontRes.json()) as FrontendFindResponse;
        frontModels = frontJson.data?.models ?? [];
        endpointPerf = (frontJson.data?.endpoint_perf ?? {}) as Record<
          string,
          { p50_latency?: number | null; p50_throughput?: number | null }
        >;
        benchmarks = (frontJson.data?.benchmarks ?? {}) as Record<
          string,
          { aa?: { intelligence_index?: number; coding_index?: number; agentic_index?: number } }
        >;
      } catch {
      }
    }
    const frontBySlug = new Map<string, FrontendFindModel>();
    for (const m of frontModels) {
      if (!m?.slug) continue;
      const key = m.slug.toLowerCase();
      if (!frontBySlug.has(key)) frontBySlug.set(key, m);
    }
    const out: OpenRouterCatalogModel[] = [];
    for (const pub of pubModels) {
      const entry = toCatalogEntry(pub, frontBySlug.get(baseSlugOf(pub.id)), endpointPerf, benchmarks);
      if (entry) out.push(entry);
    }
    out.sort((a, b) => a.name.localeCompare(b.name));
    return out;
  })();
  cachedPromise.catch(() => {
    cachedPromise = null;
    cachedAt = 0;
  });
  return cachedPromise;
}
export function formatLatency(ms: number | null | undefined): string {
  if (typeof ms !== "number" || !Number.isFinite(ms)) return "-";
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms)}ms`;
}
export function formatTps(tps: number | null | undefined): string {
  if (typeof tps !== "number" || !Number.isFinite(tps)) return "-";
  return `${Math.round(tps)}/s`;
}
export function formatIntelligence(v: number | null | undefined): string {
  if (typeof v !== "number" || !Number.isFinite(v)) return "-";
  return v.toFixed(1);
}