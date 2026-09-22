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
import { hexToHsv, hsvToHex } from '@/lib/pixel-utils';
interface RemixColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}
export default function RemixColorPicker({ color, onChange }: RemixColorPickerProps) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [value, setValue] = useState(100);
  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const hsv = hexToHsv(color);
    setHue(hsv.h);
    setSaturation(hsv.s);
    setValue(hsv.v);
  }, [color]);
  const updateColor = useCallback((h: number, s: number, v: number) => {
    onChange(hsvToHex(h, s, v));
  }, [onChange]);
  const handleSaturationDown = (e: React.MouseEvent) => {
    const rect = saturationRef.current?.getBoundingClientRect();
    if (!rect) return;
    const move = (moveEvent: MouseEvent) => {
      const x = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (moveEvent.clientY - rect.top) / rect.height));
      const s = x * 100;
      const v = 100 - (y * 100);
      setSaturation(s);
      setValue(v);
      updateColor(hue, s, v);
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    move(e.nativeEvent);
  };
  const handleHueDown = (e: React.MouseEvent) => {
    const rect = hueRef.current?.getBoundingClientRect();
    if (!rect) return;
    const move = (moveEvent: MouseEvent) => {
      const x = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
      const h = x * 360;
      setHue(h);
      updateColor(h, saturation, value);
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    move(e.nativeEvent);
  };
  return (
    <div className="space-y-3 bg-background p-3 rounded-lg border border-surface-border">
      <div 
        ref={saturationRef}
        className="relative w-full h-24 rounded-lg cursor-crosshair overflow-hidden border border-surface-border"
        style={{ background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hue}, 100%, 50%)` }}
        onMouseDown={handleSaturationDown}
      >
        <div 
          className="absolute w-4 h-4 border-2 border-white rounded-full shadow pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${saturation}%`, top: `${100 - value}%`, backgroundColor: color }}
        />
      </div>
      <div 
        ref={hueRef}
        className="relative w-full h-2 rounded-full cursor-pointer overflow-hidden border border-surface-border"
        style={{ background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
        onMouseDown={handleHueDown}
      >
        <div 
          className="absolute top-0 w-1 h-full bg-white shadow pointer-events-none -translate-x-1/2 rounded-full"
          style={{ left: `${(hue / 360) * 100}%` }}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md border border-surface-border shrink-0" style={{ backgroundColor: color }} />
        <input 
          type="text" 
          value={color}
          onChange={e => onChange(e.target.value)}
          spellCheck={false}
          className="flex-1 min-w-0 bg-surface border border-surface-border rounded-lg px-2 py-1.5 text-[11px] font-mono tabular-nums text-foreground uppercase outline-none focus:border-primary transition-colors duration-150"
        />
      </div>
    </div>
  );
}
