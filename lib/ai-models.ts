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

export const AI_MODELS = [
  { id: "nex-agi/nex-n2.5-pro:free", name: "Large", contextLimit: 262144, vision: true },
  { id: "qwen/qwen3.8-27b:free", name: "Base", contextLimit: 262144, vision: true },
  { id: "nex-agi/nex-n2.5-mini:free", name: "Small", contextLimit: 262144, vision: true },
] as const;
export type AiModel = (typeof AI_MODELS)[number];
export const ALLOWED_MODELS: Set<string> = new Set(AI_MODELS.map(m => m.id));
export const VISION_MODELS: Set<string> = new Set(AI_MODELS.filter(m => (m as { vision?: boolean }).vision).map(m => m.id));
export const DEFAULT_MODEL = AI_MODELS[1].id;
export const AI_TONES = [
  { id: "default", label: "Default" },
  { id: "professional", label: "Professional" },
  { id: "friendly", label: "Friendly" },
  { id: "concise", label: "Concise" },
] as const;
export type AiToneId = (typeof AI_TONES)[number]["id"];
export interface CustomAiModel {
  id: string;
  name: string;
  contextLimit: number;
  vision?: boolean;
  iconUrl?: string;
  latencyMs?: number | null;
  tps?: number | null;
  intelligence?: number | null;
}
export const CUSTOM_MODELS_KEY = "bloxdforge_custom_models";
export const CUSTOM_MODELS_EVENT = "bloxdforge:custom-models-changed";
const CUSTOM_ID_RE = /^[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*(?::[a-z0-9._-]+)?$/i;
export function isValidOpenRouterModelId(id: string): boolean {
  return CUSTOM_ID_RE.test(id.trim());
}
export function loadCustomModels(): CustomAiModel[] {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_MODELS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    const out: CustomAiModel[] = [];
    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") continue;
      const rec = entry as Record<string, unknown>;
      const id = typeof rec.id === "string" ? rec.id.trim() : "";
      if (!id || !isValidOpenRouterModelId(id) || seen.has(id)) continue;
      seen.add(id);
      const name = typeof rec.name === "string" && rec.name.trim() ? rec.name.trim().slice(0, 120) : id;
      const contextLimit =
        typeof rec.contextLimit === "number" && Number.isFinite(rec.contextLimit) && rec.contextLimit > 0
          ? Math.floor(rec.contextLimit)
          : 131072;
      out.push({
        id,
        name,
        contextLimit,
        ...(rec.vision === true ? { vision: true as const } : {}),
        ...(typeof rec.iconUrl === "string" && rec.iconUrl ? { iconUrl: rec.iconUrl.slice(0, 500) } : {}),
        ...(typeof rec.latencyMs === "number" && Number.isFinite(rec.latencyMs) ? { latencyMs: rec.latencyMs } : {}),
        ...(typeof rec.tps === "number" && Number.isFinite(rec.tps) ? { tps: rec.tps } : {}),
        ...(typeof rec.intelligence === "number" && Number.isFinite(rec.intelligence) ? { intelligence: rec.intelligence } : {}),
      });
      if (out.length >= 50) break;
    }
    return out;
  } catch {
    return [];
  }
}
export function saveCustomModels(models: CustomAiModel[]): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(CUSTOM_MODELS_KEY, JSON.stringify(models.slice(0, 50)));
  } catch {
  }
  try {
    window.dispatchEvent(new CustomEvent(CUSTOM_MODELS_EVENT));
  } catch {
  }
}