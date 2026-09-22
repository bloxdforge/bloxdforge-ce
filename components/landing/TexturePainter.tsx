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

import { useState, useEffect, useMemo, useRef } from "react";
import { Paintbrush, MousePointer2 } from "lucide-react";
const swordData = {
  "blade": [ 13, 14, 15, 28, 29, 30, 31, 43, 44, 45, 46, 47, 58, 59, 60, 61, 62, 73, 74, 75, 76, 77, 88, 89, 90, 91, 92, 103, 104, 105, 106, 107, 118, 119, 120, 121, 122, 134, 135, 136, 137, 151, 152 ],
  "guard": [ 98, 99, 114, 115, 116, 131, 132, 133, 147, 148, 149, 150, 164, 165, 166, 167, 181, 182, 183, 184, 198, 199, 200, 201, 216, 217 ],
  "hilt": [ 179, 180, 194, 195, 196, 210, 211 ],
  "pommel": [ 208, 209, 224, 225, 226, 240, 241, 242 ]
};
const PART_COLORS = {
  blade: '#E0E0E0',
  guard: '#B8860B',
  hilt: '#654321',
  pommel: '#B8860B'
};
export default function TexturePainter({ isPaused }: { isPaused: boolean }) {
  const [pixels, setPixels] = useState<string[]>(Array(256).fill(''));
  const SWORD_ANIMATION_SEQUENCE = useMemo(() => [
    ...swordData.blade, ...swordData.guard, ...swordData.hilt, ...swordData.pommel
  ], []);
  const PIXEL_TO_PART_MAP = useMemo(() => {
    const map = new Map<number, keyof typeof PART_COLORS>();
    for (const partName in swordData) {
      for (const index of swordData[partName as keyof typeof swordData]) {
        map.set(index, partName as keyof typeof swordData);
      }
    }
    return map;
  }, []);
  const isPausedRef = useRef(isPaused);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => {
    let isCancelled = false;
    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
    const waitForPlay = async () => {
      while (isPausedRef.current && !isCancelled) {
        await wait(200);
      }
    };
    const runAnimation = async () => {
      if (isCancelled) return;
      await waitForPlay();
      for (let i = 0; i < SWORD_ANIMATION_SEQUENCE.length; i++) {
        if (isCancelled) return;
        await waitForPlay();
        const pixelIndex = SWORD_ANIMATION_SEQUENCE[i];
        const partId = PIXEL_TO_PART_MAP.get(pixelIndex);
        if (partId) {
          setPixels(prev => {
            const next = [...prev];
            next[pixelIndex] = PART_COLORS[partId];
            return next;
          });
        }
        await wait(25);
      }
      if (isCancelled) return;
      await waitForPlay();
      await wait(1500); 
      if (isCancelled) return;
      await waitForPlay();
      setPixels(Array(256).fill(''));
      await wait(500);
      runAnimation();
    };
    runAnimation();
    return () => {
      isCancelled = true;
    };
  }, [SWORD_ANIMATION_SEQUENCE, PIXEL_TO_PART_MAP]);
  return (
    <div className="relative bg-[#0F0F0F] border border-surface-border rounded-xl overflow-hidden shadow-2xl h-[350px] flex items-center justify-center">
      <div className="grid grid-cols-16 gap-[1px] bg-surface-elevated border border-surface-border p-1">
        {pixels.map((color, i) => (
          <div 
            key={i} 
            className="w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-100"
            style={{ backgroundColor: color || '#141313' }}
          />
        ))}
      </div>
      <div className="absolute top-4 left-4 flex gap-2">
        <div className="w-8 h-8 bg-primary rounded border border-white/20 flex items-center justify-center text-white"><Paintbrush size={16} /></div>
        <div className="w-8 h-8 bg-surface-elevated rounded border border-white/10 flex items-center justify-center text-text-subtle"><MousePointer2 size={16} /></div>
      </div>
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-xs font-mono text-text-muted border border-white/10">
        16x16 px
      </div>
    </div>
  );
}