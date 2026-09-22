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

import { useState, useRef, useEffect, useCallback } from 'react';
import { Pipette, Plus, Check } from 'lucide-react';
import { hexToHsv, hsvToHex } from '@/lib/pixel-utils';
const hasNativeEyedropper = typeof window !== 'undefined' && 'EyeDropper' in window;
interface CustomColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onSaveToPalette?: (color: string) => void;
  palette?: string[];
  onRemoveFromPalette?: (color: string) => void;
  onActivateEyedropper?: () => void;
}
export default function CustomColorPicker({ 
  color, 
  onChange, 
  onSaveToPalette,
  palette = [],
  onRemoveFromPalette,
  onActivateEyedropper
}: CustomColorPickerProps) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [value, setValue] = useState(100);
  const [inputValue, setInputValue] = useState(color);
  const [eyedropperActive, setEyedropperActive] = useState(false);
  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const hsv = hexToHsv(color);
    setHue(hsv.h);
    setSaturation(hsv.s);
    setValue(hsv.v);
    setInputValue(color);
  }, [color]);
  const updateColorFromHsv = useCallback((h: number, s: number, v: number) => {
    const hex = hsvToHex(h, s, v);
    onChange(hex);
    setInputValue(hex);
  }, [onChange]);
  const handleSaturationMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = saturationRef.current?.getBoundingClientRect();
    if (!rect) return;
    const handleMove = (moveEvent: MouseEvent) => {
      const x = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (moveEvent.clientY - rect.top) / rect.height));
      const newS = x * 100;
      const newV = 100 - (y * 100);
      setSaturation(newS);
      setValue(newV);
      updateColorFromHsv(hue, newS, newV);
    };
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    handleMove(e.nativeEvent);
  }, [hue, updateColorFromHsv]);
  const handleHueMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = hueRef.current?.getBoundingClientRect();
    if (!rect) return;
    const handleMove = (moveEvent: MouseEvent) => {
      const x = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
      const newH = x * 360;
      setHue(newH);
      updateColorFromHsv(newH, saturation, value);
    };
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    handleMove(e.nativeEvent);
  }, [saturation, value, updateColorFromHsv]);
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexVal = e.target.value;
    setInputValue(hexVal);
    if (/^#[0-9A-Fa-f]{6}$/.test(hexVal)) {
      onChange(hexVal);
      const hsv = hexToHsv(hexVal);
      setHue(hsv.h);
      setSaturation(hsv.s);
      setValue(hsv.v);
    }
  };
  const applyPickedColor = useCallback((hex: string) => {
    onChange(hex);
    setInputValue(hex);
    const hsv = hexToHsv(hex);
    setHue(hsv.h);
    setSaturation(hsv.s);
    setValue(hsv.v);
  }, [onChange]);
  const handleNativeEyedropper = useCallback(async () => {
    try {
      setEyedropperActive(true);
      // @ts-expect-error - EyeDropper API not in TypeScript lib
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      applyPickedColor(result.sRGBHex);
    } catch {
    } finally {
      setEyedropperActive(false);
    }
  }, [applyPickedColor]);
  const handleEyedropper = useCallback(() => {
    if (hasNativeEyedropper) {
      handleNativeEyedropper();
    } else {
      onActivateEyedropper?.();
    }
  }, [handleNativeEyedropper, onActivateEyedropper]);
  const presetColors = [
    '#ff0000', '#ff8000', '#ffff00', '#80ff00',
    '#00ff00', '#00ff80', '#00ffff', '#0080ff',
    '#0000ff', '#8000ff', '#ff00ff', '#ff0080',
    '#ffffff', '#cccccc', '#888888', '#000000',
  ];
  return (
    <div className="space-y-4">
      <div 
        ref={saturationRef}
        className="relative w-full h-40 rounded-lg cursor-crosshair overflow-hidden border border-surface-border"
        style={{
          background: `linear-gradient(to top, #000, transparent), 
                       linear-gradient(to right, #fff, transparent),
                       hsl(${hue}, 100%, 50%)`
        }}
        onMouseDown={handleSaturationMouseDown}
      >
        <div 
          className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: `${saturation}%`, 
            top: `${100 - value}%`,
            backgroundColor: color
          }}
        />
      </div>
      <div 
        ref={hueRef}
        className="relative w-full h-4 rounded-lg cursor-pointer overflow-hidden border border-surface-border"
        style={{
          background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
        }}
        onMouseDown={handleHueMouseDown}
      >
        <div 
          className="absolute top-0 w-1 h-full bg-white border border-gray-400 pointer-events-none"
          style={{ left: `${(hue / 360) * 100}%` }}
        />
      </div>
      <div className="flex gap-3 items-center">
        <div 
          className="w-12 h-12 rounded-lg border-2 border-white/20 shadow-lg shrink-0"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex gap-1.5">
            <input 
              type="text" 
              value={inputValue}
              onChange={handleHexChange}
              className="flex-1 min-w-0 bg-surface border border-surface-border rounded px-2 py-1.5 text-xs text-gray-300 font-mono uppercase focus:border-primary outline-none"
              placeholder="#000000"
              maxLength={7}
            />
            <button 
              onClick={handleEyedropper}
              className={`p-1.5 shrink-0 bg-surface-hover border border-surface-border rounded hover:border-primary text-text-muted hover:text-white transition-colors ${eyedropperActive ? 'ring-2 ring-primary' : ''}`}
              title={hasNativeEyedropper ? "Pick color from screen" : "Pick color from canvas"}
              aria-label={hasNativeEyedropper ? "Pick color from screen" : "Pick color from canvas"}
            >
              <Pipette size={14} />
            </button>
            {onSaveToPalette && (
              <button 
                onClick={() => onSaveToPalette(color)}
                className="p-1.5 shrink-0 bg-surface-hover border border-surface-border rounded hover:border-primary text-text-muted hover:text-white transition-colors"
                title="Save to palette"
                aria-label="Save to palette"
              >
                <Plus size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="text-xs font-bold text-text-subtle uppercase tracking-wider mb-2">Presets</div>
        <div className="grid grid-cols-8 gap-1">
          {presetColors.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                onChange(preset);
                const hsv = hexToHsv(preset);
                setHue(hsv.h);
                setSaturation(hsv.s);
                setValue(hsv.v);
              }}
              className={`aspect-square rounded border border-surface-border hover:scale-110 transition-transform ${color === preset ? 'ring-2 ring-primary border-transparent' : ''}`}
              style={{ backgroundColor: preset }}
              title={preset}
            />
          ))}
        </div>
      </div>
      {palette.length > 0 && (
        <div>
          <div className="text-xs font-bold text-text-subtle uppercase tracking-wider mb-2">Saved Colors</div>
          <div className="grid grid-cols-8 gap-1">
            {palette.map((savedColor, i) => (
              <button
                key={i}
                onClick={() => {
                  onChange(savedColor);
                  const hsv = hexToHsv(savedColor);
                  setHue(hsv.h);
                  setSaturation(hsv.s);
                  setValue(hsv.v);
                }}
                className="aspect-square rounded border border-surface-border hover:scale-110 transition-transform relative group"
                style={{ backgroundColor: savedColor }}
                title={savedColor}
              >
                {color === savedColor && (
                  <Check size={10} className="absolute inset-0 m-auto text-white drop-shadow-lg" />
                )}
                {onRemoveFromPalette && (
                  <div 
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromPalette(savedColor);
                    }}
                  >
                    <span className="text-[8px] text-white">×</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}