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

import React, { useState, useRef, useMemo, useEffect } from "react";
import { Upload, FileImage, Trash2, Search, FolderInput, ChevronRight, ChevronDown, Box, Download, ArrowLeft, Folder, FileCode, ImageIcon, Loader2, Save, Copy, Edit2, CheckSquare, Square, Move, FilePlus, FolderPlus, ListChecks } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useCreatorStore } from "@/stores/useCreatorStore";
import { useDragScroll } from "@/hooks/useDragScroll";
import toast from "react-hot-toast";
function SaveStatus() {
  const { saveStatus, lastSaved } = useCreatorStore();
  let icon = null;
  let tooltip = '';
  switch (saveStatus) {
    case 'saving':
      icon = <Loader2 size={14} className="animate-spin text-text-subtle" data-force-animation="on" />;
      tooltip = 'Saving...';
      break;
    case 'saved':
    case 'unmodified':
      icon = <Save size={14} className="text-green-500" />;
      tooltip = lastSaved ? `All changes saved ${formatDistanceToNow(lastSaved, { addSuffix: true })}` : 'All changes saved';
      break;
    case 'modified':
      icon = <Save size={14} className="text-yellow-500" />;
      tooltip = 'Unsaved changes';
      break;
  }
  if (!icon) return null;
  return (
    <div className="group relative flex items-center" title={tooltip}>
      {icon}
    </div>
  );
}
interface TreeNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  file?: File;
  children: Record<string, TreeNode>;
}
interface FileTreeItemProps {
  node: TreeNode;
  level: number;
  selectedFile: File | null;
  onSelect: (f: File) => void;
  onDelete: (n: string) => void;
  onDeleteFolder: (n: string) => void;
  onDuplicate: (n: string) => void;
  onMove: (n: string) => void;
  renamingPath: string | null;
  onStartRename: (path: string) => void;
  onCommitRename: (oldPath: string, newName: string) => void;
  renamingFolderPath: string | null;
  onStartFolderRename: (path: string) => void;
  onCommitFolderRename: (oldPath: string, newName: string) => void;
  selectedFilePaths: Set<string>;
  onToggleSelect: (path: string) => void;
  multiSelectMode: boolean;
}
const FileTreeItem = React.memo(function FileTreeItem({ 
  node, 
  level, 
  selectedFile, 
  onSelect, 
  onDelete,
  onDeleteFolder,
  onDuplicate,
  onMove,
  renamingPath,
  onStartRename,
  onCommitRename,
  renamingFolderPath,
  onStartFolderRename,
  onCommitFolderRename,
  selectedFilePaths,
  onToggleSelect,
  multiSelectMode
}: FileTreeItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [newName, setNewName] = useState(node.name);
  const [folderNewName, setFolderNewName] = useState(node.name);
  const isSelected = node.type === 'file' && selectedFile === node.file;
  const isRenaming = renamingPath === node.path;
  const isFolderRenaming = renamingFolderPath === node.path;
  useEffect(() => {
    setNewName(node.name);
    setFolderNewName(node.name);
  }, [node.name]);
  const handleRenameSubmit = () => {
    if (newName !== node.name) {
      onCommitRename(node.path, newName);
    }
    onStartRename('');
  };
  const handleFolderRenameSubmit = () => {
    if (folderNewName !== node.name) {
      onCommitFolderRename(node.path, folderNewName);
    }
    onStartFolderRename('');
  };
  const getIcon = () => {
    if (node.name.endsWith('.glb')) return <Box size={14} className="text-blue-400 shrink-0" />;
    if (node.name.endsWith('.css')) return <FileCode size={14} className="text-yellow-400 shrink-0" />;
    if (node.name.match(/\.jpe?g$/)) return <ImageIcon size={14} className="text-purple-400 shrink-0" />;
    return <FileImage size={14} className={`${isSelected ? 'text-primary' : 'text-text-subtle'} shrink-0`} />;
  };
  if (node.type === 'file') {
    const isChecked = selectedFilePaths.has(node.path);
    return (
      <div 
        className={`group flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer border ${isSelected ? 'bg-primary/10 border-primary/50' : isChecked ? 'bg-primary/5 border-primary/30' : 'border-transparent hover:bg-surface hover:border-surface-border'}`}
        style={{ marginLeft: `${level * 12}px` }}
        onClick={() => node.file && onSelect(node.file)}
        onDoubleClick={() => onStartRename(node.path)}
      >
        <div className="flex items-center gap-2 overflow-hidden w-full">
          {multiSelectMode && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSelect(node.path); }}
              className="p-0.5 rounded hover:bg-surface-hover  shrink-0"
              title="Select for bulk actions"
            >
              {isChecked ? <CheckSquare size={15} className="text-primary" /> : <Square size={15} className="text-text-subtle group-hover:text-text-muted" />}
            </button>
          )}
          {getIcon()}
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameSubmit();
                  if (e.key === 'Escape') onStartRename('');
              }}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              className="bg-hairline-strong text-white text-xs w-full p-0.5 rounded outline-none border border-primary"
            />
          ) : (
            <span className={`text-xs truncate ${isSelected ? 'text-white font-medium' : 'text-text-muted'}`}>
              {node.name}
            </span>
          )}
        </div>
        {!isRenaming && (
          <div className="opacity-50 group-hover:opacity-100 [@media(hover:none)]:opacity-100 flex items-center gap-1 shrink-0 ">
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicate(node.path); }}
              className="p-1 text-text-subtle hover:text-blue-400 rounded "
              title="Duplicate"
            >
              <Copy size={12} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onMove(node.path); }}
              className="p-1 text-text-subtle hover:text-yellow-400 rounded "
              title="Move to folder"
            >
              <FolderInput size={12} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(node.path); }}
              className="p-1 text-text-subtle hover:text-red-400 rounded "
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    );
  }
  return (
    <div>
      <div 
        className="group flex items-center gap-1 py-1 px-2 text-text-muted hover:text-white cursor-pointer select-none"
        style={{ marginLeft: `${level * 12}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Folder size={12} className="text-text-subtle" />
        {isOpen ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        {isFolderRenaming ? (
          <input
            type="text"
            value={folderNewName}
            onChange={(e) => setFolderNewName(e.target.value)}
            onBlur={handleFolderRenameSubmit}
            onKeyDown={(e) => {
                if (e.key === 'Enter') handleFolderRenameSubmit();
                if (e.key === 'Escape') onStartFolderRename('');
            }}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            className="bg-hairline-strong text-white text-xs w-24 p-0.5 rounded outline-none border border-primary"
          />
        ) : (
          <span className="text-xs font-bold">{node.name}</span>
        )}
        {!isFolderRenaming && (
          <div className="opacity-50 group-hover:opacity-100 [@media(hover:none)]:opacity-100 flex items-center gap-1 ml-auto shrink-0 ">
            <button
              onClick={(e) => { e.stopPropagation(); onStartFolderRename(node.path); }}
              className="p-1 text-text-subtle hover:text-blue-400 rounded "
              title="Rename folder"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteFolder(node.path); }}
              className="p-1 text-text-subtle hover:text-red-400 rounded "
              title="Delete folder"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
      {isOpen && (
        <div>
          {Object.values(node.children)
            .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1))
            .map((child) => (
              <FileTreeItem 
                key={child.path} 
                node={child} 
                level={level + 1} 
                selectedFile={selectedFile} 
                onSelect={onSelect}
                onDelete={onDelete}
                onDeleteFolder={onDeleteFolder}
                onDuplicate={onDuplicate}
                onMove={onMove}
                renamingPath={renamingPath}
                onStartRename={onStartRename}
                onCommitRename={onCommitRename}
                renamingFolderPath={renamingFolderPath}
                onStartFolderRename={onStartFolderRename}
                onCommitFolderRename={onCommitFolderRename}
                selectedFilePaths={selectedFilePaths}
                onToggleSelect={onToggleSelect}
                multiSelectMode={multiSelectMode}
              />
            ))}
        </div>
      )}
    </div>
  );
});
interface TextureListProps {
  onCreate: () => void;
  onDelete: (path: string) => void;
  onDeleteFolder: (path: string) => void;
  onMove: (path: string) => void;
  onBulkMove: (paths: string[]) => void;
}
const TextureList = React.memo(function TextureList({ onCreate, onDelete, onDeleteFolder, onMove, onBulkMove }: TextureListProps) {
  const {
    files,
    selectedFile,
    currentPackName,
    addFiles,
    downloadZip,
    downloadFile,
    renameFile,
    renameFolder,
    duplicateFile,
    closePack,
    setSelectedFile,
    createBlankTexture,
    saveCurrentPack
  } = useCreatorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const dragScrollRef = useDragScroll('y');
  const [search, setSearch] = useState("");
  const [renamingPath, setRenamingPath] = useState<string | null>(null);
  const [renamingFolderPath, setRenamingFolderPath] = useState<string | null>(null);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedFilePaths, setSelectedFilePaths] = useState<Set<string>>(new Set());
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileTree = useMemo(() => {
    const root: Record<string, TreeNode> = {};
    files.forEach(file => {
      const fullPath = file.webkitRelativePath || file.name;
      if (search && !file.name.toLowerCase().includes(search.toLowerCase())) return;
      let displayPath = fullPath;
      if (currentPackName && displayPath.startsWith(currentPackName + '/')) {
          displayPath = displayPath.substring(currentPackName.length + 1);
      }
      const pathParts = displayPath.split('/');
      let currentLevel = root;
      pathParts.forEach((part, index) => {
        const isFile = index === pathParts.length - 1;
        const accumulatedPath = pathParts.slice(0, index + 1).join('/');
        const folderFullPath = currentPackName ? `${currentPackName}/${accumulatedPath}` : accumulatedPath;
        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part,
            path: isFile ? fullPath : folderFullPath,
            type: isFile ? 'file' : 'folder',
            file: isFile ? file : undefined,
            children: {}
          };
        }
        if (!isFile) {
          currentLevel = currentLevel[part].children;
        }
      });
    });
    return root;
  }, [files, search, currentPackName]);
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createBlankTexture('_placeholder', 16, 16, newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderInput(false);
    }
  };
  const handleToggleSelect = (path: string) => {
    setSelectedFilePaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };
  const handleToggleMultiSelect = () => {
    if (multiSelectMode) {
      setSelectedFilePaths(new Set());
    }
    setMultiSelectMode(!multiSelectMode);
  };
  const handleSavePack = async () => {
    await saveCurrentPack();
    toast.success('Pack saved.');
  };
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-surface-border space-y-3">
        <div className="flex items-center gap-2 mb-2">
            <button onClick={closePack} className="p-1 hover:bg-surface rounded text-text-muted hover:text-white" title="Back to Dashboard">
                <ArrowLeft size={18} />
            </button>
            <h2 className="font-bold text-white truncate flex-1" title={currentPackName || "Pack"}>{currentPackName}</h2>
            <SaveStatus />
            <button
              onClick={handleSavePack}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-[11px] font-bold rounded-lg transition-all shrink-0"
              title="Save all changes"
            >
              <Save size={13} /> Save Pack
            </button>
        </div>
        <div id="tour-upload-buttons" className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-1 px-2 py-2 bg-surface-hover hover:bg-surface text-white text-[10px] font-bold rounded-lg border border-surface-border transition-colors"
            title="Upload Files"
          >
            <Upload size={14} /> Import File
          </button>
          <button 
            onClick={() => folderInputRef.current?.click()}
            className="flex items-center justify-center gap-1 px-2 py-2 bg-surface-hover hover:bg-surface text-white text-[10px] font-bold rounded-lg border border-surface-border transition-colors"
            title="Upload Folder"
          >
            <FolderInput size={14} /> Import Folder
          </button>
        </div>
        <button
          id="tour-download-button"
          onClick={downloadZip}
          className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg transition-all shadow-sm shadow-primary/10"
        >
          <Download size={16} /> Download Pack
        </button>
        {selectedFile && (
          <button
            onClick={() => downloadFile(selectedFile.webkitRelativePath || selectedFile.name)}
            className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-surface-hover hover:bg-surface text-white text-xs font-bold rounded-lg transition-colors border border-surface-border"
            title="Export selected file as PNG or GLB"
          >
            <FileImage size={14} /> Export File
          </button>
        )}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-text-subtle w-3 h-3" />
          <input 
            type="text" 
            placeholder="Filter files..."
            className="w-full bg-surface border border-surface-border rounded-lg pl-7 pr-2 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".png,.glb,.css,.jpg"
          multiple 
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <input 
          type="file" 
          ref={folderInputRef} 
          className="hidden" 
          // @ts-expect-error - standard non-standard attribute
          webkitdirectory=""
          directory=""
          multiple
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>
      <div className="group/filetree flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-3 py-1">
          <span className="text-[10px] font-bold text-text-subtle uppercase tracking-wider">Explorer</span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={onCreate}
              className="p-1 rounded hover:bg-surface text-text-subtle hover:text-white "
              title="New File"
            >
              <FilePlus size={14} />
            </button>
            <button
              onClick={() => { setShowNewFolderInput(!showNewFolderInput); if (showNewFolderInput) setNewFolderName(''); }}
              className="p-1 rounded hover:bg-surface text-text-subtle hover:text-white "
              title="New Folder"
            >
              <FolderPlus size={14} />
            </button>
            <button
              onClick={handleToggleMultiSelect}
              className={`p-1 rounded  ${
                multiSelectMode
                  ? 'bg-primary/20 text-primary hover:bg-primary/30'
                  : 'hover:bg-surface text-text-subtle hover:text-white'
              }`}
              title="Select Files"
            >
              <ListChecks size={14} />
            </button>
          </div>
        </div>
        {showNewFolderInput && (
          <div className="px-3 pb-2">
            <div className="flex items-center gap-1">
              <Folder size={14} className="text-text-subtle shrink-0" />
              <input
                type="text"
                placeholder="folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFolder();
                  if (e.key === 'Escape') { setShowNewFolderInput(false); setNewFolderName(''); }
                }}
                onBlur={() => { setShowNewFolderInput(false); setNewFolderName(''); }}
                autoFocus
                className="flex-1 bg-surface border border-surface-border rounded px-2 py-1 text-xs text-white focus:border-primary outline-none"
              />
            </div>
          </div>
        )}
        <div id="tour-file-list" ref={dragScrollRef} className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {multiSelectMode && selectedFilePaths.size > 0 && (
            <div className="mb-2 p-2 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-between">
              <span className="text-xs text-primary font-bold">{selectedFilePaths.size} selected</span>
              <div className="flex gap-1">
                <button
                  onClick={() => onBulkMove(Array.from(selectedFilePaths))}
                  className="flex items-center gap-1 px-2 py-1 bg-primary hover:bg-primary-hover text-white text-[10px] font-bold rounded "
                  title="Move selected files"
                >
                  <Move size={12} /> Move
                </button>
                <button
                  onClick={() => { setSelectedFilePaths(new Set()); setMultiSelectMode(false); }}
                  className="px-2 py-1 bg-surface-hover hover:bg-surface text-text-muted hover:text-white text-[10px] font-bold rounded "
                >
                  Done
                </button>
              </div>
            </div>
          )}
          {Object.values(fileTree)
            .sort((a, b) => {
                const order = ['textures', 'models', 'skyBoxes', 'css'];
                const idxA = order.indexOf(a.name);
                const idxB = order.indexOf(b.name);
                if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                if (idxA !== -1) return -1;
                if (idxB !== -1) return 1;
                return a.name.localeCompare(b.name);
            })
            .map(node => (
              <FileTreeItem 
                key={node.path} 
                node={node} 
                level={0} 
                selectedFile={selectedFile} 
                onSelect={setSelectedFile}
                onDelete={onDelete}
                onDeleteFolder={onDeleteFolder}
                onDuplicate={duplicateFile}
                onMove={onMove}
                renamingPath={renamingPath}
                onStartRename={setRenamingPath}
                onCommitRename={renameFile}
                renamingFolderPath={renamingFolderPath}
                onStartFolderRename={setRenamingFolderPath}
                onCommitFolderRename={renameFolder}
                selectedFilePaths={selectedFilePaths}
                onToggleSelect={handleToggleSelect}
                multiSelectMode={multiSelectMode}
              />
            ))
        }
      </div>
      </div>
    </div>
  );
});
export default TextureList;
