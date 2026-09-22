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

import { X, ShieldAlert, FileWarning } from "lucide-react";
export default function SanitizationModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-background border border-surface-border rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-surface-border">
          <h3 className="font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-yellow-500" size={20} />
            File Safety
          </h3>
          <button onClick={onClose} aria-label="Close modal" className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors"><X size={20} aria-hidden="true"/></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500 mx-auto mb-2">
            <FileWarning size={24} />
          </div>
          <p className="text-gray-300 text-center">
            To ensure compatibility with your operating system, we have automatically renamed this file.
          </p>
          <p className="text-sm text-text-subtle text-center bg-background p-3 rounded-lg border border-surface-border">
            Names containing non-English characters, reserved system names (like NUL or CON), or dots only are replaced with <span className="text-primary font-mono">bloxdforge-creation</span>.
          </p>
          <button 
            onClick={onClose} 
            className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
