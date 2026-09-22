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
import { COMPILE_REMIX_CSS } from '@/lib/css-templates';
import { idbKeyval } from '@/lib/idb';
export interface RemixAsset {
  path: string;
  blob: Blob;
  author: string;
  sourcePack: string;
  category: 'texture' | 'model' | 'skybox' | 'css' | 'other';
}
export interface ModuleValue {
  [key: string]: string | number;
}
interface RemixState {
  assets: Record<string, RemixAsset>;
  activeModules: Record<string, ModuleValue>;
  addAsset: (path: string, blob: Blob, author: string, sourcePack: string) => void;
  removeAsset: (path: string) => void;
  toggleModule: (id: string, initialValues: ModuleValue) => void;
  updateModuleValue: (moduleId: string, key: string, value: string | number) => void;
  removeModule: (id: string) => void;
  resetStore: () => void;
  generateRemixZip: (filename: string) => Promise<Blob>;
  openInCreator: (packName: string) => Promise<void>;
}
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
export const useRemixStore = create<RemixState>((set, get) => ({
  assets: {},
  activeModules: {
    adblock: {}
  },
  addAsset: (path, blob, author, sourcePack) => {
    let category: RemixAsset['category'] = 'other';
    const lowerPath = path.toLowerCase();
    if (lowerPath.startsWith('textures/') && (lowerPath.endsWith('.png') || lowerPath.endsWith('.jpg') || lowerPath.endsWith('.jpeg'))) {
        category = 'texture';
    } else if (lowerPath.startsWith('models/') && lowerPath.endsWith('.glb')) {
        category = 'model';
    } else if (lowerPath.startsWith('css/') && lowerPath.endsWith('.css')) {
        category = 'css';
    } else if (lowerPath.startsWith('skyboxes/')) {
        category = 'skybox';
    } else if (lowerPath.endsWith('.png') || lowerPath.endsWith('.jpg') || lowerPath.endsWith('.jpeg')) {
        category = 'texture';
    } else if (lowerPath.endsWith('.glb')) {
        category = 'model';
    } else if (lowerPath.endsWith('.css')) {
        category = 'css';
    }
    set((state) => ({
      assets: {
        ...state.assets,
        [path]: { path, blob, author, sourcePack, category }
      }
    }));
  },
  removeAsset: (path) => {
    set((state) => {
      const newAssets = { ...state.assets };
      delete newAssets[path];
      return { assets: newAssets };
    });
  },
  toggleModule: (id, initialValues) => set(s => {
    const newModules = { ...s.activeModules };
    if (newModules[id]) {
      delete newModules[id];
    } else {
      newModules[id] = initialValues;
    }
    return { activeModules: newModules };
  }),
  updateModuleValue: (moduleId, key, value) => set(s => ({
    activeModules: {
      ...s.activeModules,
      [moduleId]: {
        ...s.activeModules[moduleId],
        [key]: value
      }
    }
  })),
  removeModule: (id) => set(s => {
    const newModules = { ...s.activeModules };
    delete newModules[id];
    return { activeModules: newModules };
  }),
  resetStore: () => set({
    assets: {},
    activeModules: { adblock: {} }
  }),
  generateRemixZip: async (filename) => {
    const { assets, activeModules } = get();
    const zip = new JSZip();
    const authors = new Set<string>();
    const texturesFolder = zip.folder("textures");
    const modelsFolder = zip.folder("models");
    const cssFolder = zip.folder("css");
    const skyBoxesFolder = zip.folder("skyBoxes");
    for (const asset of Object.values(assets)) {
      authors.add(asset.author);
      const fileName = asset.path.split('/').pop();
      if (!fileName) continue;
      let folder: JSZip | null = null;
      let filePathInZip = fileName;
      switch (asset.category) {
          case 'texture': folder = texturesFolder; break;
          case 'model': folder = modelsFolder; break;
          case 'css': folder = cssFolder; break;
          case 'skybox':
              folder = skyBoxesFolder;
              if (asset.path.startsWith('skyBoxes/')) {
                  filePathInZip = asset.path.substring('skyBoxes/'.length);
              } else if (asset.path.startsWith('skyboxes/')) {
                  filePathInZip = asset.path.substring('skyboxes/'.length);
              }
              break;
          default:
              zip.file(fileName, asset.blob);
              continue;
      }
      if (folder) folder.file(filePathInZip, asset.blob);
    }
    const customCssContent = COMPILE_REMIX_CSS(activeModules);
    if (customCssContent.trim()) {
      cssFolder!.file('bloxdforge_remix_styles.css', customCssContent.trim());
    }
    const credits = [
      `Remix Pack: ${filename}`,
      `Generated with BloxdForge Remix Studio (https://www.bloxdforge.com)`,
      `Date: ${new Date().toLocaleDateString()}`,
      ``,
      `--- Credits ---`,
      ...Array.from(authors).map(a => `- ${a}`),
      ``,
      `This pack was assembled using various community assets.`,
      `Support the original creators!`
    ].join('\r\n');
    zip.file('credits.txt', credits);
    const description = [
      `A custom remix pack created with BloxdForge.`,
      `Made with BloxdForge - https://www.bloxdforge.com`,
      ``,
      `Includes assets from: ${Array.from(authors).join(', ')}`
    ].join('\r\n');
    zip.file('description.txt', description);
    return await zip.generateAsync({ type: 'blob' });
  },
  openInCreator: async (packName: string) => {
    const { assets } = get();
    const serializableAssets = await Promise.all(
      Object.values(assets).map(async asset => {
        let mime = asset.blob.type;
        if (!mime || mime === 'application/octet-stream') {
             if (asset.path.endsWith('.png')) mime = 'image/png';
             else if (asset.path.endsWith('.css')) mime = 'text/css';
             else if (asset.path.endsWith('.glb')) mime = 'model/gltf-binary';
             else if (asset.path.match(/\.jpe?g$/)) mime = 'image/jpeg';
        }
        const content = await blobToBase64(asset.blob);
        return {
            path: asset.path,
            content: content,
            name: asset.path.split('/').pop() || asset.path,
            type: mime,
        };
      })
    );
    const sessionData = { packName, files: serializableAssets };
    await idbKeyval.set('remix-to-creator-session', sessionData);
  },
}));