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
/*! SIMPLIFIED START */
export interface LintError {
  line: number;
  column: number;
  endColumn?: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}
export const VALID_SOUNDS = new Set<string>();
export const VALID_PARTICLES = new Set<string>();
export const VALID_PARTICLE_PRESETS = new Set<string>();
export const VALID_CLIENT_OPTIONS = new Set<string>();
export const VALID_ENTITY_SETTINGS = new Set<string>();
export const VALID_MOB_SETTINGS = new Set<string>();
export const VALID_CALLBACKS = new Set<string>();
export const DEPRECATED_METHODS = new Set<string>();
export const VALID_EFFECTS = new Set<string>();
export const VALID_POSES = new Set<string>();
export const VALID_SKIN_PARTS = new Set<string>();
export const VALID_AI_STATES = new Set<string>();
export const VALID_MUSIC = new Set<string>();
export const VALID_ICONS = new Set<string>();
export const VALID_NAME_COLOURS = new Set<string>();
export const VALID_ENTITY_NODES = new Set<string>();
export const VALID_MESH_TYPES = new Set<string>();
export const VALID_QTE_TYPES = new Set<string>();
export const COMMON_ALIASES: Record<string, string> = {};
export const API_METHODS: Record<string, [number, number]> = {};
export const lintCode = (code: string): LintError[] => {
  void code;
  return [];
};
/*! SIMPLIFIED END */
