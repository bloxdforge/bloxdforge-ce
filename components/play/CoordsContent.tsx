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

import { Trash2, MapPin } from "lucide-react";
interface CoordsContentProps {
  coords: {name: string, x: string, y: string, z: string}[];
  newCoord: {name: string, x: string, y: string, z: string};
  setNewCoord: (val: {name: string, x: string, y: string, z: string}) => void;
  onSave: () => void;
  onDelete: (index: number) => void;
}
export default function CoordsContent({ coords, newCoord, setNewCoord, onSave, onDelete }: CoordsContentProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2 bg-surface p-3 rounded-lg border border-surface-border">
        <input 
          placeholder="Location Name (e.g. Base, Diamond Mine)" 
          className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors" 
          value={newCoord.name} 
          onChange={e => setNewCoord({...newCoord, name: e.target.value})} 
        />
        <div className="grid grid-cols-3 gap-2">
          <input 
            placeholder="X" 
            className="bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors text-center font-mono" 
            value={newCoord.x} 
            onChange={e => setNewCoord({...newCoord, x: e.target.value})} 
          />
          <input 
            placeholder="Y" 
            className="bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors text-center font-mono" 
            value={newCoord.y} 
            onChange={e => setNewCoord({...newCoord, y: e.target.value})} 
          />
          <input 
            placeholder="Z" 
            className="bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors text-center font-mono" 
            value={newCoord.z} 
            onChange={e => setNewCoord({...newCoord, z: e.target.value})} 
          />
        </div>
        <button 
          onClick={onSave} 
          disabled={!newCoord.name || !newCoord.x}
          className="w-full bg-primary text-white font-bold text-xs rounded-lg hover:bg-primary-hover transition-all shadow-sm shadow-primary/10 disabled:opacity-50 disabled:shadow-none mt-1"
        >
          Save Coordinate
        </button>
      </div>
      <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {coords.length === 0 && (
           <div className="text-center py-4 text-xs text-text-subtle italic border-2 border-dashed border-surface-border rounded-lg">No saved coordinates</div>
        )}
        {coords.map((c, i) => (
          <div key={i} className="flex justify-between items-center bg-background border border-surface-border p-3 rounded-lg group hover:border-hairline-strong transition-colors">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground">{c.name}</span>
              <span className="font-mono text-[10px] text-text-subtle flex items-center gap-1 mt-0.5">
                <MapPin size={10} className="text-primary" /> {c.x}, {c.y}, {c.z}
              </span>
            </div>
            <button 
              onClick={() => onDelete(i)} 
              className="p-1.5 text-text-subtle hover:text-red-400 hover:bg-surface rounded-md transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
