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

export function fuzzySearch<T>(items: T[], query: string, keys: string[]): T[] {
  if (!query) return items;
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return items;
  const scoredItems: { item: T; score: number }[] = [];
  const len = items.length;
  for (let i = 0; i < len; i++) {
    const item = items[i];
    let score = 0;
    let matches = false;
    for (const key of keys) {
      const rawValue = item[key as keyof T];
      if (!rawValue) continue;
      const value = String(rawValue).toLowerCase();
      if (value === lowerQuery) {
        score += 100;
        matches = true;
      }
      else if (value.startsWith(lowerQuery)) {
        score += 50;
        matches = true;
      }
      else if (value.includes(` ${lowerQuery}`)) {
        score += 40;
        matches = true;
      }
      else if (value.includes(lowerQuery)) {
        score += 20;
        matches = true;
      }
    }
    if (matches) {
      scoredItems.push({ item, score });
    }
  }
  scoredItems.sort((a, b) => b.score - a.score);
  const resultLen = scoredItems.length;
  const results: T[] = new Array(resultLen);
  for (let i = 0; i < resultLen; i++) {
    results[i] = scoredItems[i].item;
  }
  return results;
}