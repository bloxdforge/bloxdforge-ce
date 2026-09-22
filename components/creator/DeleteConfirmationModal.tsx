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
import { AlertTriangle, X } from "lucide-react";
import { useSettingsStore } from "@/stores/useSettingsStore";
interface DeleteConfirmationModalProps {
  fileName: string;
  onConfirm: () => void;
  onCancel: () => void;
}
export default function DeleteConfirmationModal({ fileName, onConfirm, onCancel }: DeleteConfirmationModalProps) {
  const { setConfirmTextureDeletion } = useSettingsStore();
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const handleConfirm = () => {
    if (dontAskAgain) {
      setConfirmTextureDeletion(false);
    }
    onConfirm();
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-background border border-surface-border rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-surface-border">
          <h3 className="font-bold text-white flex items-center gap-2">
            <AlertTriangle className="text-red-500" />
            Confirm Deletion
          </h3>
          <button onClick={onCancel} aria-label="Close modal" className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors"><X size={20} aria-hidden="true"/></button>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-gray-300">
            Are you sure you want to permanently delete <code className="bg-surface-hover px-1.5 py-1 rounded-md text-primary text-sm font-mono">{fileName}</code>? This action cannot be undone.
          </p>
          <div className="flex items-center space-x-3">
            <input
              id="dont-ask-again"
              type="checkbox"
              checked={dontAskAgain}
              onChange={(e) => setDontAskAgain(e.target.checked)}
              className="h-4 w-4 rounded border-gray-500 bg-surface-hover text-primary focus:ring-primary"
            />
            <label htmlFor="dont-ask-again" className="text-sm text-text-muted">
              Don&apos;t ask me again
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onCancel} className="px-6 py-2.5 bg-surface-hover hover:bg-surface text-white font-bold rounded-lg transition-colors border border-surface-border">
              Cancel
            </button>
            <button onClick={handleConfirm} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}