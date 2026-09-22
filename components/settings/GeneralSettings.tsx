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

import { Monitor, MousePointer2, Image as ImageIcon, Power, Globe, Type } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { SectionHeader, SettingCard, ToggleSwitch, RangeSlider } from './SettingComponents';
import Dropdown from '@/components/ui/Dropdown';
const FONT_PREVIEW_CODE = `function greet(name) {
  const message = \`Hello, \${name}!\`;
  console.log(message);
  return message;
}

const result = greet("World");`;
export default function GeneralSettings() {
  const {
    renderScale,
    setRenderScale,
    disableAnimations,
    simpleUI,
    ecoMode,
    toggleDisableAnimations,
    toggleSimpleUI,
    toggleEcoMode,
    autoRedirectToStudio,
    setAutoRedirectToStudio,
    editorFontFamily,
    setEditorFontFamily
  } = useSettingsStore();
  return (
    <div className="space-y-6">
      <SectionHeader title="Performance Mode" description="Optimize BloxdForge for your device." />
      <div className={`p-6 rounded-2xl border transition-all ${ecoMode ? 'bg-green-900/10 border-green-500/30' : 'bg-background border-surface-border'}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className={`font-bold text-base flex items-center gap-2 ${ecoMode ? 'text-green-400' : 'text-white'}`}>
              <Power size={18} /> Eco Mode (Kill Switch)
            </h3>
            <p className="text-sm text-text-muted">
              Instantly enables all performance settings below for maximum FPS on low-end devices (Chromebooks, older laptops).
            </p>
          </div>
          <ToggleSwitch checked={ecoMode} onChange={toggleEcoMode} color="green" />
        </div>
      </div>
      <div className="grid gap-4">
        <div className={`bg-background border border-surface-border rounded-2xl p-6 ${ecoMode ? 'opacity-60' : ''}`}>
          <div className="flex items-start gap-5">
            <div className="p-3 bg-surface-hover rounded-xl text-text-muted mt-1">
              <Monitor size={20} />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-white text-base">Game Render Scale</h3>
              <p className="text-sm text-text-muted max-w-md leading-relaxed">
                Renders the game at a lower resolution and upscales it. A lower value gives a large FPS boost at the cost of visual clarity.
              </p>
              <div className="pt-4">
                <RangeSlider 
                  label="Scale"
                  value={renderScale}
                  min={0.25}
                  max={1}
                  step={0.25}
                  onChange={setRenderScale}
                  disabled={ecoMode}
                />
              </div>
            </div>
          </div>
        </div>
        <SettingCard 
          title="Disable Animations"
          description="Removes all UI transitions and animations to save CPU usage."
          icon={<MousePointer2 size={20} />}
          checked={disableAnimations}
          onChange={toggleDisableAnimations}
          disabled={ecoMode}
        />
        <SettingCard 
          title="Simple UI"
          description="Removes gradients, blurs, and shadows. Makes the interface look flatter but faster."
          icon={<ImageIcon size={20} />}
          checked={simpleUI}
          onChange={toggleSimpleUI}
          disabled={ecoMode}
        />
      </div>
      <SectionHeader title="Editor Settings" description="Customize the script editor experience." />
      <div className="bg-background border border-surface-border rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <div className="p-3 bg-surface-hover rounded-xl text-text-muted mt-1">
            <Type size={20} />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-bold text-white text-base">Editor Font Family</h3>
              <p className="text-sm text-text-muted max-w-md leading-relaxed mt-1">
                Choose the font used in the World Tools script editor.
              </p>
            </div>
            <div className="relative z-20 pt-1">
              <Dropdown
                options={[
                  { id: "'Courier New', monospace", name: "Courier New" },
                  { id: "'JetBrains Mono', monospace", name: "JetBrains Mono" },
                  { id: "Monaco, monospace", name: "Monaco" },
                  { id: "'Geist Mono', monospace", name: "Geist Mono" },
                  { id: "system-ui, sans-serif", name: "System Default" },
                ]}
                value={editorFontFamily}
                onChange={setEditorFontFamily}
              />
            </div>
            <div className="rounded-xl overflow-hidden border border-surface-border mt-2">
              <div className="bg-surface border-b border-surface-border px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-[11px] text-text-subtle ml-2 select-none">script.js</span>
              </div>
              <div className="bg-surface">
                <SyntaxHighlighter
                  language="javascript"
                  style={vscDarkPlus}
                  showLineNumbers
                  customStyle={{
                    margin: 0,
                    padding: '12px 0',
                    background: '#1e1e1e',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    fontFamily: editorFontFamily,
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: editorFontFamily,
                    }
                  }}
                  lineNumberStyle={{
                    minWidth: '2.5em',
                    paddingRight: '1em',
                    color: '#555',
                    fontFamily: editorFontFamily,
                  }}
                >
                  {FONT_PREVIEW_CODE}
                </SyntaxHighlighter>
              </div>
              <div className="bg-[#007acc] px-4 py-0.5 flex items-center justify-between">
                <span className="text-[10px] text-white/90 select-none">JavaScript</span>
                <span className="text-[10px] text-white/70 select-none">UTF-8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SectionHeader title="Navigation" description="Customize how you move around the site." />
       <SettingCard 
          title="Auto-redirect to Studio"
          description="Automatically go to the Studio launcher when visiting the landing page."
          icon={<Globe size={20} />}
          checked={autoRedirectToStudio}
          onChange={() => setAutoRedirectToStudio(!autoRedirectToStudio)}
        />
    </div>
  );
}