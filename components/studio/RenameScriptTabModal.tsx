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

import { useState } from "react";
import { X, FileCode } from "lucide-react";
interface RenameScriptTabModalProps {
  currentName: string;
  onConfirm: (newName: string) => void;
  onCancel: () => void;
}
export default function RenameScriptTabModal({ currentName, onConfirm, onCancel }: RenameScriptTabModalProps) {
  const [value, setValue] = useState(currentName);
  const handleConfirm = () => {
    if (value.trim()) onConfirm(value.trim());
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-background border border-surface-border rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-surface-border">
          <h3 className="font-bold text-white flex items-center gap-2">
            <FileCode className="text-primary" />
            Rename Script Tab
          </h3>
          <button onClick={onCancel} className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-text-muted">Tab Name</label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. My Script"
              className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 bg-surface-hover hover:bg-surface text-white rounded-lg text-sm font-bold transition-colors border border-surface-border"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!value.trim()}
              className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold transition-all shadow-sm shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Rename
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
