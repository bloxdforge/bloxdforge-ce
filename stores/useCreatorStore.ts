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

import { create } from 'zustand';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import { idb, idbKeyval } from '@/lib/idb';
const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
const dataURLtoFile = (dataURL: string, filename: string, path: string): File => {
  const arr = dataURL.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  const file = new File([u8arr], filename, { type: mime });
  Object.defineProperty(file, 'webkitRelativePath', { value: path, writable: true });
  return file;
};
const imageDataToDataURL = (imageData: ImageData): string => {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.putImageData(imageData, 0, 0);
  }
  return canvas.toDataURL();
};
const dataURLToImageData = (dataURL: string): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(ctx.getImageData(0, 0, img.width, img.height));
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    img.onerror = () => reject(new Error('Failed to load image from data URL'));
    img.src = dataURL;
  });
};
interface PersistedFile {
  name: string;
  type: string;
  path: string;
  content: string;
}
export interface PackSummary {
  id: string;
  name: string;
  lastModified: number;
}
type SaveStatus = 'modified' | 'saving' | 'saved' | 'unmodified';
interface CreatorState {
  packs: PackSummary[];
  currentPackId: string | null;
  currentPackName: string | null;
  files: File[];
  selectedFile: File | null;
  edits: Record<string, ImageData>;
  isLoadingPack: boolean;
  isStoreLoading: boolean;
  canUndo: boolean;
  canRedo: boolean;
  saveStatus: SaveStatus;
  lastSaved: number | null;
  loadPacksList: () => void;
  createPack: (name: string) => Promise<void>;
  loadPack: (id: string) => Promise<void>;
  deletePack: (id: string) => void;
  renamePack: (id: string, newName: string) => void;
  saveCurrentPack: () => Promise<void>;
  importPackFromUrl: (url: string) => Promise<void>;
  importFromRemixSession: () => Promise<boolean>;
  addFiles: (fileList: FileList | File[], targetFolder?: string) => void;
  addDroppedFile: (file: File) => void;
  updateFileContent: (path: string, newContent: string | ArrayBuffer) => void;
  createBlankTexture: (name: string, width: number, height: number, folder?: string) => void;
  createCssFile: (name: string, folder?: string) => void;
  createFromDefault: (name: string, folder?: string) => Promise<void>;
  deleteFile: (path: string) => void;
  deleteFolder: (folderPath: string) => void;
  duplicateFile: (path: string) => void;
  moveFile: (oldPath: string, newFolder: string) => void;
  moveFiles: (paths: string[], newFolder: string) => void;
  renameFile: (oldPath: string, newName: string) => void;
  renameFolder: (oldPath: string, newName: string) => void;
  setSelectedFile: (file: File | null) => void;
  updateEdit: (path: string, data: ImageData) => void;
  setHistoryState: (canUndo: boolean, canRedo: boolean) => void;
  downloadZip: () => Promise<void>;
  downloadFile: (path: string) => Promise<void>;
  closePack: () => void;
}
export const useCreatorStore = create<CreatorState>((set, get) => ({
  packs: [],
  currentPackId: null,
  currentPackName: null,
  files: [],
  selectedFile: null,
  edits: {},
  isLoadingPack: false,
  isStoreLoading: true,
  canUndo: false,
  canRedo: false,
  saveStatus: 'unmodified',
  lastSaved: null,
  setHistoryState: (canUndo, canRedo) => set({ canUndo, canRedo }),
  setSelectedFile: (file) => set({ selectedFile: file }),
  updateEdit: (path, data) => set(state => ({ edits: { ...state.edits, [path]: data }, saveStatus: 'modified' })),
  closePack: () => set({ currentPackId: null, currentPackName: null, files: [], edits: {}, selectedFile: null, saveStatus: 'unmodified', lastSaved: null }),
  loadPacksList: () => {
    try {
      const stored = localStorage.getItem('bloxdforge_packs_list');
      if (stored) {
        set({ packs: JSON.parse(stored) });
      }
    } catch (e) {
      console.error(e);
    }
    set({ isStoreLoading: false });
  },
  createPack: async (name) => {
    const now = Date.now();
    const id = crypto.randomUUID();
    const newPack: PackSummary = { id, name, lastModified: now };
    const updatedPacks = [...get().packs, newPack];
    localStorage.setItem('bloxdforge_packs_list', JSON.stringify(updatedPacks));
    set({ 
      packs: updatedPacks, 
      currentPackId: id, 
      currentPackName: name, 
      files: [], 
      edits: {}, 
      selectedFile: null,
      saveStatus: 'saved',
      lastSaved: now
    });
    await get().saveCurrentPack();
  },
  loadPack: async (id) => {
    set({ isStoreLoading: true });
    try {
      const packSummary = get().packs.find(p => p.id === id);
      if (!packSummary) throw new Error("Pack not found");
      const savedFiles: PersistedFile[] | undefined = await idb.get(id);
      if (savedFiles) {
        const loadedFiles: File[] = [];
        const loadedEdits: Record<string, ImageData> = {};
        await Promise.all(savedFiles.map(async (savedFile) => {
          const file = dataURLtoFile(savedFile.content, savedFile.name, savedFile.path);
          loadedFiles.push(file);
          if (savedFile.type === 'image/png') {
            loadedEdits[savedFile.path] = await dataURLToImageData(savedFile.content);
          }
        }));
        set({
          currentPackId: id,
          currentPackName: packSummary.name,
          files: loadedFiles,
          edits: loadedEdits,
          selectedFile: loadedFiles.length > 0 ? loadedFiles[0] : null,
          saveStatus: 'saved',
          lastSaved: packSummary.lastModified
        });
      } else {
        set({ currentPackId: id, currentPackName: packSummary.name, files: [], edits: {}, saveStatus: 'unmodified' });
      }
    } catch (e) {
      console.error("Failed to load pack:", e);
      toast.error("Failed to load texture pack.");
    } finally {
      set({ isStoreLoading: false });
    }
  },
  deletePack: async (id) => {
    const updatedPacks = get().packs.filter(p => p.id !== id);
    localStorage.setItem('bloxdforge_packs_list', JSON.stringify(updatedPacks));
    await idb.del(id);
    if (get().currentPackId === id) {
      get().closePack();
    }
    set({ packs: updatedPacks });
  },
  renamePack: (id, newName) => {
    const { packs } = get();
    if (packs.some(p => p.name === newName && p.id !== id)) {
      toast.error(`A pack named "${newName}" already exists.`);
      return;
    }
    set({ saveStatus: 'modified' });
    const updatedPacks = packs.map(p => 
      p.id === id ? { ...p, name: newName, lastModified: Date.now() } : p
    );
    localStorage.setItem('bloxdforge_packs_list', JSON.stringify(updatedPacks));
    set(state => {
      let updatedCurrentName = state.currentPackName;
      if (state.currentPackId === id) {
        updatedCurrentName = newName;
      }
      return { packs: updatedPacks, currentPackName: updatedCurrentName };
    });
    toast.success("Pack renamed.");
  },
  saveCurrentPack: async () => {
    const { currentPackId, files, edits, isStoreLoading, packs } = get();
    if (isStoreLoading || !currentPackId) return;
    set({ saveStatus: 'saving' });
    try {
      const now = Date.now();
      const updatedPacks = packs.map(p => p.id === currentPackId ? { ...p, lastModified: now } : p);
      localStorage.setItem('bloxdforge_packs_list', JSON.stringify(updatedPacks));
      if (files.length > 0) {
        const persistedFiles: PersistedFile[] = await Promise.all(
          files.map(async (file) => {
            const path = file.webkitRelativePath || file.name;
            const edit = edits[path];
            const content = edit ? imageDataToDataURL(edit) : await fileToDataURL(file);
            return { name: file.name, type: file.type, path, content };
          })
        );
        await idb.set(currentPackId, persistedFiles);
      } else {
        await idb.del(currentPackId);
      }
      set({ saveStatus: 'saved', lastSaved: now, packs: updatedPacks });
    } catch (error) {
        console.error("Failed to save pack to IndexedDB", error);
        set({ saveStatus: 'modified' });
        if (error instanceof Error && error.name === 'QuotaExceededError') {
            toast.error("Storage quota exceeded. Please remove some files or packs.");
        } else {
            toast.error("An error occurred while saving.");
        }
    }
  },
  importPackFromUrl: async (url) => {
    let { currentPackId, currentPackName } = get();
    if (!currentPackId) {
       let packNameFromUrl;
       try {
           const parsedUrl = new URL(url);
           const pathParts = parsedUrl.pathname.split('/');
           packNameFromUrl = pathParts[pathParts.length - 1];
       } catch {
           const pathParts = url.split('/');
           packNameFromUrl = pathParts[pathParts.length - 1];
       }
       const name = decodeURIComponent(packNameFromUrl.replace(/\.zip$/, '')) || "Imported Pack";
       await get().createPack(name);
       const newState = get();
       currentPackId = newState.currentPackId;
       currentPackName = newState.currentPackName;
    }
    set({ isLoadingPack: true, files: [], edits: {} });
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch pack");
      const blob = await res.blob();
      if (blob.size > 50 * 1024 * 1024) {
        toast.error("Pack file is too large (max 50MB).");
        set({ isLoadingPack: false });
        return;
      }
      const zip = await JSZip.loadAsync(blob);
      const newFiles: File[] = [];
      const newEdits: Record<string, ImageData> = {};
      const packName = currentPackName || "pack";
      const fileEntries = Object.entries(zip.files).filter(([, file]) => !file.dir);
      const firstPath = fileEntries.length > 0 ? fileEntries[0][0] : '';
      let stripPrefix = '';
      if (firstPath.includes('/')) {
        const rootDir = firstPath.split('/')[0] + '/';
        const allInRootDir = fileEntries.every(([path]) => path.startsWith(rootDir));
        if (allInRootDir) {
          stripPrefix = rootDir;
        }
      }
      for (const [path, file] of fileEntries) {
        if (!path.match(/\.(png|glb|css|jpe?g)$/i)) continue;
        const fileBlob = await file.async('blob');
        const fileName = path.split('/').pop() || path;
        const relativePathInZip = path.startsWith(stripPrefix) ? path.substring(stripPrefix.length) : path;
        const fullPath = `${packName}/${relativePathInZip}`;
        const newFile = new File([fileBlob], fileName, { type: 'application/octet-stream' });
        Object.defineProperty(newFile, 'webkitRelativePath', { value: fullPath, writable: true });
        newFiles.push(newFile);
        if (newFile.type.startsWith('image/png')) {
          const dataUrl = await fileToDataURL(newFile);
          newEdits[fullPath] = await dataURLToImageData(dataUrl);
        }
      }
      set({
        files: newFiles,
        edits: newEdits,
        selectedFile: newFiles.length > 0 ? newFiles[0] : null,
        saveStatus: 'modified'
      });
      get().saveCurrentPack();
      toast.success('Pack content imported!');
    } catch (e) {
      console.error("Error loading pack", e);
      toast.error("Failed to load texture pack.");
    } finally {
      set({ isLoadingPack: false });
    }
  },
  importFromRemixSession: async () => {
    try {
      const sessionData = await idbKeyval.get<{ packName: string; files: PersistedFile[] }>('remix-to-creator-session');
      if (!sessionData) {
        return false;
      }
      await idbKeyval.del('remix-to-creator-session');
      try {
        const stored = localStorage.getItem('bloxdforge_packs_list');
        if (stored) {
          set({ packs: JSON.parse(stored) });
        }
      } catch (e) { console.error(e); }
      set({ isStoreLoading: false }); 
      let uniqueName = sessionData.packName;
      const existingNames = new Set(get().packs.map(p => p.name));
      let counter = 1;
      while (existingNames.has(uniqueName)) {
        uniqueName = `${sessionData.packName} (${counter})`;
        counter++;
      }
      await get().createPack(uniqueName);
      const newPackId = get().currentPackId;
      const newPackName = get().currentPackName;
      if (!newPackId || !newPackName) {
        toast.error("Failed to create a new pack for import.");
        return false;
      }
      const loadedFiles: File[] = [];
      const loadedEdits: Record<string, ImageData> = {};
      await Promise.all(sessionData.files.map(async (savedFile) => {
        const finalPath = `${newPackName}/${savedFile.path}`;
        const file = dataURLtoFile(savedFile.content, savedFile.name, finalPath);
        loadedFiles.push(file);
        if (savedFile.type === 'image/png' || savedFile.path.endsWith('.png')) {
          loadedEdits[finalPath] = await dataURLToImageData(savedFile.content);
        }
      }));
      set({
        files: loadedFiles,
        edits: loadedEdits,
        selectedFile: loadedFiles.length > 0 ? loadedFiles[0] : null,
        saveStatus: 'modified'
      });
      await get().saveCurrentPack();
      toast.success(`Imported "${sessionData.packName}" from Remix Studio!`);
      return true;
    } catch (error) {
      console.error("Error importing from Remix session", error);
      set({ isStoreLoading: false }); 
      if (error instanceof Error && error.name === 'QuotaExceededError') {
          toast.error("Storage quota exceeded during import.");
      } else {
          toast.error("Failed to import from Remix Studio.");
      }
      return false;
    }
  },
  addFiles: (fileList, targetFolder) => {
    const { currentPackName } = get();
    const baseDir = currentPackName || "MyPack";
    const newFiles = Array.from(fileList).filter(f => f.name.match(/\.(png|glb|css|jpg|jpeg)$/i));
    if (newFiles.length === 0) return;
    const processedFiles = newFiles.map(f => {
        let path = f.webkitRelativePath || f.name;
        if (targetFolder) {
            path = `${baseDir}/${targetFolder}/${f.name}`;
        } else if (!path.startsWith(baseDir)) {
            if (f.name.endsWith('.css')) path = `${baseDir}/css/${f.name}`;
            else if (f.name.endsWith('.glb')) path = `${baseDir}/models/${f.name}`;
            else if (f.name.match(/\.jpe?g$/)) path = `${baseDir}/skyBoxes/${f.name}`;
            else path = `${baseDir}/textures/${f.name}`;
        }
        const newFile = new File([f], f.name, { type: f.type });
        Object.defineProperty(newFile, 'webkitRelativePath', { value: path, writable: true });
        return newFile;
    });
    const newFileKeys = new Set(processedFiles.map(f => f.webkitRelativePath));
    set(state => {
      const nextEdits = { ...state.edits };
      newFileKeys.forEach(key => delete nextEdits[key]);
      const existingFiles = state.files.filter(f => !newFileKeys.has(f.webkitRelativePath));
      return {
        edits: nextEdits,
        files: [...existingFiles, ...processedFiles],
        selectedFile: processedFiles[0],
        saveStatus: 'modified'
      };
    });
  },
  updateFileContent: (path, newContent) => {
    set(state => {
        const fileToUpdate = state.files.find(f => (f.webkitRelativePath || f.name) === path);
        if (!fileToUpdate) return state;
        const newFile = new File([newContent], fileToUpdate.name, { type: fileToUpdate.type });
        Object.defineProperty(newFile, 'webkitRelativePath', { value: path, writable: true });
        const updatedFiles = state.files.map(f => ((f.webkitRelativePath || f.name) === path ? newFile : f));
        return { files: updatedFiles, saveStatus: 'modified' };
    });
  },
  addDroppedFile: (file) => {
    get().addFiles([file]);
  },
  createBlankTexture: (name, width, height, folder = "textures") => {
    const { currentPackName } = get();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.toBlob(blob => {
      if (blob) {
        const fullPath = `${currentPackName || "MyPack"}/${folder}/${name}.png`;
        const file = new File([blob], `${name}.png`, { type: 'image/png' });
        Object.defineProperty(file, 'webkitRelativePath', { value: fullPath, writable: true });
        set(state => ({
          files: [...state.files, file],
          selectedFile: file,
          saveStatus: 'modified'
        }));
      }
    });
  },
  createCssFile: (name, folder = "css") => {
    const { currentPackName } = get();
    const cleanName = name.trim().endsWith('.css') ? name.trim() : `${name.trim()}.css`;
    const fullPath = `${currentPackName || "MyPack"}/${folder}/${cleanName}`;
    const file = new File(["/* Your custom CSS here */"], cleanName, { type: 'text/css' });
    Object.defineProperty(file, 'webkitRelativePath', { value: fullPath, writable: true });
    set(state => ({
      files: [...state.files, file],
      selectedFile: file,
      saveStatus: 'modified'
    }));
  },
  createFromDefault: async (name, folder = "textures") => {
    const { currentPackName } = get();
    try {
      const textureRes = await fetch(`/textures/default/textures/${name}.png`);
      if (!textureRes.ok) {
            toast.error(`Texture "${name}" not found in default pack.`);
            return;
        }
      const fileBlob = await textureRes.blob();
        const fullPath = `${currentPackName || "MyPack"}/${folder}/${name}.png`;
        const newFile = new File([fileBlob], `${name}.png`, { type: 'image/png' });
        Object.defineProperty(newFile, 'webkitRelativePath', { value: fullPath, writable: true });
        const editData = await dataURLToImageData(await fileToDataURL(newFile));
        set(state => ({
            files: [...state.files, newFile],
            edits: { ...state.edits, [fullPath]: editData },
            selectedFile: newFile,
            saveStatus: 'modified'
        }));
        toast.success(`Created ${name} from default.`);
    } catch (e) {
        console.error(e);
        toast.error("Failed to load default texture.");
    }
  },
  deleteFile: (path) => {
    set(state => {
      const newEdits = { ...state.edits };
      delete newEdits[path];
      const newFiles = state.files.filter(f => (f.webkitRelativePath || f.name) !== path);
      let newSelectedFile = state.selectedFile;
      if (state.selectedFile && (state.selectedFile.webkitRelativePath || state.selectedFile.name) === path) {
        newSelectedFile = newFiles.length > 0 ? newFiles[0] : null;
      }
      return { edits: newEdits, files: newFiles, selectedFile: newSelectedFile, saveStatus: 'modified' };
    });
  },
  deleteFolder: (folderPath) => {
    const folderPathSlash = folderPath.endsWith('/') ? folderPath : folderPath + '/';
    set(state => {
      const newFiles = state.files.filter(f => {
        const filePath = f.webkitRelativePath || f.name;
        return !filePath.startsWith(folderPathSlash);
      });
      const newEdits = { ...state.edits };
      Object.keys(newEdits).forEach(key => {
        if (key.startsWith(folderPathSlash)) {
          delete newEdits[key];
        }
      });
      let newSelectedFile = state.selectedFile;
      if (state.selectedFile) {
        const selectedPath = state.selectedFile.webkitRelativePath || state.selectedFile.name;
        if (selectedPath.startsWith(folderPathSlash)) {
          newSelectedFile = newFiles.length > 0 ? newFiles[0] : null;
        }
      }
      return { files: newFiles, edits: newEdits, selectedFile: newSelectedFile, saveStatus: 'modified' };
    });
  },
  duplicateFile: (path) => {
    const { files } = get();
    const fileToDuplicate = files.find(f => (f.webkitRelativePath || f.name) === path);
    if (!fileToDuplicate) return;
    const pathParts = path.split('/');
    const filename = pathParts.pop() || '';
    const folderPath = pathParts.length > 0 ? pathParts.join('/') + '/' : '';
    const extParts = filename.split('.');
    const ext = extParts.length > 1 ? extParts.pop() : '';
    const nameWithoutExt = ext ? extParts.join('.') : filename;
    let counter = 1;
    let newName = `${nameWithoutExt} (${counter})${ext ? '.' + ext : ''}`;
    let newPath = `${folderPath}${newName}`;
    while (files.some(f => (f.webkitRelativePath || f.name) === newPath)) {
      counter++;
      newName = `${nameWithoutExt} (${counter})${ext ? '.' + ext : ''}`;
      newPath = `${folderPath}${newName}`;
    }
    const newFile = new File([fileToDuplicate], newName, { type: fileToDuplicate.type });
    Object.defineProperty(newFile, 'webkitRelativePath', { value: newPath, writable: true });
    set(state => {
      const newEdits = { ...state.edits };
      if (state.edits[path]) {
        const oldImg = state.edits[path];
        const newImg = new ImageData(new Uint8ClampedArray(oldImg.data), oldImg.width, oldImg.height);
        newEdits[newPath] = newImg;
      }
      return {
        files: [...state.files, newFile],
        edits: newEdits,
        saveStatus: 'modified'
      };
    });
  },
  moveFile: (oldPath, newFolder) => {
    const { files, selectedFile } = get();
    const fileToMove = files.find(f => (f.webkitRelativePath || f.name) === oldPath);
    if (!fileToMove) return;
    const filename = oldPath.split('/').pop() || '';
    const cleanFolder = newFolder.replace(/^\/|\/$/g, '');
    const newPath = cleanFolder ? `${cleanFolder}/${filename}` : filename;
    if (oldPath === newPath) return;
    if (files.some(f => (f.webkitRelativePath || f.name) === newPath)) {
      toast.error("A file with that name already exists in the destination folder.");
      return;
    }
    const newFile = new File([fileToMove], filename, { type: fileToMove.type });
    Object.defineProperty(newFile, 'webkitRelativePath', { value: newPath, writable: true });
    set(state => {
      const newFiles = state.files.map(f => (f.webkitRelativePath || f.name) === oldPath ? newFile : f);
      const newEdits = { ...state.edits };
      if (newEdits[oldPath]) {
        newEdits[newPath] = newEdits[oldPath];
        delete newEdits[oldPath];
      }
      let newSelected = state.selectedFile;
      if (selectedFile && (selectedFile.webkitRelativePath || selectedFile.name) === oldPath) {
         newSelected = newFile;
      }
      return { files: newFiles, edits: newEdits, selectedFile: newSelected, saveStatus: 'modified' };
    });
  },
  moveFiles: (paths, newFolder) => {
    if (paths.length === 0) return;
    const { files, selectedFile } = get();
    const cleanFolder = newFolder.replace(/^\/|\/$/g, '');
    const pathSet = new Set(paths);
    const filesToMove = files.filter(f => pathSet.has(f.webkitRelativePath || f.name));
    if (filesToMove.length === 0) return;
    const conflicts: string[] = [];
    const newFileMap = new Map<string, File>();
    filesToMove.forEach(fileToMove => {
      const filename = (fileToMove.webkitRelativePath || fileToMove.name).split('/').pop() || '';
      const newPath = cleanFolder ? `${cleanFolder}/${filename}` : filename;
      if (files.some(f => (f.webkitRelativePath || f.name) === newPath)) {
        conflicts.push(filename);
        return;
      }
      const newFileObj = new File([fileToMove], filename, { type: fileToMove.type });
      Object.defineProperty(newFileObj, 'webkitRelativePath', { value: newPath, writable: true });
      newFileMap.set(fileToMove.webkitRelativePath || fileToMove.name, newFileObj);
    });
    if (conflicts.length > 0) {
      toast.error(`Conflicts: ${conflicts.slice(0, 3).join(', ')}${conflicts.length > 3 ? '...' : ''}`);
      if (conflicts.length === filesToMove.length) return;
    }
    set(state => {
      const oldToNew = new Map<string, string>();
      newFileMap.forEach((newFile, oldPath) => {
        const newPathVal = newFile.webkitRelativePath || newFile.name;
        oldToNew.set(oldPath, newPathVal);
      });
      const newFiles = state.files.map(f => {
        const oldPathVal = f.webkitRelativePath || f.name;
        const existing = newFileMap.get(oldPathVal);
        return existing || f;
      });
      const newEdits = { ...state.edits };
      oldToNew.forEach((newPathVal, oldPathVal) => {
        if (newEdits[oldPathVal]) {
          newEdits[newPathVal] = newEdits[oldPathVal];
          delete newEdits[oldPathVal];
        }
      });
      let newSelected = state.selectedFile;
      if (selectedFile) {
        const selectedPath = selectedFile.webkitRelativePath || selectedFile.name;
        const mapped = oldToNew.get(selectedPath);
        if (mapped) {
          newSelected = newFiles.find(f => (f.webkitRelativePath || f.name) === mapped) || null;
        }
      }
      return { files: newFiles, edits: newEdits, selectedFile: newSelected, saveStatus: 'modified' as const };
    });
  },
  renameFile: (oldPath, newName) => {
    const { files, selectedFile } = get();
    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName.includes('/') ) {
      toast.error("Invalid name.");
      return;
    }
    const oldExt = oldPath.split('.').pop();
    const finalName = trimmedName.endsWith(`.${oldExt}`) ? trimmedName : `${trimmedName}.${oldExt}`;
    const newPath = oldPath.substring(0, oldPath.lastIndexOf('/') + 1) + finalName;
    if (files.some(f => (f.webkitRelativePath || f.name) === newPath)) {
      toast.error("File already exists.");
      return;
    }
    set(state => {
      const newFiles = state.files.map(file => {
        if ((file.webkitRelativePath || file.name) === oldPath) {
          const newFile = new File([file], finalName, { type: file.type });
          Object.defineProperty(newFile, 'webkitRelativePath', { value: newPath, writable: true });
          return newFile;
        }
        return file;
      });
      let newSelectedFile = state.selectedFile;
      if (selectedFile && (selectedFile.webkitRelativePath || selectedFile.name) === oldPath) {
          newSelectedFile = newFiles.find(f => (f.webkitRelativePath || f.name) === newPath) || null;
      }
      const newEdits = { ...state.edits };
      if (newEdits[oldPath]) {
        newEdits[newPath] = newEdits[oldPath];
        delete newEdits[oldPath];
      }
      return { files: newFiles, selectedFile: newSelectedFile, edits: newEdits, saveStatus: 'modified' };
    });
  },
  renameFolder: (oldPath, newName) => {
    const { files } = get();
    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName.includes('/')) {
      toast.error("Invalid folder name.");
      return;
    }
    const oldPathSlash = oldPath.endsWith('/') ? oldPath : oldPath + '/';
    const lastSlashIndex = oldPath.lastIndexOf('/');
    const parentPath = lastSlashIndex > 0 ? oldPath.substring(0, lastSlashIndex) : '';
    const newPathBase = parentPath ? `${parentPath}/${trimmedName}` : trimmedName;
    const newPathSlash = newPathBase.endsWith('/') ? newPathBase : newPathBase + '/';
    if (files.some(f => {
      const filePath = f.webkitRelativePath || f.name;
      return filePath.startsWith(newPathSlash);
    })) {
      toast.error("A folder with that name already exists.");
      return;
    }
    set(state => {
      const newFiles = state.files.map(file => {
        const filePath = file.webkitRelativePath || file.name;
        if (filePath.startsWith(oldPathSlash)) {
          const newFilePath = newPathSlash + filePath.substring(oldPathSlash.length);
          const newFile = new File([file], file.name, { type: file.type });
          Object.defineProperty(newFile, 'webkitRelativePath', { value: newFilePath, writable: true });
          return newFile;
        }
        return file;
      });
      const newEdits: Record<string, ImageData> = {};
      Object.entries(state.edits).forEach(([key, value]) => {
        if (key.startsWith(oldPathSlash)) {
          const newKey = newPathSlash + key.substring(oldPathSlash.length);
          newEdits[newKey] = value;
        } else {
          newEdits[key] = value;
        }
      });
      let newSelectedFile = state.selectedFile;
      if (state.selectedFile) {
        const selectedPath = state.selectedFile.webkitRelativePath || state.selectedFile.name;
        if (selectedPath.startsWith(oldPathSlash)) {
          const newSelectedPath = newPathSlash + selectedPath.substring(oldPathSlash.length);
          newSelectedFile = newFiles.find(f => (f.webkitRelativePath || f.name) === newSelectedPath) || null;
        }
      }
      return { files: newFiles, edits: newEdits, selectedFile: newSelectedFile, saveStatus: 'modified' };
    });
  },
  downloadZip: async () => {
    const { files, edits, currentPackName } = get();
    if (files.length === 0) return;
    const zip = new JSZip();
    const packName = currentPackName || "BloxdForge_Pack";
    for (const file of files) {
      let pathInZip = file.webkitRelativePath || file.name;
      if (pathInZip.startsWith(packName + '/')) {
        pathInZip = pathInZip.substring(packName.length + 1);
      }
      const pathKey = file.webkitRelativePath || file.name;
      const editedData = edits[pathKey];
      if (editedData) {
        const canvas = document.createElement('canvas');
        canvas.width = editedData.width;
        canvas.height = editedData.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.putImageData(editedData, 0, 0);
          const blob = await new Promise<Blob|null>(resolve => canvas.toBlob(resolve, 'image/png'));
          if (blob) zip.file(pathInZip, blob);
        }
      } else {
        zip.file(pathInZip, file);
      }
    }
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${packName}.zip`;
    document.body.appendChild(link);
    try {
      link.click();
    } finally {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  },
  downloadFile: async (path) => {
    const { files, edits } = get();
    const file = files.find(f => (f.webkitRelativePath || f.name) === path);
    if (!file) {
      toast.error("File not found.");
      return;
    }
    const editedData = edits[path];
    let blob: Blob;
    const filename = file.name;
    if (editedData) {
      const canvas = document.createElement('canvas');
      canvas.width = editedData.width;
      canvas.height = editedData.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.putImageData(editedData, 0, 0);
        const pngBlob = await new Promise<Blob|null>(resolve => canvas.toBlob(resolve, 'image/png'));
        if (!pngBlob) {
          toast.error("Failed to export image.");
          return;
        }
        blob = pngBlob;
      } else {
        toast.error("Failed to export image.");
        return;
      }
    } else {
      blob = file;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    try {
      link.click();
    } finally {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  },
}));
