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
import { Check, X, ArrowLeftRight, Eye, Columns, MoveHorizontal, Layers, Fingerprint } from "lucide-react";
import AssetPreview from "./AssetPreview";
import { RemixAsset } from "@/stores/useRemixStore";
import { clsx } from "clsx";
import Image from "next/image";
export interface Conflict {
  path: string;
  existing: RemixAsset;
  incoming: RemixAsset;
}
interface ConflictModalProps {
  conflict: Conflict | null;
  onResolve: (path: string, keep: 'existing' | 'incoming') => void;
  onClose: () => void;
}
type CompareMode = 'side-by-side' | 'swipe' | 'onion' | 'difference';
const blobLoader = ({ src }: { src: string }) => src;
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
export default function ConflictModal({ conflict, onResolve, onClose }: ConflictModalProps) {
  const [isComparing, setIsComparing] = useState(false);
  const [mode, setMode] = useState<CompareMode>('side-by-side');
  const [sliderValue, setSliderValue] = useState(50);
  const [existingUrl, setExistingUrl] = useState<string | null>(null);
  const [incomingUrl, setIncomingUrl] = useState<string | null>(null);
  useEffect(() => {
    if (conflict) {
      const exUrl = URL.createObjectURL(conflict.existing.blob);
      const inUrl = URL.createObjectURL(conflict.incoming.blob);
      setExistingUrl(exUrl);
      setIncomingUrl(inUrl);
      return () => {
        URL.revokeObjectURL(exUrl);
        URL.revokeObjectURL(inUrl);
      };
    }
  }, [conflict]);
  if (!conflict) return null;
  const renderComparison = () => {
    if (!existingUrl || !incomingUrl) return null;
    switch (mode) {
      case 'side-by-side':
        return (
          <div className="flex items-center justify-center gap-4 h-64">
              <div className="flex flex-col items-center gap-2">
                 <span className="text-[11px] font-semibold text-text-subtle uppercase tracking-wider">Current</span>
                 <div className="w-48 h-48 bg-background border border-surface-border rounded-lg overflow-hidden relative">
                    <Image loader={blobLoader} src={existingUrl} alt="Existing" fill className="object-contain" style={{ imageRendering: 'pixelated' }} />
                 </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <span className="text-[11px] font-semibold text-text-subtle uppercase tracking-wider">Incoming</span>
                 <div className="w-48 h-48 bg-background border border-primary/40 rounded-lg overflow-hidden relative">
                    <Image loader={blobLoader} src={incomingUrl} alt="Incoming" fill className="object-contain" style={{ imageRendering: 'pixelated' }} />
                 </div>
              </div>
           </div>
         );
       case 'swipe':
         return (
           <div className="flex flex-col items-center gap-4">
              <div className="relative w-64 h-64 bg-background border border-surface-border rounded-lg overflow-hidden select-none">
                 <Image loader={blobLoader} src={incomingUrl} alt="Incoming" fill className="object-contain" style={{ imageRendering: 'pixelated' }} />
                 <div 
                   className="absolute inset-0 border-r-2 border-primary bg-background"
                   style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
                 >
                    <Image loader={blobLoader} src={existingUrl} alt="Existing" fill className="object-contain" style={{ imageRendering: 'pixelated' }} />
                 </div>
                 <div className="absolute bottom-2 left-2 text-[11px] font-semibold bg-black/60 px-2 py-0.5 rounded-full text-white pointer-events-none z-10">Current</div>
                 <div className="absolute bottom-2 right-2 text-[11px] font-semibold bg-black/60 px-2 py-0.5 rounded-full text-white pointer-events-none z-10">Incoming</div>
             </div>
              <input 
                 type="range" 
                 min="0" max="100" 
                 value={sliderValue} 
                 onChange={(e) => setSliderValue(parseInt(e.target.value))} 
                 className="w-64"
              />
           </div>
         );
       case 'onion':
         return (
           <div className="flex flex-col items-center gap-4">
             <div className="relative w-64 h-64 bg-background border border-surface-border rounded-lg overflow-hidden">
                <Image loader={blobLoader} src={existingUrl} alt="Existing" fill className="object-contain" style={{ imageRendering: 'pixelated' }} />
                <Image 
                 loader={blobLoader}
                 src={incomingUrl} 
                 alt="Incoming" 
                 fill
                 className="object-contain" 
                 style={{ opacity: sliderValue / 100, imageRendering: 'pixelated' }} 
                />
                <div className="absolute top-2 right-2 text-[11px] font-semibold bg-black/60 px-2 py-0.5 rounded-full text-white tabular-nums pointer-events-none z-10">
                   {sliderValue}% Incoming
                 </div>
             </div>
             <input 
               type="range" 
               min="0" max="100" 
               value={sliderValue} 
               onChange={(e) => setSliderValue(parseInt(e.target.value))} 
               className="w-64"
             />
          </div>
        );
      case 'difference':
         return (
            <div className="flex justify-center">
               <div className="relative w-64 h-64 bg-black border border-surface-border rounded-lg overflow-hidden">
                   <Image loader={blobLoader} src={existingUrl} alt="Existing" fill className="object-contain" style={{ imageRendering: 'pixelated' }} />
                   <Image 
                     loader={blobLoader}
                     src={incomingUrl} 
                     alt="Incoming" 
                     fill
                     className="object-contain mix-blend-difference" 
                     style={{ imageRendering: 'pixelated' }} 
                   />
                   <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-semibold bg-black/60 px-2 py-0.5 rounded-full text-white pointer-events-none whitespace-nowrap z-10">
                    Black pixels = Identical
                  </div>
              </div>
           </div>
         );
    }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-surface-elevated border border-surface-border rounded-xl w-full max-w-2xl shadow-[rgba(0,0,0,0.5)_0px_8px_24px] ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" role="dialog" aria-modal="true" aria-label="Resolve file conflict">
        <div className="flex justify-between items-center p-4 border-b border-surface-border shrink-0">
          <h3 className="font-semibold tracking-tight text-foreground text-lg">Resolve Conflict</h3>
          <button onClick={onClose} aria-label="Close modal" className="bf-press p-2 text-text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors duration-150"><X size={20} aria-hidden="true"/></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <p className="text-center mb-6 text-text-muted text-sm">
            A file named <code className="bg-surface-hover border border-surface-border px-1.5 py-1 rounded-md text-primary text-sm font-mono">{conflict.path}</code> already exists.
          </p>
          {isComparing ? (
             <div className="mb-6 space-y-6 animate-in fade-in">
                 <div className="flex justify-center bg-surface p-1 rounded-lg border border-surface-border w-fit mx-auto">
                     {[ 
                         { id: 'side-by-side', icon: Columns, label: '2-Up' },
                         { id: 'swipe', icon: MoveHorizontal, label: 'Swipe' },
                         { id: 'onion', icon: Layers, label: 'Onion' },
                         { id: 'difference', icon: Fingerprint, label: 'Diff' }
                     ].map((opt) => (
                         <button 
                             key={opt.id}
                             onClick={() => setMode(opt.id as CompareMode)}
                             className={clsx(
                                 "bf-press flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-150",
                                 mode === opt.id ? "bg-surface-elevated text-foreground" : "text-text-muted hover:text-foreground hover:bg-surface-hover"
                             )}
                         >
                            <opt.icon size={14} />
                            {opt.label}
                        </button>
                    ))}
                </div>
                {renderComparison()}
                <button 
                     onClick={() => setIsComparing(false)} 
                     className="bf-press mx-auto flex items-center gap-2 text-sm text-text-muted hover:text-foreground transition-colors duration-150"
                 >
                     <ArrowLeftRight size={14} /> Back to Overview
                 </button>
              </div>
           ) : (
             <div className="flex justify-center mb-8">
                  <button 
                     onClick={() => setIsComparing(true)} 
                      className="bf-press flex items-center gap-2 px-6 py-2.5 bg-surface-hover hover:bg-surface-elevated rounded-lg text-sm font-semibold text-foreground transition-colors duration-150 border border-surface-border hover:border-hairline-strong"
                 >
                    <Eye size={16} /> Compare Files
                </button>
            </div>
          )}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
                {!isComparing && <ConflictOption asset={conflict.existing} title="Current Version" onSelect={() => onResolve(conflict.path, 'existing')} />}
                 {isComparing && (
                      <button 
                         onClick={() => onResolve(conflict.path, 'existing')}
                          className="bf-press w-full py-2.5 bg-surface-hover hover:bg-surface-elevated text-foreground text-sm font-semibold rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 border border-surface-border hover:border-hairline-strong"
                      >
                        Keep Current
                     </button>
                )}
            </div>
            <div className="flex flex-col gap-3">
                {!isComparing && <ConflictOption asset={conflict.incoming} title="Incoming Version" onSelect={() => onResolve(conflict.path, 'incoming')} />}
                {isComparing && (
                     <button 
                         onClick={() => onResolve(conflict.path, 'incoming')}
                         className="bf-press w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
                     >
                        Use Incoming
                    </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function ConflictOption({ asset, title, onSelect }: { asset: RemixAsset, title: string, onSelect: () => void }) {
  return (
    <div className="bg-surface border border-surface-border rounded-lg p-4 flex flex-col items-center h-full">
      <h4 className="font-semibold tracking-tight text-foreground text-sm mb-3">{title}</h4>
      <AssetPreview asset={asset} className="w-32 h-32 mb-4" />
      <div className="text-xs text-text-muted w-full space-y-1 text-center mb-4">
        <p className="truncate"><strong className="font-semibold text-text-muted">From:</strong> {asset.sourcePack}</p>
        <p className="tabular-nums"><strong className="font-semibold text-text-muted">Size:</strong> {formatBytes(asset.blob.size)}</p>
      </div>
      <button 
        onClick={onSelect}
        className="bf-press mt-auto w-full py-2.5 bg-surface-hover hover:bg-surface-elevated hover:text-foreground text-text-muted text-sm font-semibold rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 border border-surface-border hover:border-hairline-strong"
      >
        <Check size={16} /> Keep this version
      </button>
    </div>
  );
}
