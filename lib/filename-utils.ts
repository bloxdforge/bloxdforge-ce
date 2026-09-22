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

const WINDOWS_RESERVED = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\..*)?$/i;
const NON_ASCII = /[^\x20-\x7E]/;
const PROBLEM_CHARS = /[<>:"/\\|?*]/g;
export function sanitizeFileName(name: string): { name: string; wasSanitized: boolean } {
  let sanitized = name.trim();
  let wasSanitized = false;
  const original = sanitized;
  sanitized = sanitized.replace(PROBLEM_CHARS, '');
  if (
    !sanitized ||
    sanitized === '.' ||
    sanitized === '..' ||
    sanitized === '...' ||
    WINDOWS_RESERVED.test(sanitized) ||
    NON_ASCII.test(sanitized)
  ) {
    sanitized = "bloxdforge-creation";
    wasSanitized = true;
  }
  if (!wasSanitized && sanitized !== original) {
    wasSanitized = true;
  }
  return { name: sanitized, wasSanitized };
}
export function truncateAuthor(name: string): string {
  if (name.length <= 15) return name;
  return name.substring(0, 15) + "...";
}
