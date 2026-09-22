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

import { Box, Paintbrush } from 'lucide-react';
import Link from 'next/link';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { SectionHeader, SettingCard } from './SettingComponents';
import { ForgeRenderLogo } from './SettingsLogos';
import { FORGE_RENDER_INFO } from '@/lib/forgerender-info';
export default function SchematicSettings() {
  const {
    ecoMode,
    schematicAntiAlias,
    schematicShadows,
    toggleSchematicAntiAlias,
    toggleSchematicShadows,
  } = useSettingsStore();
  return (
    <div className="space-y-6">
      <SectionHeader title="Schematic Preview" description="Adjust 3D rendering quality for schematic previews." />
      <div className="grid gap-4">
        <SettingCard 
          title="Enable Shadows"
          description="Renders soft shadows from blocks. Can impact performance on large schematics."
          icon={<Box size={20} />}
          checked={schematicShadows}
          onChange={toggleSchematicShadows}
          disabled={ecoMode}
        />
        <SettingCard 
          title="Anti-Aliasing (MSAA)"
          description="Smooths jagged edges on blocks. Disable for a sharper, more pixelated look and better performance."
          icon={<Paintbrush size={20} />}
          checked={schematicAntiAlias}
          onChange={toggleSchematicAntiAlias}
          disabled={ecoMode}
        />
      </div>
      <div className="bg-background border border-surface-border rounded-2xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-white">
          <ForgeRenderLogo size={34} className="text-primary" />
          <h3 className="text-xl font-bold">{FORGE_RENDER_INFO.name}</h3>
        </div>
        <p className="text-[11px] uppercase tracking-wider text-text-subtle">Version: {FORGE_RENDER_INFO.version}</p>
        <p className="text-[11px] text-text-subtle">{FORGE_RENDER_INFO.copyrightLabel}</p>
        <p className="text-[11px] text-text-subtle">
          Last updated: {FORGE_RENDER_INFO.lastUpdated},{' '}
          <Link href={FORGE_RENDER_INFO.changelogLink} className="text-primary hover:text-primary-hover underline underline-offset-2">
            Read full changelog
          </Link>
        </p>
      </div>
    </div>
  );
}