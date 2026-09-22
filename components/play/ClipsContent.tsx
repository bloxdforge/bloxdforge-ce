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

import { Copy, Trash2, Check } from "lucide-react";
import { useState } from "react";
interface ClipsContentProps {
  clips: string[];
  clipInput: string;
  setClipInput: (val: string) => void;
  onSave: () => void;
  onCopy: (text: string) => void;
  onDelete: (index: number) => void;
}
export default function ClipsContent({ clips, clipInput, setClipInput, onSave, onCopy, onDelete }: ClipsContentProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const handleCopy = (text: string, index: number) => {
    onCopy(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input 
          placeholder="Paste a link, command, or snippet..." 
          className="flex-1 bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors" 
          value={clipInput}
          onChange={e => setClipInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSave()}
        />
        <button 
          onClick={onSave} 
          disabled={!clipInput.trim()}
          className="bg-primary text-white font-bold text-xs rounded-lg px-4 hover:bg-primary-hover transition-all shadow-sm shadow-primary/10 disabled:opacity-50 disabled:shadow-none"
        >
          Add
        </button>
      </div>
      <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {clips.length === 0 && (
           <div className="text-center py-4 text-xs text-text-subtle italic border-2 border-dashed border-surface-border rounded-lg">Clipboard is empty</div>
        )}
        {clips.map((clip, i) => (
          <div key={i} className="flex justify-between items-center bg-background border border-surface-border p-2.5 rounded-lg group hover:border-hairline-strong transition-colors">
            <span className="truncate max-w-[160px] text-xs font-mono text-gray-300">{clip}</span>
            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleCopy(clip, i)} 
                className="p-1.5 text-text-muted hover:text-white hover:bg-surface rounded-md transition-colors" 
                title="Copy"
              >
                {copiedIndex === i ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
              <button 
                onClick={() => onDelete(i)} 
                className="p-1.5 text-text-muted hover:text-red-400 hover:bg-surface rounded-md transition-colors" 
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
