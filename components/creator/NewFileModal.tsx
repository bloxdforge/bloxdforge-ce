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

import { useState, useEffect, useRef } from "react";
import { X, FileImage, Download, Plus, Check, ChevronUp, ChevronDown, FileCode } from "lucide-react";
import { useCreatorStore } from "@/stores/useCreatorStore";
import { fetchSecureData } from "@/lib/secure-data";
interface NewFileModalProps {
  onClose: () => void;
}
const CustomNumberInput = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) onChange(val);
    };
    return (
        <div className="relative">
            <input 
                type="number"
                value={value}
                onChange={handleChange}
                className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2.5 text-sm text-white pr-8 placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="16" 
                min="1"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center h-full">
                <button tabIndex={-1} onClick={() => onChange(value + 1)} className="h-1/2 px-1 flex items-center justify-center text-text-subtle hover:text-white"><ChevronUp size={12}/></button>
                <button tabIndex={-1} onClick={() => onChange(Math.max(1, value - 1))} className="h-1/2 px-1 flex items-center justify-center text-text-subtle hover:text-white"><ChevronDown size={12}/></button>
            </div>
        </div>
    );
};
export default function NewFileModal({ onClose }: NewFileModalProps) {
  const { createBlankTexture, createFromDefault, createCssFile } = useCreatorStore();
  const [step, setStep] = useState<'type' | 'name_texture' | 'method_texture' | 'res_texture' | 'name_css'>('type');
  const [textureName, setTextureName] = useState("");
  const [cssName, setCssName] = useState("");
  const [knownTextures, setKnownTextures] = useState<Set<string>>(new Set());
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [customWidth, setCustomWidth] = useState(16);
  const [customHeight, setCustomHeight] = useState(16);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fetchSecureData<string>('textures.txt', 'text')
      .then(text => {
        const names = text.split('\n').map(n => n.trim()).filter(Boolean);
        setKnownTextures(new Set(names));
      })
      .catch(e => console.error("Failed to load texture index", e));
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setIsDropdownVisible(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleTextureNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTextureName(value);
    setActiveIndex(-1);
    if (value.trim()) {
        const filtered = Array.from(knownTextures).filter(tex => 
            tex.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);
        setSuggestions(filtered);
        setIsDropdownVisible(filtered.length > 0);
    } else {
        setSuggestions([]);
        setIsDropdownVisible(false);
    }
  };
  const handleSuggestionClick = (suggestion: string) => {
    setTextureName(suggestion);
    setIsDropdownVisible(false);
  };
  const handleTextureNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isDropdownVisible) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex > -1 && suggestions[activeIndex]) {
                handleSuggestionClick(suggestions[activeIndex]);
            } else {
                handleTextureNameSubmit();
            }
        } else if (e.key === 'Escape') {
            setIsDropdownVisible(false);
        }
    } else if (e.key === 'Enter') {
        handleTextureNameSubmit();
    }
  };
  const handleTextureNameSubmit = () => {
    if (!textureName.trim()) return;
    const cleanName = textureName.trim().replace(/\.png$/, '');
    setTextureName(cleanName);
    setIsDropdownVisible(false);
    if (knownTextures.has(cleanName)) {
      setStep('method_texture');
    } else {
      setStep('res_texture');
    }
  };
  const handleCssNameSubmit = () => {
    if (!cssName.trim()) return;
    createCssFile(cssName);
    onClose();
  };
  const handleDefaultCreate = async () => {
    await createFromDefault(textureName);
    onClose();
  };
  const handleBlankCreate = () => {
    setStep('res_texture');
  };
  const handleCustomCreate = (w: number, h: number) => {
    createBlankTexture(textureName, w, h);
    onClose();
  };
  const renderStep = () => {
    switch(step) {
      case 'type':
        return (
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">Choose a file type</h4>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setStep('name_texture')} className="flex flex-col items-center justify-center p-4 bg-surface-hover border border-surface-border rounded-lg hover:border-primary hover:bg-surface-hover transition-all group">
                <FileImage size={24} className="mb-2 text-text-muted group-hover:text-primary" />
                <span className="text-sm font-bold text-white">Texture</span>
                <span className="text-[10px] text-text-subtle mt-1">.png</span>
              </button>
              <button onClick={() => setStep('name_css')} className="flex flex-col items-center justify-center p-4 bg-surface-hover border border-surface-border rounded-lg hover:border-primary hover:bg-surface-hover transition-all group">
                <FileCode size={24} className="mb-2 text-text-muted group-hover:text-primary" />
                <span className="text-sm font-bold text-white">Stylesheet</span>
                <span className="text-[10px] text-text-subtle mt-1">.css</span>
              </button>
            </div>
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-left">
              <p className="text-sm font-semibold text-blue-300">Want to add a 3D model?</p>
              <p className="text-xs text-gray-300 mt-1">Use <span className="font-semibold">Import File</span> in the left panel and select a <span className="font-mono">.glb</span> file. BloxdForge auto-places it in the <span className="font-mono">models/</span> folder.</p>
            </div>
          </div>
        );
      case 'name_texture':
        return (
            <div className="space-y-4">
              <p className="text-sm text-text-muted">Enter the texture name. Use autocomplete for standard assets.</p>
              <div className="relative">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="e.g., stone, diamond_sword..." 
                    className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                  value={textureName}
                  onChange={handleTextureNameChange}
                  onKeyDown={handleTextureNameKeyDown}
                  autoComplete="off"
                />
                {knownTextures.has(textureName) && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none">
                    <Check size={18} />
                  </div>
                )}
                {isDropdownVisible && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface-hover border border-surface-border rounded-lg shadow-lg z-10 overflow-hidden">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={suggestion}
                                onMouseDown={() => handleSuggestionClick(suggestion)}
                                onMouseEnter={() => setActiveIndex(index)}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${index === activeIndex ? 'bg-primary text-white' : 'text-gray-300 hover:bg-surface'}`}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
              </div>
              <button 
                onClick={handleTextureNameSubmit}
                disabled={!textureName.trim()}
                    className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-all shadow-sm shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
        );
      case 'name_css':
          return (
             <div className="space-y-4">
                <p className="text-sm text-text-muted">Enter the CSS filename. It will be placed in the `css/` folder.</p>
                <input 
                    autoFocus
                    type="text" 
                    placeholder="e.g., my-styles" 
                  className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                    value={cssName}
                    onChange={e => setCssName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCssNameSubmit()}
                />
                <button 
                    onClick={handleCssNameSubmit}
                    disabled={!cssName.trim()}
                className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-all shadow-sm shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Create CSS File
                </button>
            </div>
          );
      case 'method_texture':
        return (
           <div className="space-y-4">
               <div className="mb-4">
                <h4 className="text-white font-bold text-lg">Choose a starting point</h4>
                <p className="text-sm text-text-muted mt-1">
                  <code className="bg-surface-hover px-1.5 py-1 rounded-md text-primary text-xs font-mono">{textureName}.png</code> is a standard game asset. You can edit the default texture or start from scratch.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleDefaultCreate} className="flex flex-col items-center justify-center p-4 bg-surface-hover border border-surface-border rounded-lg hover:border-primary hover:bg-surface-hover transition-all group">
                  <Download size={24} className="mb-2 text-text-muted group-hover:text-primary" />
                  <span className="text-sm font-bold text-white">Use Default</span>
                  <span className="text-[10px] text-text-subtle mt-1 text-center">Load the original game asset</span>
                </button>
                <button onClick={handleBlankCreate} className="flex flex-col items-center justify-center p-4 bg-surface-hover border border-surface-border rounded-lg hover:border-primary hover:bg-surface-hover transition-all group">
                  <FileImage size={24} className="mb-2 text-text-muted group-hover:text-primary" />
                  <span className="text-sm font-bold text-white">Create Blank</span>
                  <span className="text-[10px] text-text-subtle mt-1 text-center">Start from scratch</span>
                </button>
              </div>
            </div>
        );
      case 'res_texture':
        return (
          <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep('name_texture')} className="text-xs text-text-subtle hover:text-white">Back</button>
                <span className="text-text-subtle">/</span>
                <span className="text-xs text-gray-300">Resolution</span>
              </div>
              <div className="space-y-2">
                <button onClick={() => handleCustomCreate(16, 16)} className="w-full p-3 flex justify-between items-center bg-surface-hover border border-surface-border rounded-lg hover:border-primary transition-colors">
                  <span className="text-white font-bold">16 x 16</span>
                  <span className="text-xs text-text-subtle">Standard</span>
                </button>
                <button onClick={() => handleCustomCreate(32, 32)} className="w-full p-3 flex justify-between items-center bg-surface-hover border border-surface-border rounded-lg hover:border-primary transition-colors">
                  <span className="text-white font-bold">32 x 32</span>
                  <span className="text-xs text-text-subtle">HD</span>
                </button>
                <button onClick={() => handleCustomCreate(64, 64)} className="w-full p-3 flex justify-between items-center bg-surface-hover border border-surface-border rounded-lg hover:border-primary transition-colors">
                  <span className="text-white font-bold">64 x 64</span>
                  <span className="text-xs text-text-subtle">UHD</span>
                </button>
              </div>
              <div className="pt-4 border-t border-surface-border">
                <p className="text-xs text-text-muted mb-2">Custom Size</p>
                <div className="flex items-center gap-2">
                    <div className="flex-1"><CustomNumberInput value={customWidth} onChange={setCustomWidth} /></div>
                    <span className="text-text-subtle pb-2">x</span>
                    <div className="flex-1"><CustomNumberInput value={customHeight} onChange={setCustomHeight} /></div>
                    <button onClick={() => handleCustomCreate(customWidth, customHeight)} className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-surface text-white rounded-lg hover:bg-primary transition-colors">
                        <Plus size={20}/>
                    </button>
                </div>
              </div>
            </div>
        );
    }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div ref={containerRef} className="bg-background border border-surface-border rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-surface-border">
          <h3 className="font-bold text-white">New File</h3>
          <button onClick={onClose} aria-label="Close modal" className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors"><X size={20} aria-hidden="true"/></button>
        </div>
        <div className="p-6 space-y-6">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}