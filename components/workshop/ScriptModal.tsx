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

import { useState, useEffect } from 'react';
import { X, Copy, Check, User, Code, FileText, FilePenLine, Share2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Image from 'next/image';
import imageKitLoader from '@/lib/image-loader';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
export interface ScriptItem {
  hash?: string;
  title: string;
  type: string;
  code: string;
  img?: string;
  description?: string;
  author: string;
  tags: string[];
}
interface ScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: ScriptItem | null;
}
export default function ScriptModal({ isOpen, onClose, script }: ScriptModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!isOpen) {
        setCopied(false);
        setShareCopied(false);
    }
  }, [isOpen]);
  if (!isOpen || !script) return null;
  const handleCopy = () => {
    navigator.clipboard.writeText(script.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleOpenInEditor = () => {
    if (script) {
        localStorage.setItem("bloxdforge_current_script", script.code);
        onClose();
        router.push('/studio/world-tools');
        toast.success("Script loaded into editor!");
    }
  };
  const handleShare = () => {
    if (script?.hash) {
        const url = `${window.location.origin}/studio/workshop?script=${script.hash}`;
        navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
    } else {
        toast.error("Cannot generate a share link for this script.");
    }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className="bg-background border border-surface-border w-full h-[100vh] md:h-[85vh] md:max-h-[90vh] md:max-w-6xl md:rounded-2xl flex flex-col md:flex-row overflow-hidden relative shadow-2xl z-10 animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="script-modal-title"
      >
        <div className="order-2 md:order-1 w-full md:w-[350px] bg-surface flex flex-col border-t md:border-t-0 md:border-r border-surface-border overflow-hidden flex-shrink-0">
          <div className="relative aspect-video w-full bg-[#0a0a0a] border-b border-surface-border shrink-0 hidden md:block">
            {script.img ? (
              <Image 
                loader={imageKitLoader}
                src={script.img} 
                alt={script.title} 
                fill 
                className="object-cover"
                onError={(e) => {
                   e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-hairline-strong">
                <Code size={48} className="opacity-20" />
              </div>
            )}
          </div>
          <div className="p-4 md:p-6 space-y-6 flex-1 overflow-y-auto pb-safe-area-inset-bottom">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white leading-tight mb-2">{script.title}</h2>
              <div className="flex flex-wrap gap-1.5">
                {script.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-surface-hover text-text-muted px-2 py-0.5 rounded-full border border-surface-border">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 bg-surface-hover p-3 rounded-xl border border-surface-border">
              <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center text-text-muted">
                <User size={20} />
              </div>
              <div>
                <div className="text-xs text-text-subtle uppercase font-bold tracking-wider">Created By</div>
                <div className="text-white font-medium">{script.author}</div>
              </div>
            </div>
            {script.description && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
                  <FileText size={16} />
                  <span>Description</span>
                </div>
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap bg-surface p-4 rounded-lg border border-surface-border">
                  {script.description}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="order-1 md:order-2 flex-1 bg-background flex flex-col min-h-0 min-w-0 h-[50vh] md:h-auto border-b md:border-b-0 border-surface-border">
          <div className="flex items-center justify-between p-4 border-b border-surface-border bg-surface">
             <div className="text-sm font-bold text-gray-300 flex items-center gap-2">
               <Code size={16} className="text-primary" /> Script Code
             </div>
             <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  disabled={!script.hash}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${shareCopied ? 'bg-green-500/10 text-green-400 border-green-500/50' : 'bg-surface-hover text-gray-300 border-surface-border hover:border-gray-500 disabled:opacity-50'}`}
                >
                    {shareCopied ? <Check size={14}/> : <Share2 size={14}/>} {shareCopied ? 'Copied!' : 'Share'}
                </button>
                <button
                  onClick={handleOpenInEditor}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary border-primary/20 border hover:bg-primary/20"
                >
                  <FilePenLine size={14} />
                  Open in Editor
                </button>
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${copied ? 'bg-green-500/10 text-green-400 border-green-500/50' : 'bg-surface-hover text-gray-300 border-surface-border hover:border-gray-500'}`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
                 <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={16} aria-hidden="true" />
                </button>
             </div>
          </div>
          <div className="flex-1 overflow-auto bg-background custom-scrollbar">
             <SyntaxHighlighter
               language="javascript"
               style={vscDarkPlus}
               customStyle={{ margin: 0, padding: '1.5rem', background: '#141313', fontSize: '13px', minHeight: '100%' }}
               showLineNumbers
             >
               {script.code}
             </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
}