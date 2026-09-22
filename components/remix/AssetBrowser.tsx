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

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import JSZip from "jszip";
import { Search, X, Loader2, ImageIcon, Box, FileCode, Cloud, Check, Layers } from "lucide-react";
import { fuzzySearch } from "@/lib/search";
import imageKitLoader from "@/lib/image-loader";
import toast from "react-hot-toast";
import { useRemixStore, RemixAsset } from "@/stores/useRemixStore";
import { useDragSelect } from "./DragSelect";
import ConflictModal, { Conflict } from "./ConflictModal";
import { useInView } from "@/hooks/useInView";
import { fetchThroughProxy } from "@/lib/client-download";
import { fetchSecureData } from "@/lib/secure-data";
interface TextureItem {
  name: string;
  file: string;
  img?: string;
  author?: string;
  tags?: string[];
}
interface PackFile {
    path: string;
    file: JSZip.JSZipObject;
    category: RemixAsset['category'];
    skyboxGroup?: string;
}
const blobLoader = ({ src }: { src: string }) => src;
const PackFileItem = React.memo(function PackFileItem({ file, path, category, isSelected }: { file: JSZip.JSZipObject, path: string, category: RemixAsset['category'], isSelected: boolean }) {
    const { ref, inView } = useInView({ threshold: 0 });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileName = path.split('/').pop() || path;
    useEffect(() => {
        if (!inView || previewUrl) return;
        if (category !== 'texture' && category !== 'skybox') return;
        let isMounted = true;
        setIsLoading(true);
        file.async('blob')
            .then(blob => {
                if(isMounted) {
                    const objectUrl = URL.createObjectURL(blob);
                    setPreviewUrl(objectUrl);
                }
            })
            .catch(() => {})
            .finally(() => {
                if(isMounted) setIsLoading(false);
            });
        return () => { 
            isMounted = false;
            if (previewUrl) URL.revokeObjectURL(previewUrl); 
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file, category, inView]); 
    let icon = <ImageIcon size={24} className="text-text-subtle" />;
    if (category === 'model') icon = <Box size={24} className="text-blue-500" />;
    if (category === 'css') icon = <FileCode size={24} className="text-purple-500" />;
    if (category === 'skybox') icon = <Cloud size={24} className="text-cyan-500" />;
    return (
      <div 
        ref={ref} 
        className={`cursor-pointer rounded-lg border overflow-hidden aspect-square transition-colors duration-150 group relative bg-surface ${isSelected ? 'border-primary bg-primary/10' : 'border-surface-border hover:border-hairline-strong hover:bg-surface-hover'}`} 
        title={path}
      >
        <div className="absolute top-1.5 left-1.5 z-10 pointer-events-none">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isSelected ? 'bg-primary border-primary' : 'bg-black/60 border-surface-border'}`}>
            {isSelected && <Check size={12} className="text-white" />}
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          {isLoading ? <Loader2 size={24} className="animate-spin text-text-subtle" data-force-animation="on" /> : previewUrl ? <Image loader={blobLoader} src={previewUrl} alt={fileName} fill className="object-contain" style={{ imageRendering: 'pixelated' }} draggable="false" /> : icon}
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-black/60 pointer-events-none">
          <div className="text-[11px] font-semibold font-mono text-foreground truncate text-center">{fileName}</div>
        </div>
      </div>
    );
});
PackFileItem.displayName = "PackFileItem";
interface AssetBrowserProps {
    isOpen: boolean;
    onClose: () => void;
    initialPackUrl?: string;
}
export default function AssetBrowser({ isOpen, onClose, initialPackUrl }: AssetBrowserProps) {
    const { assets: existingAssets, addAsset } = useRemixStore();
    const [workshopPacks, setWorkshopPacks] = useState<TextureItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [fileSearchQuery, setFileSearchQuery] = useState("");
    const [selectedPack, setSelectedPack] = useState<TextureItem | null>(null);
    const [packContent, setPackContent] = useState<PackFile[]>([]);
    const [loadingPack, setLoadingPack] = useState(false);
    const [stagedFiles, setStagedFiles] = useState(new Set<string>());
    const [dragFiles, setDragFiles] = useState(new Set<string>());
    const [conflicts, setConflicts] = useState<Conflict[]>([]);
    const [pendingImports, setPendingImports] = useState<RemixAsset[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<HTMLElement[]>([]);
    const renderedSelection = useMemo(() => {
        if (dragFiles.size === 0) return stagedFiles;
        return new Set([...Array.from(stagedFiles), ...Array.from(dragFiles)]);
    }, [stagedFiles, dragFiles]);
    const onDragUpdate = useCallback((idsInBox: Set<string>) => {
        setDragFiles(idsInBox);
    }, []);
    const onDragEnd = useCallback((idsInBox: Set<string>) => {
        setStagedFiles(current => new Set([...Array.from(current), ...Array.from(idsInBox)]));
        setDragFiles(new Set());
    }, []);
    const onItemClick = useCallback((id: string) => {
        const skyboxGroup = packContent.find(f => f.path === id)?.skyboxGroup;
        setStagedFiles(current => {
            const newSelection = new Set(current);
            if (skyboxGroup) {
                const groupFiles = packContent.filter(f => f.skyboxGroup === skyboxGroup).map(f => f.path);
                const allSelected = groupFiles.every(p => newSelection.has(p));
                if (allSelected) {
                    groupFiles.forEach(p => newSelection.delete(p));
                } else {
                    groupFiles.forEach(p => newSelection.add(p));
                }
            } else {
                if (newSelection.has(id)) newSelection.delete(id);
                else newSelection.add(id);
            }
            return newSelection;
        });
    }, [packContent]);
    const onBackgroundClick = useCallback(() => {
        setStagedFiles(new Set());
    }, []);
    const { isDragging, selectionBox, handlePointerDown, handlePointerMove, handlePointerUp } = useDragSelect({
        containerRef, itemRefs, onDragUpdate, onDragEnd, onItemClick, onBackgroundClick
    });
    const loadPackContent = useCallback(async (pack: TextureItem) => {
        setLoadingPack(true); setSelectedPack(pack); setPackContent([]); setStagedFiles(new Set()); itemRefs.current = [];
        try {
            const res = await fetchThroughProxy(pack.file); 
            const blob = await res.blob(); const zip = await JSZip.loadAsync(blob);
            const files: PackFile[] = Object.entries(zip.files).filter(([,file]) => !file.dir).map(([path, file]) => {
                let category: RemixAsset['category'] = 'other', skyboxGroup: string | undefined = undefined;
                if (path.includes('textures/')) category = 'texture';
                else if (path.includes('models/')) category = 'model';
                else if (path.includes('css/')) category = 'css';
                else if (path.includes('skyBoxes/') || path.includes('skyboxes/')) { 
                    category = 'skybox'; 
                    const parts = path.split('/'); 
                    if (parts.length > 2) skyboxGroup = parts[1]; 
                }
                return { path, file, category, skyboxGroup };
            });
            setPackContent(files);
        } catch (e) { toast.error("Failed to load pack contents"); console.error(e); } finally { setLoadingPack(false); }
    }, []);
    useEffect(() => {
        if (!isOpen) return;
        fetchSecureData<TextureItem[]>('textures').then(data => {
            setWorkshopPacks(data);
            if (initialPackUrl) { const pack = data.find((p: TextureItem) => p.file === initialPackUrl); if (pack) loadPackContent(pack); }
        }).catch(console.error);
    }, [isOpen, initialPackUrl, loadPackContent]);
    const filteredPacks = fuzzySearch(workshopPacks, searchQuery, ['name', 'author', 'tags']);
    const filteredFiles = fuzzySearch(packContent, fileSearchQuery, ['path']);
    const processImports = useCallback(async (importsToProcess: RemixAsset[]) => {
      const newConflicts: Conflict[] = [], importsWithoutConflicts: RemixAsset[] = [];
      for (const incoming of importsToProcess) {
        if (existingAssets[incoming.path]) newConflicts.push({ path: incoming.path, existing: existingAssets[incoming.path], incoming });
        else importsWithoutConflicts.push(incoming);
      }
      importsWithoutConflicts.forEach(asset => addAsset(asset.path, asset.blob, asset.author, asset.sourcePack));
      setConflicts(newConflicts);
      if (newConflicts.length === 0 && importsToProcess.length > 0) { toast.success(`Imported ${importsToProcess.length} assets.`); onClose(); }
    }, [addAsset, existingAssets, onClose]);
    const handleImport = async () => {
      if (!selectedPack) return;
      const imports: RemixAsset[] = [];
      for (const path of stagedFiles) {
        const packFile = packContent.find(f => f.path === path);
        if (packFile) {
          const blob = await packFile.file.async('blob'); const pathParts = packFile.path.split('/');
          const fileName = pathParts.pop() || packFile.path; let cleanPath: string;
          switch(packFile.category) {
            case 'texture': cleanPath = `textures/${fileName}`; break;
            case 'model': cleanPath = `models/${fileName}`; break;
            case 'css': cleanPath = `css/${fileName}`; break;
            case 'skybox': const skyboxName = packFile.skyboxGroup || 'default'; cleanPath = `skyBoxes/${skyboxName}/${fileName}`; break;
            default: cleanPath = fileName; break;
          }
          imports.push({ path: cleanPath, blob, author: selectedPack.author || 'Unknown', sourcePack: selectedPack.name, category: packFile.category, });
        }
      }
      setPendingImports(imports); await processImports(imports);
    };
    const resolveConflict = (path: string, keep: 'existing' | 'incoming') => {
      const conflict = conflicts.find(c => c.path === path); if (!conflict) return;
      if (keep === 'incoming') addAsset(conflict.incoming.path, conflict.incoming.blob, conflict.incoming.author, conflict.incoming.sourcePack);
      const remainingConflicts = conflicts.filter(c => c.path !== path);
      const remainingPending = pendingImports.filter(p => p.path !== path);
      setConflicts(remainingConflicts); setPendingImports(remainingPending);
      if(remainingConflicts.length === 0) { toast.success(`Import finished with ${pendingImports.length} assets.`); onClose(); }
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4">
            <ConflictModal conflict={conflicts[0] || null} onResolve={resolveConflict} onClose={() => setConflicts([])} />
            <div className="bg-surface-elevated border border-surface-border rounded-xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-[rgba(0,0,0,0.5)_0px_8px_24px] ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-200">
                <header className="flex justify-between items-center p-4 border-b border-surface-border bg-surface">
                    <h2 className="font-semibold tracking-tight text-foreground text-lg">Browse Workshop Assets</h2>
                    <button onClick={onClose} aria-label="Close modal" className="bf-press p-2 text-text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors duration-150"><X size={20} aria-hidden="true" /></button>
                </header>
                <main className="flex flex-1 overflow-hidden">
                    <aside className="w-1/3 border-r border-surface-border flex flex-col bg-background">
                        <div className="p-4 border-b border-surface-border"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle w-4 h-4" aria-hidden="true" /><input className="w-full h-11 bg-surface border border-surface-border rounded-lg pl-9 pr-4 text-sm text-foreground placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors duration-150" placeholder="Search packs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div></div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">{filteredPacks.map(pack => (<button key={pack.file} onClick={() => loadPackContent(pack)} className={`bf-press w-full p-4 flex items-center gap-3 border-b border-surface-border transition-colors duration-150 text-left ${selectedPack?.file === pack.file ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-surface-hover'}`}><div className="w-12 h-12 relative bg-surface rounded-lg border border-surface-border overflow-hidden flex-shrink-0 flex items-center justify-center">{pack.img ? <Image loader={imageKitLoader} src={pack.img} alt={pack.name} fill className="object-cover" /> : <ImageIcon size={20} className="text-text-subtle" />}</div><div className="min-w-0"><div className="font-medium tracking-tight text-foreground text-sm truncate">{pack.name}</div><div className="text-xs text-text-subtle truncate">by {pack.author}</div></div></button>))}</div>
                    </aside>
                    <section className="flex-1 flex flex-col bg-surface">
                        {loadingPack ? (<div className="flex-1 flex flex-col items-center justify-center text-text-muted gap-3"><Loader2 className="w-8 h-8 animate-spin text-primary" data-force-animation="on" /><span className="text-sm">Unpacking assets...</span></div>) : selectedPack ? (<>
                            <div className="p-4 bg-surface border-b border-surface-border flex justify-between items-center flex-wrap gap-3">
                                <div className="flex-1 min-w-[200px]"><input className="w-full h-11 bg-background border border-surface-border rounded-lg px-3 text-sm text-foreground placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors duration-150" placeholder={`Search in ${selectedPack.name}...`} value={fileSearchQuery} onChange={e => setFileSearchQuery(e.target.value)} /></div>
                                <div className="flex items-center gap-2"><span className="text-xs text-text-subtle tabular-nums">{filteredFiles.length} files</span><button onClick={() => setStagedFiles(new Set(filteredFiles.map(f => f.path)))} className="bf-press text-xs font-medium text-primary hover:underline px-3 py-2 rounded-md transition-colors duration-150">Select All Visible</button><button onClick={handleImport} disabled={stagedFiles.size === 0} className="bf-press px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed tabular-nums">Import ({stagedFiles.size})</button></div>
                            </div>
                            <div ref={containerRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} className="flex-1 overflow-y-auto p-4 custom-scrollbar relative select-none">
                                {isDragging && <div className="absolute bg-primary/10 border border-primary rounded-sm pointer-events-none z-20" style={{ left: selectionBox.x, top: selectionBox.y, width: selectionBox.width, height: selectionBox.height }} />}
                                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                    {filteredFiles.map((item, i) => (<div key={item.path} ref={el => { if(itemRefs.current) itemRefs.current[i] = el!}} data-id={item.path}><PackFileItem file={item.file} path={item.path} category={item.category} isSelected={renderedSelection.has(item.path)} /></div>))}
                                </div>
                            </div>
                        </>) : (<div className="flex-1 flex flex-col items-center justify-center text-center px-6"><Layers size={32} className="mb-3 text-text-subtle" aria-hidden="true" /><p className="text-sm font-medium text-text-muted">Select a pack</p><p className="text-xs text-text-subtle mt-1">Choose a pack from the left to view its contents.</p></div>)}
                    </section>
                </main>
            </div>
        </div>
    );
}
