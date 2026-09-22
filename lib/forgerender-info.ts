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

import { CHANGELOG, type ChangelogEntry } from '@/lib/changelog';
const CHANGELOG_LINK = '/studio/settings?tab=support';
function hasRenderEngineChanges(entry: ChangelogEntry): boolean {
  return Array.isArray(entry.changes.renderingEngine) && entry.changes.renderingEngine.length > 0;
}
export const latestForgeRenderChangelogEntry: ChangelogEntry | null =
  CHANGELOG.find(hasRenderEngineChanges) ?? null;
export const FORGE_RENDER_INFO = {
  name: 'ForgeRender',
  version: latestForgeRenderChangelogEntry?.version ?? CHANGELOG[0]?.version ?? 'Unknown',
  changelogLink: CHANGELOG_LINK,
  lastUpdated: latestForgeRenderChangelogEntry?.date ?? CHANGELOG[0]?.date ?? 'Unknown',
  copyrightLabel: `\u00A9 ${new Date().getFullYear()} BloxdForge`,
};
