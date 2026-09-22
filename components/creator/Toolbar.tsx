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

import React, { useState, useEffect, useCallback } from "react";
import {
  Pencil,
  Eraser,
  Pipette,
  Sun,
  Moon,
  Undo,
  Redo,
  Square,
  Circle,
  Triangle,
  PaintBucket,
  Clipboard,
  Copy,
  FileImage,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import CustomColorPicker from "./CustomColorPicker";
export type ToolType = 'pencil' | 'eraser' | 'picker' | 'lighten' | 'darken' | 'rect' | 'circle' | 'triangle' | 'fill' | 'marquee';
const PALETTE_KEY = 'bloxdforge_palette';
const PALETTE_BACKUP_KEY = 'bloxdforge_palette_backup';
const MAX_PALETTE_SIZE = 500;
const DEFAULT_PALETTE = [
  '#ff6b39', '#ffffff', '#000000', '#888888', 
  '#ff0000', '#00ff00', '#0000ff', '#ffff00'
];
function loadPalette(): string[] {
  try {
    const stored = localStorage.getItem(PALETTE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every((c: unknown) => typeof c === 'string')) {
        return parsed.slice(0, MAX_PALETTE_SIZE);
      }
    }
  } catch {}
  try {
    const backup = localStorage.getItem(PALETTE_BACKUP_KEY);
    if (backup) {
      const parsed = JSON.parse(backup);
      if (Array.isArray(parsed) && parsed.every((c: unknown) => typeof c === 'string')) {
        try { localStorage.setItem(PALETTE_KEY, backup); } catch {}
        toast.success("Recovered your saved colors from a backup.");
        return parsed.slice(0, MAX_PALETTE_SIZE);
      }
    }
  } catch {}
  return DEFAULT_PALETTE;
}
function persistPalette(palette: string[]): boolean {
  try {
    localStorage.setItem(PALETTE_BACKUP_KEY, JSON.stringify(palette));
  } catch {}
  try {
    localStorage.setItem(PALETTE_KEY, JSON.stringify(palette));
    return true;
  } catch {
    toast.error("Couldn't save colors: storage may be full. Your colors are still available this session.");
    return false;
  }
}
interface ToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  color: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  lightenDarkenIntensity: number;
  onLightenDarkenIntensityChange: (intensity: number) => void;
  fillMode: 'fill' | 'unfill';
  onFillModeChange: (mode: 'fill' | 'unfill') => void;
  hasSelection: boolean;
  hasClipboard: boolean;
  isPasting: boolean;
  clipboardSlots: { previewUrl: string; width: number; height: number }[];
  activeClipboardIndex: number;
  onCopySelection: () => void;
  onCancelPaste: () => void;
  onSelectClipboardSlot: (index: number) => void;
  onDeleteClipboardSlot: (index: number) => void;
  onSave: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}
const brushTools: ToolType[] = ['pencil', 'eraser', 'lighten', 'darken'];
const Toolbar = React.memo(function Toolbar({ 
  activeTool, 
  onToolChange, 
  color, 
  onColorChange,
  brushSize,
  onBrushSizeChange,
  lightenDarkenIntensity,
  onLightenDarkenIntensityChange,
  fillMode,
  onFillModeChange,
  hasSelection,
  hasClipboard,
  isPasting,
  clipboardSlots,
  activeClipboardIndex,
  onCopySelection,
  onCancelPaste,
  onSelectClipboardSlot,
  onDeleteClipboardSlot,
  onSave,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}: ToolbarProps) {
  const [palette, setPalette] = useState<string[]>(loadPalette);
  const handleAddColor = useCallback(() => {
    if (!palette.includes(color)) {
      const next = [color, ...palette].slice(0, MAX_PALETTE_SIZE);
      if (persistPalette(next)) {
        setPalette(next);
      } else {
        setPalette(next);
      }
    }
  }, [palette, color]);
  const handleRemoveColor = useCallback((colorToRemove: string) => {
    const next = palette.filter(c => c !== colorToRemove);
    persistPalette(next);
    setPalette(next);
  }, [palette]);
  useEffect(() => {
    persistPalette(palette);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div id="tour-toolbar" className="w-full md:w-72 bg-background flex flex-col h-full">
      <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar">
        <section>
          <h3 className="text-xs font-bold text-text-subtle uppercase tracking-wider mb-3">Color</h3>
          <CustomColorPicker 
            color={color}
            onChange={onColorChange}
            onSaveToPalette={handleAddColor}
            palette={palette}
            onRemoveFromPalette={handleRemoveColor}
            onActivateEyedropper={() => onToolChange('picker')}
          />
        </section>
        <div className="h-px bg-surface-border" />
        {brushTools.includes(activeTool) && (
          <>
            <section>
              <h3 className="text-xs font-bold text-text-subtle uppercase tracking-wider mb-3">Brush Size</h3>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={64}
                  value={brushSize}
                  onChange={(e) => onBrushSizeChange(Number(e.target.value))}
                  className="flex-1 h-2 bg-surface-hover rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <input
                  type="number"
                  min={1}
                  max={256}
                  value={brushSize}
                  onChange={(e) => {
                    const v = Math.max(1, Math.min(256, Number.parseInt(e.target.value || '1', 10) || 1));
                    onBrushSizeChange(v);
                  }}
                  className="w-14 text-white font-mono text-sm bg-surface-hover px-2 py-1 rounded text-center border border-surface-border focus:border-primary outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                  aria-label="Brush size (pixels)"
                />
              </div>
            </section>
            {(activeTool === 'lighten' || activeTool === 'darken') && (
              <section className="mt-4">
                <h3 className="text-xs font-bold text-text-subtle uppercase tracking-wider mb-3">Intensity</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={lightenDarkenIntensity}
                    onChange={(e) => onLightenDarkenIntensityChange(Number(e.target.value))}
                    className="flex-1 h-2 bg-surface-hover rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-white font-mono text-sm bg-surface-hover px-2 py-1 rounded min-w-[2rem] text-center">{lightenDarkenIntensity}</span>
                </div>
              </section>
            )}
            <div className="h-px bg-surface-border" />
          </>
        )}
        {activeTool === 'fill' && (
          <>
            <section>
              <h3 className="text-xs font-bold text-text-subtle uppercase tracking-wider mb-3">Fill Mode</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => onFillModeChange('fill')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    fillMode === 'fill'
                      ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10'
                      : 'bg-surface text-text-muted border-surface-border hover:bg-surface-hover hover:text-foreground'
                  }`}
                >
                  Fill
                </button>
                <button
                  onClick={() => onFillModeChange('unfill')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    fillMode === 'unfill'
                      ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10'
                      : 'bg-surface text-text-muted border-surface-border hover:bg-surface-hover hover:text-foreground'
                  }`}
                >
                  Unfill
                </button>
              </div>
            </section>
            <div className="h-px bg-surface-border" />
          </>
        )}
        <section>
          <div className="flex justify-between items-center mb-3">
             <h3 className="text-xs font-bold text-text-subtle uppercase tracking-wider">Tools</h3>
             <div className="flex gap-1">
                <button 
                  onClick={onUndo} 
                  disabled={!canUndo}
                  className="p-1.5 bg-surface-hover border border-surface-border rounded hover:text-white text-text-muted disabled:opacity-30 disabled:hover:text-text-muted transition-colors"
                  title="Undo (Ctrl+Z)"
                  aria-label="Undo"
                >
                  <Undo size={14} aria-hidden="true" />
                </button>
                <button 
                  onClick={onRedo}
                  disabled={!canRedo}
                  className="p-1.5 bg-surface-hover border border-surface-border rounded hover:text-white text-text-muted disabled:opacity-30 disabled:hover:text-text-muted transition-colors"
                  title="Redo (Ctrl+Y)"
                  aria-label="Redo"
                >
                  <Redo size={14} aria-hidden="true" />
                </button>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ToolBtn 
              active={activeTool === 'pencil'} 
              onClick={() => onToolChange('pencil')} 
              icon={<Pencil size={18} />} 
              label="Pencil" 
            />
            <ToolBtn 
              active={activeTool === 'eraser'} 
              onClick={() => onToolChange('eraser')} 
              icon={<Eraser size={18} />} 
              label="Eraser" 
            />
            <ToolBtn 
              active={activeTool === 'fill'} 
              onClick={() => onToolChange('fill')} 
              icon={<PaintBucket size={18} />} 
              label="Fill" 
            />
            <ToolBtn 
              active={activeTool === 'marquee'} 
              onClick={() => onToolChange('marquee')} 
              icon={<Clipboard size={18} />} 
              label="Select"
            />
            <ToolBtn 
              active={activeTool === 'picker'} 
              onClick={() => onToolChange('picker')} 
              icon={<Pipette size={18} />} 
              label="Picker" 
            />
            <ToolBtn 
              active={activeTool === 'rect'} 
              onClick={() => onToolChange('rect')} 
              icon={<Square size={18} />} 
              label="Rectangle" 
            />
            <ToolBtn 
              active={activeTool === 'circle'} 
              onClick={() => onToolChange('circle')} 
              icon={<Circle size={18} />} 
              label="Circle" 
            />
            <ToolBtn 
              active={activeTool === 'triangle'} 
              onClick={() => onToolChange('triangle')} 
              icon={<Triangle size={18} />} 
              label="Triangle" 
            />
            <ToolBtn 
              active={activeTool === 'lighten'} 
              onClick={() => onToolChange('lighten')} 
              icon={<Sun size={18} />} 
              label="Lighten" 
            />
            <ToolBtn 
              active={activeTool === 'darken'} 
              onClick={() => onToolChange('darken')} 
              icon={<Moon size={18} />} 
              label="Darken" 
            />
          </div>
        </section>
        <div className="h-px bg-surface-border" />
        <section>
          <h3 className="text-xs font-bold text-text-subtle uppercase tracking-wider mb-3">Actions</h3>
          <div className="space-y-2">
            {hasSelection && !isPasting && (
              <button 
                onClick={onCopySelection}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-surface-hover hover:bg-surface text-white font-bold rounded-lg transition-colors border border-surface-border"
              >
                <Copy size={16} /> Copy Selection
              </button>
            )}
            {hasClipboard && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-text-subtle uppercase tracking-wider">Clipboard</span>
                  {isPasting && (
                    <button onClick={onCancelPaste} className="text-[10px] text-red-400 hover:text-red-300 font-bold">Done</button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {clipboardSlots.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() => onSelectClipboardSlot(i)}
                      className={`relative group rounded-lg border overflow-hidden aspect-square ${
                        i === activeClipboardIndex && isPasting
                          ? 'border-primary ring-1 ring-primary'
                          : 'border-surface-border hover:border-white/30'
                      }`}
                      style={{ imageRendering: 'pixelated' }}
                    >
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url(${slot.previewUrl})`,
                          backgroundSize: 'contain',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          backgroundColor: '#1b1a1a',
                        }}
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteClipboardSlot(i); }}
                        aria-label="Delete clipboard slot"
                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} className="text-white" aria-hidden="true" />
                      </button>
                    </button>
                  ))}
                  {clipboardSlots.length === 0 && (
                    <div className="col-span-3 py-4 text-center text-[10px] text-text-subtle">
                      Drag to select a region
                    </div>
                  )}
                </div>
              </div>
            )}
            <button 
              onClick={onSave}
              className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-all shadow-sm shadow-primary/10"
            >
              <FileImage size={18} /> Export Texture
            </button>
          </div>
        </section>
      </div>
    </div>
  );
});
export default Toolbar;
function ToolBtn({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${active 
        ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10' 
        : 'bg-surface text-text-muted border-surface-border hover:bg-surface-hover hover:text-foreground'}`}
    >
      {icon}
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  );
}
