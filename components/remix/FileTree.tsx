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

import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown, Folder, FileImage, Box, FileCode, Cloud, Trash2 } from "lucide-react";
import { RemixAsset } from "@/stores/useRemixStore";
interface TreeNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  asset?: RemixAsset;
  children: Record<string, TreeNode>;
}
interface FileTreeProps {
  assets: Record<string, RemixAsset>;
  onRemoveAsset: (path: string) => void;
}
const FileTreeItem = ({ node, level, onRemoveAsset }: { node: TreeNode, level: number, onRemoveAsset: (path: string) => void }) => {
  const [isOpen, setIsOpen] = useState(true);
  const getIcon = () => {
    if (node.type === 'folder') return <Folder size={14} className="text-yellow-500 shrink-0" />;
    if (node.asset?.category === 'model') return <Box size={14} className="text-blue-400 shrink-0" />;
    if (node.asset?.category === 'css') return <FileCode size={14} className="text-purple-400 shrink-0" />;
    if (node.asset?.category === 'skybox') return <Cloud size={14} className="text-cyan-400 shrink-0" />;
    return <FileImage size={14} className="text-text-subtle shrink-0" />;
  };
  if (node.type === 'file' && node.asset) {
    return (
      <div 
        className="group flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-surface-hover transition-colors duration-150"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {getIcon()}
          <span className="text-xs truncate text-text-muted font-mono">{node.name}</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onRemoveAsset(node.path); }}
          aria-label={`Remove ${node.name}`}
          className="bf-press opacity-0 group-hover:opacity-100 focus-visible:opacity-100 p-1 text-text-subtle hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors duration-150 shrink-0"
        >
          <Trash2 size={12} />
        </button>
      </div>
    );
  }
  return (
    <div>
      <div 
        className="flex items-center gap-1.5 py-1.5 px-2 text-text-muted hover:text-foreground cursor-pointer select-none rounded-md hover:bg-surface-hover transition-colors duration-150"
        style={{ paddingLeft: `${level * 16 + 4}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronDown size={12} className="shrink-0 text-text-subtle" /> : <ChevronRight size={12} className="shrink-0 text-text-subtle" />}
        {getIcon()}
        <span className="text-xs font-medium tracking-tight">{node.name}</span>
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
                onRemoveAsset={onRemoveAsset}
              />
            ))}
        </div>
      )}
    </div>
  );
};
export default function FileTree({ assets, onRemoveAsset }: FileTreeProps) {
  const fileTree = useMemo(() => {
    const root: TreeNode = { name: 'root', path: '', type: 'folder', children: {} };
    const ensureFolder = (path: string) => {
      let current = root;
      const parts = path.split('/');
      parts.forEach(part => {
        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            path: `${current.path ? current.path + '/' : ''}${part}`,
            type: 'folder',
            children: {}
          };
        }
        current = current.children[part];
      });
      return current;
    };
    ensureFolder('textures');
    ensureFolder('models');
    ensureFolder('css');
    ensureFolder('skyBoxes');
    for (const asset of Object.values(assets)) {
      const pathParts = asset.path.split('/');
      const fileName = pathParts.pop() || asset.path;
      const folderPath = pathParts.join('/');
      let parentNode = root;
      if (folderPath) {
        parentNode = ensureFolder(folderPath);
      }
      parentNode.children[fileName] = {
        name: fileName,
        path: asset.path,
        type: 'file',
        asset: asset,
        children: {}
      };
    }
    return root;
  }, [assets]);
  return (
    <div className="space-y-1">
       {Object.values(fileTree.children)
        .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1))
        .map(node => (
            <FileTreeItem key={node.path} node={node} level={0} onRemoveAsset={onRemoveAsset} />
        ))
       }
    </div>
  )
}