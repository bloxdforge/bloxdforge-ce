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

import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Palette, Package, Plus, Trash2, Edit2, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import Editor, { loader } from "@monaco-editor/react";
import TextureList from "@/components/creator/TextureList";
import EditorCanvas, { EditorCanvasApi } from "@/components/creator/EditorCanvas";
import Toolbar, { ToolType } from "@/components/creator/Toolbar";
import NewFileModal from "@/components/creator/NewFileModal";
import VoxelEditor from "@/components/creator/VoxelEditor";
import DeleteConfirmationModal from "@/components/creator/DeleteConfirmationModal";
import DeletePackConfirmationModal from "@/components/creator/DeletePackConfirmationModal";
import MoveFileModal from "@/components/creator/MoveFileModal";
import StudioTour from "@/components/creator/StudioTour";
import MobileRotatePrompt from "@/components/creator/MobileRotatePrompt";
import { useCreatorStore, PackSummary } from "@/stores/useCreatorStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { formatDistanceToNow } from 'date-fns';
if (typeof window !== 'undefined') {
  loader.config({ paths: { vs: '/lib/monaco/vs' } });
}
type TourAction = 'openEditor' | 'closeEditor' | 'showNewPackInput';
export default function CreatorClient() {
  const searchParams = useSearchParams();
  const { 
    currentPackId, currentPackName, packs, files, selectedFile, edits, isLoadingPack, isStoreLoading, 
    canUndo, canRedo, loadPacksList, createPack, loadPack, deletePack, renamePack, 
    saveCurrentPack, addDroppedFile, updateEdit, setHistoryState, deleteFile, deleteFolder, moveFile, moveFiles,
    importPackFromUrl, updateFileContent, saveStatus, closePack, importFromRemixSession
  } = useCreatorStore();
  const { confirmTextureDeletion, confirmPackDeletion } = useSettingsStore();
  const [tool, setTool] = useState<ToolType>('pencil');
  const [color, setColor] = useState('#ff6b39');
  const [brushSize, setBrushSize] = useState(1);
  const [lightenDarkenIntensity, setLightenDarkenIntensity] = useState(5);
  const [fillMode, setFillMode] = useState<'fill' | 'unfill'>('fill');
  const [selectionState, setSelectionState] = useState({ hasSelection: false, hasClipboard: false, isPasting: false, clipboardSlots: [] as { previewUrl: string; width: number; height: number }[], activeClipboardIndex: -1 });
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showNewPackInput, setShowNewPackInput] = useState(false);
  const [newPackName, setNewPackName] = useState("");
  const [renamingPackId, setRenamingPackId] = useState<string | null>(null);
  const [packNameToEdit, setPackNameToEdit] = useState("");
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [fileToMove, setFileToMove] = useState<string | null>(null);
  const [packToDelete, setPackToDelete] = useState<PackSummary | null>(null);
  const [bulkMovePaths, setBulkMovePaths] = useState<string[] | null>(null);
  const [cssContent, setCssContent] = useState<string>('');
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [dummyPackId, setDummyPackId] = useState<string | null>(null);
  const canvasApiRef = useRef<EditorCanvasApi>(null);
  const importUrlChecked = useRef(false);
  const remixImportChecked = useRef(false);
  const selectedFileKey = selectedFile ? (selectedFile.webkitRelativePath || selectedFile.name) : null;
  const isGlb = selectedFile?.name.endsWith('.glb');
  const isCss = selectedFile?.name.endsWith('.css');
  const existingFolders = useMemo(() => {
    const folders = new Set<string>();
    files.forEach(file => {
      const path = file.webkitRelativePath || file.name;
      const displayPath = currentPackName && path.startsWith(currentPackName + '/')
        ? path.substring(currentPackName.length + 1)
        : path;
      const parts = displayPath.split('/');
      for (let i = 1; i < parts.length; i++) {
        folders.add(parts.slice(0, i).join('/'));
      }
    });
    return Array.from(folders).sort();
  }, [files, currentPackName]);
  const handleStartTour = useCallback(() => {
    if (packs.length === 0 && !dummyPackId) {
      const newId = crypto.randomUUID();
      const newPack: PackSummary = { id: newId, name: "Tour Example Pack", lastModified: Date.now() };
      useCreatorStore.setState({ packs: [newPack] });
      setDummyPackId(newId);
    }
    setIsTourOpen(true);
  }, [packs.length, dummyPackId]);
  useEffect(() => {
    const tourSeen = localStorage.getItem('bloxdforge_studio_tour_seen');
    if (!tourSeen) {
      setIsFirstTime(true);
      handleStartTour();
    }
  }, [handleStartTour]);
  const handleFinishTour = () => {
    setIsTourOpen(false);
    localStorage.setItem('bloxdforge_studio_tour_seen', 'true');
    setIsFirstTime(false);
    if (dummyPackId) {
      deletePack(dummyPackId);
      setDummyPackId(null);
    }
  };
  const handleTourAction = useCallback((action: TourAction) => {
    if (action === 'openEditor') {
      const packToOpenId = dummyPackId || packs[0]?.id;
      if (packToOpenId) {
        loadPack(packToOpenId);
      }
    } else if (action === 'closeEditor') {
      closePack();
    } else if (action === 'showNewPackInput') {
      setShowNewPackInput(true);
    }
  }, [dummyPackId, packs, loadPack, closePack]);
  useEffect(() => {
    if (remixImportChecked.current) return;
    const performImport = async () => {
      remixImportChecked.current = true;
      const imported = await importFromRemixSession();
      if (!imported) {
        loadPacksList();
      }
    };
    performImport();
  }, [importFromRemixSession, loadPacksList]);
  useEffect(() => {
    if (importUrlChecked.current) return;
    const importUrl = searchParams.get('importPack');
    if (importUrl) {
      importUrlChecked.current = true;
      importPackFromUrl(importUrl);
    }
  }, [searchParams, importPackFromUrl]);
  useEffect(() => {
    if (saveStatus === 'modified' && currentPackId) {
      const handler = setTimeout(() => {
        saveCurrentPack();
      }, 2000);
      return () => clearTimeout(handler);
    }
  }, [saveStatus, currentPackId, saveCurrentPack]);
  useEffect(() => {
    if (isCss && selectedFile) {
        selectedFile.text().then(setCssContent);
    }
  }, [selectedFile, isCss]);
  const handleFileDrop = useCallback((file: File) => { addDroppedFile(file); }, [addDroppedFile]);
  const handleCreatePack = () => {
    if (newPackName.trim()) {
        createPack(newPackName.trim());
        setNewPackName("");
        setShowNewPackInput(false);
    }
  };
  const handleDeleteFileRequest = useCallback((path: string) => {
    if (confirmTextureDeletion) {
      setFileToDelete(path);
    } else {
      deleteFile(path);
    }
  }, [confirmTextureDeletion, deleteFile]);
  const handleDeleteFolderRequest = useCallback((folderPath: string) => {
    const folderName = folderPath.split('/').pop() || folderPath;
    if (window.confirm(`Delete folder "${folderName}" and all files inside it? This cannot be undone.`)) {
      deleteFolder(folderPath);
      toast.success('Folder deleted.');
    }
  }, [deleteFolder]);
  const handleMoveFileRequest = useCallback((path: string) => {
    setFileToMove(path);
  }, []);
  const handleBulkMove = useCallback((paths: string[]) => {
    setBulkMovePaths(paths);
  }, []);
  const handleConfirmBulkMove = (newFolder: string) => {
    if (bulkMovePaths) {
      moveFiles(bulkMovePaths, newFolder);
      setBulkMovePaths(null);
    }
  };
  const handleConfirmMoveFile = (newFolder: string) => {
    if (fileToMove) {
        moveFile(fileToMove, newFolder);
        setFileToMove(null);
    }
  };
  const handleRenamePack = (packId: string) => {
    if (packNameToEdit.trim()) {
        renamePack(packId, packNameToEdit.trim());
    }
    setRenamingPackId(null);
  };
  const handleDeletePackRequest = (pack: PackSummary) => {
    if (confirmPackDeletion) {
        setPackToDelete(pack);
    } else {
        deletePack(pack.id);
    }
  }
  const handleConfirmDeleteFile = () => {
    if (fileToDelete) {
      deleteFile(fileToDelete);
      setFileToDelete(null);
    }
  };
  const handleCssChange = (value?: string) => {
    const newContent = value || '';
    setCssContent(newContent);
    if(selectedFileKey) {
        updateFileContent(selectedFileKey, newContent);
    }
  };
  const handleCreateNewFile = useCallback(() => setShowNewFileModal(true), []);
  const handleSaveCanvas = useCallback(() => { if (!isGlb && !isCss) canvasApiRef.current?.save(); }, [isGlb, isCss]);
  const handleUndoCanvas = useCallback(() => { if (!isGlb && !isCss) canvasApiRef.current?.undo(); }, [isGlb, isCss]);
  const handleRedoCanvas = useCallback(() => { if (!isGlb && !isCss) canvasApiRef.current?.redo(); }, [isGlb, isCss]);
  const handleEditCanvas = useCallback((data: ImageData) => { if (selectedFileKey) updateEdit(selectedFileKey, data); }, [selectedFileKey, updateEdit]);
  const handleSelectionStateChange = useCallback((state: { hasSelection: boolean; hasClipboard: boolean; isPasting: boolean; clipboardSlots: { previewUrl: string; width: number; height: number }[]; activeClipboardIndex: number }) => setSelectionState(state), []);
  const handleCopySelection = useCallback(() => canvasApiRef.current?.copySelection(), []);
  const handleCancelPaste = useCallback(() => canvasApiRef.current?.cancelPaste(), []);
  const handleSelectClipboardSlot = useCallback((index: number) => canvasApiRef.current?.selectClipboardSlot(index), []);
  const handleDeleteClipboardSlot = useCallback((index: number) => canvasApiRef.current?.deleteClipboardSlot(index), []);
  const handleVoxelSave = useCallback((buffer: ArrayBuffer) => {
    if (selectedFileKey) {
      updateFileContent(selectedFileKey, buffer);
    }
  }, [selectedFileKey, updateFileContent]);
  if (!currentPackId) {
      return (
        <div className="h-full w-full bg-[#0a0a0a] p-8 overflow-y-auto custom-scrollbar">
            {isTourOpen && <StudioTour onFinish={handleFinishTour} isFirstTime={isFirstTime} onAction={handleTourAction} />}
            {packToDelete && (
              <DeletePackConfirmationModal 
                packName={packToDelete.name}
                onConfirm={() => {
                  deletePack(packToDelete.id);
                  setPackToDelete(null);
                }}
                onCancel={() => setPackToDelete(null)}
              />
            )}
            <div className="max-w-5xl mx-auto">
                <header id="tour-header" className="mb-10 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold text-white mb-2">Texture Studio</h1>
                             <button onClick={handleStartTour} className="mb-2 p-1.5 text-text-subtle hover:text-primary hover:bg-primary/10 rounded-full transition-colors" title="Show Feature Tour">
                               <HelpCircle size={18} />
                             </button>
                        </div>
                        <p className="text-text-muted">Manage your Bloxd.io texture packs.</p>
                    </div>
                    <button 
                        id="tour-create-pack-button"
                        onClick={() => setShowNewPackInput(true)}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold flex items-center gap-2 shadow-sm shadow-primary/10 transition-all"
                    >
                        <Plus size={20} /> New Pack
                    </button>
                </header>
                {showNewPackInput && (
                    <div id="tour-new-pack-input" className="mb-8 p-6 bg-background border border-surface-border rounded-2xl animate-in slide-in-from-top-4">
                        <h3 className="text-white font-bold mb-4">Name your new texture pack</h3>
                        <div className="flex gap-4">
                            <input 
                                autoFocus
                                type="text" 
                                placeholder="My Awesome Pack" 
                                className="flex-1 bg-[#0a0a0a] border border-surface-border rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                value={newPackName}
                                onChange={e => setNewPackName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleCreatePack()}
                            />
                            <button onClick={handleCreatePack} className="px-6 bg-white text-black font-bold rounded-lg hover:bg-gray-200">Create</button>
                            <button onClick={() => setShowNewPackInput(false)} className="px-6 py-2.5 bg-surface-hover hover:bg-surface text-white font-bold rounded-lg transition-colors border border-surface-border">Cancel</button>
                        </div>
                    </div>
                )}
                <div id="tour-pack-list-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packs.map(pack => (
                        <div key={pack.id} className="group bg-background border border-surface-border rounded-2xl p-6 hover:border-white/20 transition-all relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-surface-hover rounded-xl text-primary">
                                    <Package size={24} />
                                </div>
                                <div className="opacity-50 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity flex gap-2">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setRenamingPackId(pack.id); setPackNameToEdit(pack.name); }}
                                      className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                      title="Rename Pack"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeletePackRequest(pack); }}
                                        className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                        title="Delete Pack"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                             {renamingPackId === pack.id ? (
                                <input 
                                    autoFocus
                                    value={packNameToEdit}
                                    onChange={(e) => setPackNameToEdit(e.target.value)}
                                    onBlur={() => handleRenamePack(pack.id)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleRenamePack(pack.id) }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-xl font-bold text-white mb-2 bg-transparent border-b-2 border-primary outline-none w-full"
                                />
                            ) : (
                                <h3 className="text-xl font-bold text-white mb-2 truncate">{pack.name}</h3>
                            )}
                            <p className="text-xs text-text-subtle mb-6">Edited {formatDistanceToNow(pack.lastModified)} ago</p>
                            <button 
                                onClick={() => loadPack(pack.id)}
                                className="w-full py-2.5 bg-surface-hover hover:bg-surface hover:text-white text-gray-300 rounded-lg font-bold text-sm transition-colors border border-surface-border"
                            >
                                Open Editor
                            </button>
                        </div>
                    ))}
                    {packs.length === 0 && !showNewPackInput && (
                        <div className="col-span-full py-20 text-center text-text-subtle border-2 border-dashed border-surface-border rounded-2xl">
                            No packs found. Create one to get started!
                        </div>
                    )}
                </div>
            </div>
        </div>
      );
  }
  if (isStoreLoading || isLoadingPack) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-text-subtle gap-4 bg-[#0a0a0a]">
        <Loader2 className="w-10 h-10 animate-spin" data-force-animation="on" />
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full bg-[#0a0a0a] overflow-hidden">
      <MobileRotatePrompt />
      {isTourOpen && <StudioTour onFinish={handleFinishTour} isFirstTime={isFirstTime} onAction={handleTourAction} />}
      {showNewFileModal && ( <NewFileModal onClose={() => setShowNewFileModal(false)} /> )}
      {fileToDelete && (
        <DeleteConfirmationModal
          fileName={fileToDelete.split('/').pop() || ''}
          onConfirm={handleConfirmDeleteFile}
          onCancel={() => setFileToDelete(null)}
        />
      )}
      {fileToMove && (
        <MoveFileModal
           fileName={fileToMove.split('/').pop() || ''}
           currentFolder={fileToMove.substring((currentPackName?.length || 0) + 1, fileToMove.lastIndexOf('/'))}
           existingFolders={existingFolders}
           onConfirm={handleConfirmMoveFile}
           onCancel={() => setFileToMove(null)}
        />
      )}
      {bulkMovePaths && (
        <MoveFileModal
           fileCount={bulkMovePaths.length}
           fileNames={bulkMovePaths.map(p => p.split('/').pop() || '')}
           currentFolder=""
           existingFolders={existingFolders}
           onConfirm={handleConfirmBulkMove}
           onCancel={() => setBulkMovePaths(null)}
        />
      )}
      <div className="w-64 flex-shrink-0 h-full border-r border-surface-border flex flex-col bg-background">
        <TextureList 
          onCreate={handleCreateNewFile} 
          onDelete={handleDeleteFileRequest} 
          onDeleteFolder={handleDeleteFolderRequest}
          onMove={handleMoveFileRequest}
          onBulkMove={handleBulkMove}
        />
      </div>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div id="tour-canvas-container" className="flex-1 relative bg-[#0a0a0a] overflow-hidden">
            {selectedFile ? (
                isGlb ? (
                    <VoxelEditor file={selectedFile} onSave={handleVoxelSave} />
                ) : isCss ? (
                    <Editor
                        height="100%"
                        language="css"
                        theme="vs-dark"
                        value={cssContent}
                        onChange={handleCssChange}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbersMinChars: 3,
                        }}
                    />
                ) : (
                    <EditorCanvas 
                    ref={canvasApiRef}
                    file={selectedFile}
                    cachedData={selectedFileKey ? (edits[selectedFileKey] || null) : null}
                    tool={tool}
                    color={color}
                    brushSize={brushSize}
                    lightenDarkenIntensity={lightenDarkenIntensity}
                    fillMode={fillMode}
                    onColorPick={setColor}
                    onEdit={handleEditCanvas}
                    onFileDrop={handleFileDrop}
                    onHistoryChange={setHistoryState}
                    onSelectionStateChange={handleSelectionStateChange}
                    />
                )
            ) : (
                <div 
                    className="h-full flex items-center justify-center flex-col gap-6 text-text-subtle bg-[#0a0a0a]"
                    onDragOver={(e) => { e.preventDefault(); }}
                    onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            handleFileDrop(e.dataTransfer.files[0]);
                        }
                    }}
                >
                    <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center border border-surface-border">
                        <Palette size={40} className="text-hairline-strong" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-2">No File Selected</h3>
                        <p className="text-sm text-text-subtle max-w-xs mx-auto mb-6">Select a file from the explorer on the left, or create a new one to start editing.</p>
                        <button 
                            onClick={() => setShowNewFileModal(true)} 
                            className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover shadow-sm shadow-primary/10 transition-all"
                        >
                            Create New File
                        </button>
                    </div>
                </div>
            )}
          </div>
      </div>
      {selectedFile && !isGlb && !isCss && (
        <div className="w-72 flex-shrink-0 h-full border-l border-surface-border bg-background">
            <Toolbar 
            activeTool={tool} 
            onToolChange={setTool}
            color={color} 
            onColorChange={setColor}
            brushSize={brushSize}
            onBrushSizeChange={setBrushSize}
            lightenDarkenIntensity={lightenDarkenIntensity}
            onLightenDarkenIntensityChange={setLightenDarkenIntensity}
            fillMode={fillMode}
            onFillModeChange={setFillMode}
            hasSelection={selectionState.hasSelection}
            hasClipboard={selectionState.hasClipboard}
            isPasting={selectionState.isPasting}
            clipboardSlots={selectionState.clipboardSlots}
            activeClipboardIndex={selectionState.activeClipboardIndex}
            onCopySelection={handleCopySelection}
            onCancelPaste={handleCancelPaste}
            onSelectClipboardSlot={handleSelectClipboardSlot}
            onDeleteClipboardSlot={handleDeleteClipboardSlot}
            onSave={handleSaveCanvas}
            onUndo={handleUndoCanvas}
            onRedo={handleRedoCanvas}
            canUndo={canUndo}
            canRedo={canRedo}
            />
        </div>
      )}
    </div>
  );
}
