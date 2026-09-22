"use client";

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

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Layers,
  Palette,
  Download,
  Plus,
  Loader2,
  Hammer,
  X,
  Settings2,
  Trash2,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import toast from 'react-hot-toast';
import { useRemixStore, ModuleValue } from "@/stores/useRemixStore";
import AssetBrowser from "@/components/remix/AssetBrowser";
import FileTree from "@/components/remix/FileTree";
import { REMIX_MODULES, ModuleInput, ModuleDefinition } from "@/lib/css-templates";
import { clsx } from "clsx";
import RemixColorPicker from "@/components/remix/RemixColorPicker";
type Tab = 'assets' | 'styles' | 'export';
export default function RemixClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    assets,
    activeModules,
    removeAsset,
    toggleModule,
    updateModuleValue,
    removeModule,
    generateRemixZip,
    openInCreator,
  } = useRemixStore();
  const [activeTab, setActiveTab] = useState<Tab>('assets');
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [packName, setPackName] = useState("My Remix Pack");
  const [isGenerating, setIsGenerating] = useState(false);
  const initialPackUrl = searchParams.get('source') || undefined;
  useEffect(() => {
    if (initialPackUrl) setIsBrowserOpen(true);
  }, [initialPackUrl]);
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateRemixZip(packName);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${packName.replace(/\s+/g, '_') || 'remix_pack'}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Pack generated successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate pack");
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div className="h-full w-full bg-[#0a0a0a] flex overflow-hidden">
      <AssetBrowser isOpen={isBrowserOpen} onClose={() => setIsBrowserOpen(false)} initialPackUrl={initialPackUrl} />
      {isModuleModalOpen && (
        <ModuleSelectorModal 
          onClose={() => setIsModuleModalOpen(false)} 
          onSelect={(id) => {
            const defaults: ModuleValue = {};
            REMIX_MODULES[id].inputs.forEach(i => { if(i.defaultValue !== undefined) defaults[i.key] = i.defaultValue; });
            toggleModule(id, defaults);
            setIsModuleModalOpen(false);
          }}
          activeIds={new Set(Object.keys(activeModules))}
        />
      )}
      <aside className="w-80 bg-background border-r border-surface-border flex flex-col shrink-0">
        <div className="p-4 border-b border-surface-border">
          <label htmlFor="remix-pack-name" className="block text-[11px] font-semibold text-text-subtle uppercase tracking-widest mb-2">Pack name</label>
          <input
            id="remix-pack-name"
            value={packName}
            onChange={e => setPackName(e.target.value)}
            placeholder="My Remix Pack"
            className="w-full h-11 bg-[#0a0a0a] border border-surface-border rounded-lg px-3 text-sm font-medium text-foreground placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors duration-150"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          <div className="px-3 py-2 text-[11px] font-semibold text-text-subtle uppercase tracking-wider">Navigation</div>
          <nav className="space-y-1 mb-6" aria-label="Remix sections">
            <button onClick={() => setActiveTab('assets')} className={clsx("bf-press w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary", activeTab === 'assets' ? "bg-primary/10 text-primary font-medium" : "text-text-muted hover:bg-surface-hover hover:text-foreground")}>
              <Layers size={18} aria-hidden="true" /> Asset Manager
            </button>
            <button onClick={() => setActiveTab('styles')} className={clsx("bf-press w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary", activeTab === 'styles' ? "bg-primary/10 text-primary font-medium" : "text-text-muted hover:bg-surface-hover hover:text-foreground")}>
              <Palette size={18} aria-hidden="true" /> Styles
            </button>
            <button onClick={() => setActiveTab('export')} className={clsx("bf-press w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary", activeTab === 'export' ? "bg-primary/10 text-primary font-medium" : "text-text-muted hover:bg-surface-hover hover:text-foreground")}>
              <Download size={18} aria-hidden="true" /> Export
            </button>
          </nav>
          {activeTab === 'assets' && (
            <div className="animate-in fade-in duration-200">
                <div className="px-3 py-2 text-[11px] font-semibold text-text-subtle uppercase tracking-wider">File Structure</div>
                {Object.keys(assets).length === 0 ? (
                 <div className="px-4 py-10 text-center"><FileTreeEmptyState onBrowse={() => setIsBrowserOpen(true)} /></div>
               ) : (
                 <FileTree assets={assets} onRemoveAsset={removeAsset} />
               )}
             </div>
           )}
           {activeTab === 'styles' && (
              <div className="animate-in fade-in duration-200">
                <div className="px-3 py-2 text-[11px] font-semibold text-text-subtle uppercase tracking-wider">Active Styles</div>
                <div className="space-y-1">
                  {Object.keys(activeModules).map(id => (
                    <div key={id} className="flex items-center justify-between px-3 py-2 text-xs text-text-muted bg-surface-elevated rounded-md border border-surface-border group">
                      <span className="truncate font-medium text-foreground">{REMIX_MODULES[id]?.name || id}</span>
                      <button onClick={() => removeModule(id)} aria-label={`Remove ${REMIX_MODULES[id]?.name || id}`} className="bf-press opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-text-subtle hover:text-red-300 hover:bg-red-500/10 p-1 rounded-md transition-colors duration-150">
                        <Trash2 size={12} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setIsModuleModalOpen(true)} className="bf-press w-full mt-4 py-2 border border-dashed border-surface-border hover:border-hairline-strong rounded-lg text-xs font-medium text-text-muted hover:text-foreground transition-colors duration-150">
                  + Add Style Module
                </button>
             </div>
          )}
        </div>
        <div className="p-4 border-t border-surface-border grid gap-2">
            <button onClick={() => setIsBrowserOpen(true)} className="bf-press w-full py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-150">
                <Plus size={16} aria-hidden="true" /> Import Assets
            </button>
            <button onClick={async () => { await openInCreator(packName); router.push('/studio/creator'); }} className="bf-press w-full py-2.5 bg-surface-hover hover:bg-surface-elevated text-foreground rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-150 border border-surface-border hover:border-hairline-strong">
                <Hammer size={16} aria-hidden="true" /> Open in Creator
            </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="px-6 py-4 border-b border-surface-border flex items-center justify-between shrink-0 bg-background">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              {activeTab === 'assets' && <><Layers size={18} className="text-primary" aria-hidden="true" /> <span>Asset Manager</span></>}
              {activeTab === 'styles' && <><Palette size={18} className="text-primary" aria-hidden="true" /> <span>Styles</span></>}
              {activeTab === 'export' && <><Download size={18} className="text-primary" aria-hidden="true" /> <span>Export</span></>}
            </h2>
            <p className="text-xs text-text-subtle mt-0.5">
              {activeTab === 'assets' && 'Combine textures, models, and skyboxes from your packs.'}
              {activeTab === 'styles' && 'Customize the interface with reusable style modules.'}
              {activeTab === 'export' && 'Generate a Bloxd.io-compatible pack ZIP.'}
            </p>
          </div>
          <button onClick={handleDownload} disabled={isGenerating} className="bf-press px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-primary">
            {isGenerating ? <Loader2 className="animate-spin" size={18} data-force-animation="on" /> : <Download size={18} aria-hidden="true" />}
            Export Zip
          </button>
        </header>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="max-w-4xl mx-auto h-full">
                {activeTab === 'assets' && (
                  <div className="flex flex-col items-center justify-center h-full text-center px-6">
                    <div className="p-5 bg-surface rounded-full border border-surface-border mb-4"><Layers size={32} className="text-text-subtle" aria-hidden="true" /></div>
                    <h4 className="text-base font-semibold tracking-tight text-foreground">No assets yet</h4>
                    <p className="text-sm text-text-subtle max-w-xs mt-1">Use the sidebar to manage files or click &quot;Import Assets&quot; to find textures from the Workshop.</p>
                  </div>
                )}
                {activeTab === 'styles' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        {Object.keys(activeModules).length === 0 ? (
                          <div className="py-20 px-6 text-center border border-dashed border-surface-border rounded-xl">
                            <Palette size={32} className="mx-auto mb-3 text-text-subtle" aria-hidden="true" />
                            <h4 className="text-lg font-semibold tracking-tight text-foreground">No Styles Configured</h4>
                            <p className="text-sm text-text-subtle mt-1">Add a style module to customize the interface.</p>
                            <button onClick={() => setIsModuleModalOpen(true)} className="bf-press mt-4 text-primary text-sm font-semibold hover:underline inline-flex items-center gap-1 transition-colors duration-150">Browse Modules <ArrowRight size={14} aria-hidden="true" /></button>
                          </div>
                        ) : (
                          Object.keys(activeModules).map(moduleId => (
                            <ModuleConfigCard 
                              key={moduleId} 
                              config={REMIX_MODULES[moduleId]} 
                              values={activeModules[moduleId]}
                              onUpdate={(key, val) => updateModuleValue(moduleId, key, val)}
                              onRemove={() => removeModule(moduleId)}
                            />
                          ))
                        )}
                    </div>
                )}
                {activeTab === 'export' && (
                    <div className="max-w-2xl mx-auto bg-surface border border-surface-border rounded-xl p-10 mt-10 shadow-[rgba(0,0,0,0.5)_0px_8px_24px]">
                        <div className="w-20 h-20 bg-primary/15 border border-primary/25 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                          <Sparkles size={40} aria-hidden="true" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2 text-center">Ready to Deploy</h2>
                        <p className="text-sm text-text-muted text-center mb-10">Generate a custom ZIP file compatible with Bloxd.io texture settings.</p>
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="p-4 bg-background rounded-xl border border-surface-border">
                              <span className="text-xs text-text-subtle uppercase font-semibold tracking-wider block mb-1">Assets</span>
                              <span className="text-2xl font-bold tabular-nums text-foreground">{Object.keys(assets).length}</span>
                            </div>
                            <div className="p-4 bg-background rounded-xl border border-surface-border">
                              <span className="text-xs text-text-subtle uppercase font-semibold tracking-wider block mb-1">Style Modules</span>
                              <span className="text-2xl font-bold tabular-nums text-foreground">{Object.keys(activeModules).length}</span>
                            </div>
                        </div>
                        <button onClick={handleDownload} disabled={isGenerating} className="bf-press w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-lg transition-colors duration-150 flex items-center justify-center gap-3 focus-visible:outline-2 focus-visible:outline-primary">
                            {isGenerating ? <Loader2 className="animate-spin" data-force-animation="on" /> : <Download aria-hidden="true" />}
                            Build Your Pack
                        </button>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}
function ModuleSelectorModal({ onClose, onSelect, activeIds }: { onClose: () => void, onSelect: (id: string) => void, activeIds: Set<string> }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-surface-elevated border border-surface-border rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-[rgba(0,0,0,0.5)_0px_8px_24px] ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-surface-border">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Available Styles</h2>
          <button onClick={onClose} aria-label="Close modal" className="bf-press p-2 text-text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors duration-150"><X aria-hidden="true" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 custom-scrollbar">
          {Object.entries(REMIX_MODULES).map(([id, def]) => {
            const isActive = activeIds.has(id);
            return (
              <button 
                key={id} 
                disabled={isActive}
                onClick={() => onSelect(id)}
                className={clsx(
                  "bf-press p-5 rounded-xl border text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary",
                  isActive ? "bg-surface border-surface-border opacity-50 cursor-not-allowed" : "bg-surface border-surface-border hover:border-primary/50 hover:bg-surface-hover"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                   <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-150", isActive ? "bg-surface-hover text-text-subtle" : "bg-primary/10 text-primary")}>
                    <Palette size={20} aria-hidden="true" />
                   </div>
                   {isActive && <CheckIcon />}
                </div>
                <h4 className="font-semibold tracking-tight text-foreground text-sm mb-1">{def.name}</h4>
                <p className="text-xs text-text-subtle line-clamp-2">{def.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function ModuleConfigCard({ config, values, onUpdate, onRemove }: { config: ModuleDefinition, values: ModuleValue, onUpdate: (k: string, v: string | number) => void, onRemove: () => void }) {
  if (!config) return null;
  return (
    <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-surface-border bg-surface-elevated flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg"><Settings2 size={16} aria-hidden="true" /></div>
          <h4 className="font-semibold tracking-tight text-foreground text-sm">{config.name}</h4>
        </div>
        <button onClick={onRemove} aria-label="Remove module" className="bf-press text-text-subtle hover:text-red-300 hover:bg-red-500/10 rounded-md p-1 transition-colors duration-150"><X size={18} aria-hidden="true" /></button>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
        {config.inputs.length === 0 ? (
          <p className="col-span-full text-sm text-text-subtle">This module is enabled and has no additional settings.</p>
        ) : (
          config.inputs.map((input: ModuleInput) => (
            <div key={input.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">{input.label}</label>
                {input.type === 'range' && <span className="text-[11px] font-mono tabular-nums text-primary">{values[input.key] ?? input.defaultValue}</span>}
              </div>
              {input.type === 'color' && (
                <RemixColorPicker 
                  color={String(values[input.key] ?? input.defaultValue ?? '#000000')} 
                  onChange={val => onUpdate(input.key, val)}
                />
              )}
              {(input.type === 'text' || input.type === 'number') && (
                <input 
                  type={input.type}
                  step={input.step}
                  placeholder={input.placeholder}
                  value={values[input.key] ?? ''}
                  onChange={e => onUpdate(input.key, e.target.value)}
                  className="w-full h-11 bg-background border border-surface-border rounded-lg px-4 text-sm text-foreground placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors duration-150"
                />
              )}
              {input.type === 'range' && (
                <input 
                  type="range"
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  value={Number(values[input.key] ?? input.defaultValue ?? 0)}
                  onChange={e => onUpdate(input.key, Number(e.target.value))}
                  className="w-full"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
function CheckIcon() {
  return (
    <div className="bg-primary rounded-full p-1"><ChevronRight size={14} className="text-white" aria-hidden="true" /></div>
  );
}
function FileTreeEmptyState({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="p-3 bg-surface-elevated border border-surface-border rounded-full mb-3"><Layers size={20} className="text-text-subtle" aria-hidden="true" /></div>
      <p className="text-sm font-medium text-text-muted">No assets added</p>
      <button onClick={onBrowse} className="bf-press mt-2 text-xs font-semibold text-primary hover:underline transition-colors duration-150">Browse Workshop</button>
    </div>
  );
}