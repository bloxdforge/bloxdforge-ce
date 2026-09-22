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

import { useState, useMemo } from "react";
import { X, FolderInput, Folder } from "lucide-react";
interface MoveFileModalProps {
  fileName?: string;
  fileCount?: number;
  fileNames?: string[];
  currentFolder: string;
  existingFolders: string[];
  onConfirm: (newFolder: string) => void;
  onCancel: () => void;
}
export default function MoveFileModal({ fileName, fileCount, fileNames, currentFolder, existingFolders, onConfirm, onCancel }: MoveFileModalProps) {
  const [newFolder, setNewFolder] = useState(currentFolder);
  const isBulk = fileCount !== undefined && fileCount > 1;
  const displayFiles = useMemo(() => {
    if (isBulk) return fileNames!.slice(0, 6);
    if (fileName) return [fileName];
    return [];
  }, [isBulk, fileNames, fileName]);
  const handleConfirm = () => {
    onConfirm(newFolder.trim());
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-background border border-surface-border rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-surface-border">
          <h3 className="font-bold text-white flex items-center gap-2">
            <FolderInput className="text-primary" />
            {isBulk ? `Move ${fileCount} Files` : 'Move File'}
          </h3>
          <button onClick={onCancel} className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-sm text-text-muted">
            {isBulk
              ? `${displayFiles.slice(0, 3).join(', ')}${(displayFiles.length > 3 || (fileNames?.length || 0) > 6) ? ` and ${(fileNames?.length || 0) - 3} more` : ''}`
              : <code className="bg-surface-hover px-1.5 py-1 rounded-md text-primary text-sm font-mono">{fileName}</code>
            }
          </p>
          <div className="space-y-2">
            <label className="text-sm text-text-muted">Destination Folder</label>
            <div className="relative">
              <Folder className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle w-4 h-4" />
              <input
                autoFocus
                type="text"
                placeholder="e.g. textures/blocks"
                className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              />
            </div>
            <p className="text-[10px] text-text-subtle">Use / to create subfolders. Leave empty for pack root.</p>
          </div>
          {existingFolders.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-text-muted">Or pick an existing folder</p>
              <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto custom-scrollbar">
                <button
                  onClick={() => setNewFolder('')}
                  className={`text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                    !newFolder || newFolder === '/'
                      ? 'bg-primary text-white'
                      : 'bg-[#0a0a0a] text-text-muted hover:bg-surface-hover hover:text-white'
                  }`}
                >
                  <Folder size={12} className="inline mr-1.5 opacity-50" />
                  Root
                </button>
                {existingFolders.map((folder) => (
                  <button
                    key={folder}
                    onClick={() => setNewFolder(folder)}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition-colors truncate ${
                      newFolder === folder
                        ? 'bg-primary text-white'
                        : 'bg-[#0a0a0a] text-text-muted hover:bg-surface-hover hover:text-white'
                    }`}
                  >
                    {folder}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 bg-surface-hover hover:bg-surface text-white font-bold rounded-lg transition-colors border border-surface-border"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-all shadow-sm shadow-primary/10"
            >
              {isBulk ? `Move ${fileCount} Files` : 'Move'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}