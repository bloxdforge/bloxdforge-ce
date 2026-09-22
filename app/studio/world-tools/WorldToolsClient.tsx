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

import { useState, useRef, useEffect, useCallback, useMemo, type ClipboardEvent as ReactClipboardEvent, type DragEvent as ReactDragEvent } from "react";
import Editor, { OnMount, loader } from "@monaco-editor/react";
import * as monaco from 'monaco-editor';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  Code2, Copy, Trash2, Download, History, PanelRightOpen, PanelRightClose,
  ShieldAlert, Plus, AlertTriangle, AlertCircle, CheckCircle, Check, Search,
  ArrowLeft, Loader2, Info, TerminalSquare, Terminal, ChevronRight, ArrowUp, Square, RefreshCw, ChevronDown,
  Settings2, Pencil, X, ImagePlus
} from "lucide-react";
import toast from 'react-hot-toast';
import { useAiChat, type WikiItem, type Message, type UsageData, type ContentPart } from "@/hooks/useAiChat";
import { useBloxdLinter } from "@/hooks/useBloxdLinter";
import { useChatSessions } from "@/hooks/useChatSessions";
import { 
  LintError, VALID_SOUNDS, VALID_PARTICLES, VALID_PARTICLE_PRESETS, 
  VALID_CLIENT_OPTIONS, VALID_ENTITY_SETTINGS, VALID_MOB_SETTINGS, 
  VALID_CALLBACKS, API_METHODS, VALID_MUSIC, VALID_EFFECTS,
  VALID_POSES, VALID_SKIN_PARTS, VALID_AI_STATES, VALID_ICONS,
  VALID_NAME_COLOURS, VALID_ENTITY_NODES, VALID_MESH_TYPES, VALID_QTE_TYPES
} from "@/lib/bloxd-linter";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { clsx } from "clsx";
import { fuzzySearch } from "@/lib/search";
import { DOC_FILES } from "@/lib/docs";
import { fetchSecureData } from "@/lib/secure-data";
import { AIAgentLogo } from "@/components/settings/SettingsLogos";
import Link from "next/link";
import { AI_MODELS, AI_TONES, AiToneId, CUSTOM_MODELS_EVENT, CUSTOM_MODELS_KEY, CustomAiModel, DEFAULT_MODEL, VISION_MODELS, loadCustomModels } from "@/lib/ai-models";
import ModelIcon from "@/components/settings/ModelIcon";
import { useSettingsStore } from "@/stores/useSettingsStore";
import RenameScriptTabModal from "@/components/studio/RenameScriptTabModal";
if (typeof window !== 'undefined') {
  loader.config({ paths: { vs: '/lib/monaco/vs' } });
}
interface CombinedItem {
  type: 'wiki' | 'doc';
  title: string;
  tag: string;
  description: string;
  content?: string;
  url?: string;
}
interface MonacoEditor {
  revealLineInCenter: (lineNumber: number) => void;
  setPosition: (position: { lineNumber: number; column: number }) => void;
  focus: () => void;
  layout: () => void;
}
function messageContentToText(content: string | ContentPart[] | undefined): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  return content
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map(p => p.text)
    .join("\n");
}
function normalizeAssistantMarkdown(raw: string): string {
  if (!raw) return "";
  let normalized = raw.replace(/\r\n/g, "\n");
  normalized = normalized
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```(?:thinking|reasoning)[\s\S]*?```/gi, "");
  const fenceCount = (normalized.match(/```/g) || []).length;
  if (fenceCount % 2 !== 0) {
    normalized = `${normalized}\n\n\`\`\``;
  }
  return normalized.trim();
}
function getImageFiles(files: FileList | File[] | null): File[] {
  return Array.from(files || [])
    .filter(file => file.type.startsWith('image/'))
    .slice(0, 4);
}
function getImageFilesFromTransfer(dataTransfer: DataTransfer): File[] {
  const files = getImageFiles(dataTransfer.files);
  if (files.length) return files;
  return Array.from(dataTransfer.items)
    .filter(item => item.kind === 'file' && item.type.startsWith('image/'))
    .map(item => item.getAsFile())
    .filter((file): file is File => Boolean(file))
    .slice(0, 4);
}
function transferHasImage(dataTransfer: DataTransfer): boolean {
  return getImageFilesFromTransfer(dataTransfer).length > 0;
}
const SANITIZE_CONFIG = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] || []), 'id', 'dir'],
    div: [...(defaultSchema.attributes?.div || []), 'className', 'id'],
    span: [...(defaultSchema.attributes?.span || []), 'className', 'id'],
    li: [...(defaultSchema.attributes?.li || []), 'className', 'id'],
    input: [...(defaultSchema.attributes?.input || []), 'type', 'checked', 'disabled'],
    section: [...(defaultSchema.attributes?.section || []), 'data-footnotes', 'id'],
    a: [...(defaultSchema.attributes?.a || []), 'data-footnote-ref', 'data-footnote-backref', 'href', 'id'],
    sup: [...(defaultSchema.attributes?.sup || []), 'id'],
    h1: ['id'], h2: ['id'], h3: ['id'], h4: ['id'], h5: ['id'], h6: ['id']
  },
  tagNames: [...(defaultSchema.tagNames || []), 'input', 'section', 'sup', 'sub']
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /language-([\w#+-]+)/.exec(className || "");
  const codeStr = String(children).replace(/\n$/, "");
  const handleCopy = () => {
    navigator.clipboard.writeText(codeStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  if (!inline && match) {
    return (
      <div className="relative group/code rounded-xl overflow-hidden border border-surface-border my-4 bg-[#0a0a0a] shadow-sm not-italic text-left font-sans">
        <div className="flex items-center justify-between px-3 py-1.5 bg-background border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Terminal size={12} className="text-text-subtle" />
            <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider select-none">
              {match[1]}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium text-text-subtle hover:text-white hover:bg-surface-hover transition-colors"
            title="Copy code"
          >
            {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
            <span className={copied ? "text-green-500" : ""}>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            customStyle={{ margin: 0, padding: '0.75rem 1rem', background: 'transparent', fontSize: '13px', lineHeight: '1.5' }}
          >
            {codeStr}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }
  return (
    <code className="bg-surface text-primary px-1.5 py-0.5 rounded-md font-mono text-[12px] border border-surface-border not-italic" {...props}>
      {children}
    </code>
  );
};
const markdownComponents = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  h1: ({children}: any) => <h1 className="text-xl font-bold text-white mt-6 first:mt-0 mb-3 leading-tight">{children}</h1>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  h2: ({children, id}: any) => <h2 id={id} className="text-lg font-semibold text-white mt-5 first:mt-0 mb-2 pb-1 border-b border-surface-border">{children}</h2>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  h3: ({children, id}: any) => <h3 id={id} className="text-base font-semibold text-foreground mt-4 first:mt-0 mb-2">{children}</h3>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  h4: ({children, id}: any) => <h4 id={id} className="text-sm font-medium text-gray-300 mt-3 first:mt-0 mb-1">{children}</h4>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  h5: ({children, id}: any) => <h5 id={id} className="text-sm font-medium text-text-muted mt-3 first:mt-0 mb-1">{children}</h5>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  h6: ({children, id}: any) => <h6 id={id} className="text-xs font-medium text-text-subtle mt-3 first:mt-0 mb-1 uppercase tracking-wider">{children}</h6>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  p: ({children}: any) => <p className="text-sm text-gray-300 leading-relaxed mb-3 last:mb-0">{children}</p>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  a: ({href, children, ...props}: any) => {
    const isFootnoteBackref = 'data-footnote-backref' in props;
    const isFootnoteRef = 'data-footnote-ref' in props;
    if (href?.startsWith('#')) {
      return (
        <a 
          href={href} 
          className={clsx(
            "transition-colors",
            isFootnoteBackref ? "text-primary hover:text-primary-hover ml-1 no-underline" : "text-blue-400 hover:text-blue-300 underline underline-offset-2 decoration-blue-500/30 hover:decoration-blue-400",
            isFootnoteRef ? "no-underline text-primary" : ""
          )} 
          onClick={(e) => {
            e.preventDefault();
            const targetId = href.substring(1);
            const decodedTargetId = decodeURIComponent(targetId);
            const possibleIds = [targetId, decodedTargetId, `user-content-${targetId}`, `user-content-${decodedTargetId}`];
            let target: HTMLElement | null = null;
            for (const pid of possibleIds) {
               try {
                 const els = Array.from(document.querySelectorAll(`[id="${pid}"]`)) as HTMLElement[];
                 if (els.length > 0) {
                   const linkContainer = (e.target as HTMLElement).closest('.group');
                   if (linkContainer) {
                     target = els.find(el => linkContainer.contains(el)) || els[els.length - 1];
                   } else {
                     target = els[els.length - 1];
                   }
                   break;
                 }
               } catch { continue; }
            }
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              target.classList.add('bg-white/10', 'transition-colors', 'duration-300', 'rounded', 'px-1');
              setTimeout(() => target.classList.remove('bg-white/10'), 1500);
            }
          }}
          {...props}
        >
          {children}
        </a>
      );
    }
    return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 decoration-blue-500/30 hover:decoration-blue-400 transition-colors" {...props}>{children}</a>;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ul: ({children, className}: any) => <ul className={clsx("list-disc list-outside ml-4 mb-3 space-y-1.5 text-gray-300 marker:text-text-subtle", className === 'contains-task-list' ? 'list-none ml-0' : '')}>{children}</ul>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ol: ({children}: any) => <ol className="list-decimal list-outside ml-4 mb-3 space-y-1.5 text-gray-300 marker:text-text-subtle">{children}</ol>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  li: ({children, className, ...props}: any) => <li className={clsx(className === 'task-list-item' ? 'flex items-start gap-2' : 'pl-1', className)} {...props}>{children}</li>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: ({type, checked, disabled, ...props}: any) => {
    if (type === 'checkbox') {
      return <input type="checkbox" checked={checked} readOnly disabled={disabled} className="mt-1 w-3.5 h-3.5 rounded border-surface-border bg-surface text-primary focus:ring-primary focus:ring-offset-background flex-shrink-0" {...props} />;
    }
    return <input type={type} {...props} />;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blockquote: ({children}: any) => <blockquote className="border-l-2 border-primary/50 pl-3 py-1 my-3 text-text-muted italic bg-primary/5 rounded-r-lg not-italic">{children}</blockquote>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: ({children}: any) => <div className="overflow-x-auto my-4 rounded-lg border border-surface-border bg-background"><table className="w-full text-left text-xs border-collapse">{children}</table></div>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thead: ({children}: any) => <thead className="bg-surface border-b border-surface-border">{children}</thead>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tbody: ({children}: any) => <tbody className="divide-y divide-surface-border">{children}</tbody>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  th: ({children, style}: any) => <th style={style} className="px-3 py-2 font-semibold text-foreground">{children}</th>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  td: ({children, style}: any) => <td style={style} className="px-3 py-2 text-text-muted">{children}</td>,
  hr: () => <hr className="border-surface-border my-5" />,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  strong: ({children}: any) => <strong className="font-semibold text-white">{children}</strong>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  em: ({children}: any) => <em className="italic text-gray-300 not-italic">{children}</em>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  del: ({children}: any) => <del className="line-through text-text-subtle">{children}</del>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  section: ({children, ...props}: any) => {
    if ('data-footnotes' in props) {
      return (
        <section className="mt-6 pt-4 border-t border-surface-border" {...props}>
          <h2 className="text-xs font-bold text-text-subtle uppercase tracking-wider mb-3">Footnotes</h2>
          {children}
        </section>
      );
    }
    return <section {...props}>{children}</section>;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sup: ({children, ...props}: any) => <sup className="text-primary hover:text-primary-hover font-medium" {...props}>{children}</sup>,
  code: CodeBlock
};
export default function WorldToolsClient() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  interface ScriptTab { id: string; name: string; code: string; modified?: boolean; }
  const TABS_KEY = 'bloxdforge_script_tabs';
  const STARTER_CODE = "api.sendMessage(myId, 'Hello from BloxdForge');\n";
  const [tabs, setTabs] = useState<ScriptTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const tabsRef = useRef<ScriptTab[]>([]);
  tabsRef.current = tabs;
  const [renamingTabId, setRenamingTabId] = useState<string | null>(null);
  const code = useMemo(() => tabs.find(t => t.id === activeTabId)?.code ?? "", [tabs, activeTabId]);
  const setCode = useCallback((newCode: string, opts?: { notifyInactive?: boolean }) => {
    setTabs(prev => prev.map(t => {
      if (t.id !== activeTabId) return t;
      const modified = opts?.notifyInactive ? t.modified : false;
      return { ...t, code: newCode, modified };
    }));
  }, [activeTabId]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TABS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          const valid = parsed.filter((t: ScriptTab) => t && typeof t.id === 'string' && typeof t.name === 'string' && typeof t.code === 'string');
          if (valid.length) {
            setTabs(valid);
            setActiveTabId(valid[0].id);
            return;
          }
        }
      }
    } catch {}
    const legacy = localStorage.getItem("bloxdforge_current_script");
    const firstTab: ScriptTab = { id: 'tab-1', name: 'Script 1', code: legacy || STARTER_CODE };
    setTabs([firstTab]);
    setActiveTabId(firstTab.id);
  }, []);
  useEffect(() => {
    if (tabs.length) {
      try { localStorage.setItem(TABS_KEY, JSON.stringify(tabs)); } catch {}
    }
  }, [tabs]);
  const createTab = useCallback((customName?: string, content?: string) => {
    const currentTabs = tabsRef.current;
    const baseNum = currentTabs.length + 1;
    const candidates = new Set(currentTabs.map(t => t.name));
    let name = `Script ${baseNum}`;
    let n = baseNum + 1;
    while (candidates.has(name)) { name = `Script ${n}`; n += 1; }
    const newTab: ScriptTab = {
      id: `tab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: customName?.trim() || name,
      code: content ?? STARTER_CODE,
    };
    tabsRef.current = [...currentTabs, newTab];
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    return newTab;
  }, []);
  const createNewTab = useCallback(() => {
    createTab();
  }, [createTab]);
  const closeTab = useCallback((id: string) => {
    setTabs(prev => {
      const idx = prev.findIndex(t => t.id === id);
      if (idx === -1) return prev;
      const next = prev.filter(t => t.id !== id);
      if (!next.length) {
        const blank: ScriptTab = { id: `tab-${Date.now()}`, name: 'Script 1', code: STARTER_CODE };
        setActiveTabId(blank.id);
        return [blank];
      }
      if (activeTabId === id) {
        setActiveTabId(next[Math.min(idx, next.length - 1)].id);
      }
      return next;
    });
  }, [activeTabId]);
  const renameTab = useCallback((id: string, name: string) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, name: name.trim() || t.name } : t));
  }, []);
  const handleRenameTabPrompt = useCallback((id: string) => {
    setRenamingTabId(id);
  }, []);
  const markTabModified = useCallback((id: string) => {
    setTabs(prev => prev.map(t => t.id === id && t.id !== activeTabId ? { ...t, modified: true } : t));
  }, [activeTabId]);
  const updateTabCode = useCallback((id: string, newCode: string) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, code: newCode } : t));
  }, []);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
  const [customModels, setCustomModels] = useState<CustomAiModel[]>([]);
  const [hasCustomKey, setHasCustomKey] = useState(false);
  useEffect(() => {
    const refresh = () => {
      setCustomModels(loadCustomModels());
      try {
        setHasCustomKey(Boolean(localStorage.getItem("bloxdforge_nvidia_key")?.trim()));
      } catch {
        setHasCustomKey(false);
      }
    };
    refresh();
    const onCustom = () => setCustomModels(loadCustomModels());
    const onStorage = (e: StorageEvent) => {
      if (e.key === CUSTOM_MODELS_KEY || e.key === null) setCustomModels(loadCustomModels());
      if (e.key === "bloxdforge_nvidia_key" || e.key === null) {
        try {
          setHasCustomKey(Boolean(localStorage.getItem("bloxdforge_nvidia_key")?.trim()));
        } catch {
          setHasCustomKey(false);
        }
      }
    };
    window.addEventListener(CUSTOM_MODELS_EVENT, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CUSTOM_MODELS_EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  const availableCustomModels = useMemo(() => (hasCustomKey ? customModels.filter(m => !(AI_MODELS as readonly { id: string }[]).some(b => b.id === m.id)) : []), [hasCustomKey, customModels]);
  const customVisionIds = useMemo(() => new Set(availableCustomModels.filter(m => m.vision).map(m => m.id)), [availableCustomModels]);
  const hasVision = useCallback((modelId: string) => VISION_MODELS.has(modelId) || customVisionIds.has(modelId), [customVisionIds]);
  const allChatModels = useMemo(() => [...AI_MODELS, ...availableCustomModels], [availableCustomModels]);
  const getChatModelLabel = useCallback((modelId: string) => {
    const builtIn = AI_MODELS.find(m => m.id === modelId);
    if (builtIn) return `BloxdForge ${builtIn.name}`;
    const custom = availableCustomModels.find(m => m.id === modelId);
    if (custom) return custom.name;
    return "AI";
  }, [availableCustomModels]);
  useEffect(() => {
    if (!hasCustomKey && customModels.length === 0) return;
    setSelectedModel(prev => {
      if ((AI_MODELS as readonly { id: string }[]).some(m => m.id === prev)) return prev;
      if (hasCustomKey && availableCustomModels.some(m => m.id === prev)) return prev;
      return DEFAULT_MODEL;
    });
  }, [hasCustomKey, availableCustomModels, customModels.length]);
  const [attachments, setAttachments] = useState<{ id: string; dataUrl: string; name: string }[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isImageDragActive, setIsImageDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleAttachFiles = useCallback(async (files: FileList | File[] | null) => {
    const imageFiles = getImageFiles(files);
    if (!imageFiles.length) return;
    if (!hasVision(selectedModel)) {
      toast.error("Select a vision-capable model to attach images.");
      return;
    }
    const next: { id: string; dataUrl: string; name: string }[] = [];
    for (const file of imageFiles) {
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('read error'));
          reader.readAsDataURL(file);
        });
        next.push({
          id: `${file.name || 'image'}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          dataUrl,
          name: file.name || 'Pasted image',
        });
      } catch {
        toast.error(`Could not read ${file.name || 'the image'}.`);
      }
    }
    if (next.length) setAttachments(prev => [...prev, ...next].slice(-4));
  }, [selectedModel, hasVision]);
  const handleComposerPaste = useCallback((event: ReactClipboardEvent<HTMLTextAreaElement>) => {
    const imageFiles = getImageFilesFromTransfer(event.clipboardData);
    if (!imageFiles.length) return;
    event.preventDefault();
    void handleAttachFiles(imageFiles);
  }, [handleAttachFiles]);
  const handleChatDragEnter = useCallback((event: ReactDragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes('Files')) return;
    event.preventDefault();
    if (hasVision(selectedModel) && transferHasImage(event.dataTransfer)) {
      setIsImageDragActive(true);
    }
  }, [selectedModel, hasVision]);
  const handleChatDragOver = useCallback((event: ReactDragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes('Files')) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = hasVision(selectedModel) ? 'copy' : 'none';
  }, [selectedModel, hasVision]);
  const handleChatDragLeave = useCallback((event: ReactDragEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setIsImageDragActive(false);
  }, []);
  const handleChatDrop = useCallback((event: ReactDragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes('Files')) return;
    event.preventDefault();
    setIsImageDragActive(false);
    void handleAttachFiles(getImageFilesFromTransfer(event.dataTransfer));
  }, [handleAttachFiles]);
  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  }, []);
  const [wikiData, setWikiData] = useState<WikiItem[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProblemsOpen, setIsProblemsOpen] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [mobileFilter, setMobileFilter] = useState<'all' | 'wiki' | 'doc'>('all');
  const [mobileSelectedItem, setMobileSelectedItem] = useState<CombinedItem | null>(null);
  const editorRef = useRef<MonacoEditor | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [turnstileWidgetKey, setTurnstileWidgetKey] = useState(0);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [toneMenuOpen, setToneMenuOpen] = useState(false);
  const [selectedTone, setSelectedTone] = useState<AiToneId>("default");
  const [retryDropdownOpenId, setRetryDropdownOpenId] = useState<number | null>(null);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSubmittedInputRef = useRef<string>("");
  const pendingCaptchaRetryRef = useRef<string | null>(null);
  const editorDidMountDisposables = useRef<{ dispose: () => void }[]>([]);
  const lintErrors = useBloxdLinter(code);
  const {
    sessions,
    sessionOrder,
    activeSession,
    activeSessionId,
    createNewSession,
    deleteSession,
    switchSession,
    updateSessionMessages,
    saveSessionTabs,
  } = useChatSessions();
  const { editorFontFamily } = useSettingsStore();
  const handleChatComplete = useCallback((finalMessages: Message[]) => {
    if (activeSessionId) {
      updateSessionMessages(activeSessionId, finalMessages);
    }
  }, [activeSessionId, updateSessionMessages]);
  const handleChatError = useCallback((error: Error) => {
    if (error.message.includes("CAPTCHA") || error.message.includes("capcha")) {
      pendingCaptchaRetryRef.current = null;
      setTurnstileToken(null);
      setTurnstileWidgetKey(prev => prev + 1);
      setIsVerifying(true);
    }
  }, []);
  const { messages, latestUsage, setMessages, isLoading, activeTool, sendMessage, resubmitLast, stopGeneration } = useAiChat({
    model: selectedModel,
    tone: selectedTone,
    sessionId: activeSessionId || undefined,
    editorCode: code,
    wikiData: wikiData,
    initialMessages: activeSession?.messages || [],
    onCodeUpdate: setCode,
    onComplete: handleChatComplete,
    onError: handleChatError,
    tabs: {
      list: tabs,
      activeId: activeTabId,
      getCode: (id) => tabs.find(t => t.id === id)?.code ?? "",
      updateCode: updateTabCode,
      markModified: markTabModified,
      create: createTab,
    },
  });
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.retry-dropdown-container')) {
        setRetryDropdownOpenId(null);
      }
      if (!(e.target as Element).closest('.model-dropdown-container')) {
        setModelMenuOpen(false);
      }
      if (!(e.target as Element).closest('.tone-dropdown-container')) {
        setToneMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    if (activeSessionId && messages.length > 0) {
      const handler = setTimeout(() => {
        updateSessionMessages(activeSessionId, messages);
      }, 1000);
      return () => clearTimeout(handler);
    }
  }, [messages, activeSessionId, updateSessionMessages]);
  useEffect(() => {
    if (activeSessionId && tabs.length > 0) {
      const handler = setTimeout(() => {
        saveSessionTabs(activeSessionId, tabs, activeTabId);
      }, 1000);
      return () => clearTimeout(handler);
    }
  }, [tabs, activeTabId, activeSessionId, saveSessionTabs]);
  const handleCreateNewSession = () => {
    if (activeSessionId && tabs.length > 0) {
      saveSessionTabs(activeSessionId, tabs, activeTabId);
    }
    createNewSession();
    if (setMessages) setMessages([]);
    setShowHistory(false);
  };
  const handleSwitchSession = (id: string) => {
    if (id === activeSessionId) {
      setShowHistory(false);
      return;
    }
    if (activeSessionId && tabs.length > 0) {
      saveSessionTabs(activeSessionId, tabs, activeTabId);
    }
    switchSession(id);
    const session = sessions[id];
    if (session && setMessages) {
      setMessages(session.messages);
    }
    if (session?.tabs && session.tabs.length > 0) {
      const restored = session.tabs.filter(t => t && typeof t.id === 'string' && typeof t.name === 'string' && typeof t.code === 'string');
      if (restored.length > 0) {
        setTabs(restored.map(t => ({ ...t })));
        const nextActive = session.activeTabId && restored.some(t => t.id === session.activeTabId)
          ? session.activeTabId
          : restored[0].id;
        setActiveTabId(nextActive);
        toast.success(`Restored code from "${session.name}" (${restored.length} tab${restored.length === 1 ? '' : 's'})`);
      }
    }
    setShowHistory(false);
  };
  const jumpToError = (error: LintError) => {
    if (editorRef.current) {
      editorRef.current.revealLineInCenter(error.line);
      editorRef.current.setPosition({ lineNumber: error.line, column: error.column });
      editorRef.current.focus();
    }
  };
  useEffect(() => {
    fetchSecureData<WikiItem[]>('wiki').then(setWikiData).catch(console.error);
  }, []);
  useEffect(() => {
    if (isChatOpen && !showHistory) {
      const chatContainer = chatContainerRef.current;
      if (chatContainer) {
        const scrollThreshold = 100;
        const isNearBottom = chatContainer.scrollHeight - chatContainer.clientHeight - chatContainer.scrollTop < scrollThreshold;
        if (isNearBottom) {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    if (editorRef.current) {
        setTimeout(() => editorRef.current?.layout(), 300);
    }
  }, [messages, activeTool, isChatOpen, showHistory]);
  useEffect(() => {
    if (isMobile) setIsChatOpen(false);
  }, [isMobile]);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(mobileSearchQuery), 300);
    return () => clearTimeout(handler);
  }, [mobileSearchQuery]);
  useEffect(() => {
    return () => {
       // eslint-disable-next-line react-hooks/exhaustive-deps
       editorDidMountDisposables.current.forEach(d => d.dispose());
    };
  }, []);
  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor as unknown as MonacoEditor;
    monacoInstance.editor.defineTheme('bloxd-dark', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#141313' } });
    monacoInstance.editor.setTheme('bloxd-dark');
    const completionProvider = monacoInstance.languages.registerCompletionItemProvider('javascript', {
        triggerCharacters: ["'", '"', '.'],
        provideCompletionItems: (model, position) => {
            const lineUntilPosition = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            });
            const word = model.getWordUntilPosition(position);
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn
            };
            const suggestions: monaco.languages.CompletionItem[] = [];
            const addSuggestions = (list: Set<string> | string[], kind: monaco.languages.CompletionItemKind) => {
                Array.from(list).forEach(item => {
                    suggestions.push({
                        label: item,
                        kind: kind,
                        insertText: item,
                        range: range
                    });
                });
            };
            const propertyMatch = lineUntilPosition.match(/([a-zA-Z0-9_]+)\s*:\s*["']([^"']*)$/);
            if (propertyMatch) {
                const propName = propertyMatch[1];
                if (propName === 'texture') addSuggestions(VALID_PARTICLES, monacoInstance.languages.CompletionItemKind.EnumMember);
                if (propName === 'presetId') addSuggestions(VALID_PARTICLE_PRESETS, monacoInstance.languages.CompletionItemKind.EnumMember);
                if (propName === 'music') addSuggestions(VALID_MUSIC, monacoInstance.languages.CompletionItemKind.Value);
                if (propName === 'pose') addSuggestions(VALID_POSES, monacoInstance.languages.CompletionItemKind.Value);
                if (propName === 'icon') addSuggestions(VALID_ICONS, monacoInstance.languages.CompletionItemKind.Value);
                if (propName === 'type') {
                    if (lineUntilPosition.includes('addQTE')) {
                         addSuggestions(VALID_QTE_TYPES, monacoInstance.languages.CompletionItemKind.EnumMember);
                    }
                }
                return { suggestions };
            }
            const methodMatch = lineUntilPosition.match(/api\.([a-zA-Z0-9_]+)\s*\((.*)$/);
            if (methodMatch) {
                const methodName = methodMatch[1];
                const argsStr = methodMatch[2];
                let argIndex = 0;
                let inString = false;
                let stringChar = '';
                let depth = 0;
                for (let i = 0; i < argsStr.length; i++) {
                    const c = argsStr[i];
                    if (inString) {
                        if (c === stringChar && argsStr[i-1] !== '\\') inString = false;
                    } else {
                        if (c === '"' || c === "'" || c === '`') { inString = true; stringChar = c; }
                        else if (c === '(' || c === '[' || c === '{') depth++;
                        else if (c === ')' || c === ']' || c === '}') depth--;
                        else if (c === ',' && depth === 0) argIndex++;
                    }
                }
                if (inString) {
                    let listToSuggest: Set<string> | string[] | null = null;
                    if (['setClientOption', 'getClientOption', 'setClientOptionToDefault'].includes(methodName)) {
                        if (argIndex === 1) listToSuggest = VALID_CLIENT_OPTIONS;
                        else if (argIndex === 2 && argsStr.includes('skyBox')) listToSuggest = ['default'];
                        else if (argIndex === 2 && argsStr.includes('music')) listToSuggest = VALID_MUSIC;
                    }
                    else if (['setMobSetting', 'getMobSetting'].includes(methodName) && argIndex === 1) listToSuggest = VALID_MOB_SETTINGS;
                    else if (methodName === 'setDefaultMobSetting' && argIndex === 1) listToSuggest = VALID_MOB_SETTINGS;
                    else if (['setOtherEntitySetting', 'getOtherEntitySetting'].includes(methodName) && argIndex === 2) listToSuggest = VALID_ENTITY_SETTINGS;
                    else if (['setTargetedPlayerSettingForEveryone', 'setEveryoneSettingForPlayer'].includes(methodName) && argIndex === 1) listToSuggest = VALID_ENTITY_SETTINGS;
                    else if (['setOtherEntitySetting', 'getOtherEntitySetting', 'setTargetedPlayerSettingForEveryone', 'setEveryoneSettingForPlayer'].includes(methodName) && argsStr.includes('nameColour')) listToSuggest = VALID_NAME_COLOURS;
                    else if (['playSound', 'playClientPredictedSound'].includes(methodName) && argIndex === 1) listToSuggest = VALID_SOUNDS;
                    else if (methodName === 'broadcastSound' && argIndex === 0) listToSuggest = VALID_SOUNDS;
                    else if (methodName === 'on' && argIndex === 0) listToSuggest = VALID_CALLBACKS;
                    else if (['applyEffect', 'removeEffect'].includes(methodName) && argIndex === 1) listToSuggest = VALID_EFFECTS;
                    else if (methodName === 'setPlayerPose' && argIndex === 1) listToSuggest = VALID_POSES;
                    else if (methodName === 'changePlayerIntoSkin') {
                        if (argIndex === 1) listToSuggest = VALID_SKIN_PARTS;
                    }
                    else if (methodName === 'setMobAiState' && argIndex === 1) listToSuggest = VALID_AI_STATES;
                    else if (methodName === 'attemptCreateMeshEntity' && argIndex === 0) listToSuggest = VALID_MESH_TYPES;
                    else if (methodName === 'updateMeshEntity' && argIndex === 1) listToSuggest = VALID_MESH_TYPES;
                    else if (methodName === 'updateEntityNodeMeshAttachment') {
                        if (argIndex === 1) listToSuggest = VALID_ENTITY_NODES;
                        if (argIndex === 2) listToSuggest = VALID_MESH_TYPES;
                    }
                    if (listToSuggest) {
                        addSuggestions(listToSuggest, monacoInstance.languages.CompletionItemKind.Value);
                        return { suggestions };
                    }
                }
            }
            const apiMatch = lineUntilPosition.match(/api\.([a-zA-Z0-9_]*)$/);
            if (apiMatch) {
                Object.entries(API_METHODS).forEach(([methodName, [min, max]]) => {
                    suggestions.push({
                        label: methodName,
                        kind: monacoInstance.languages.CompletionItemKind.Method,
                        insertText: methodName,
                        detail: `Bloxd API Method (${min === max ? min : min + '-' + max} args)`,
                        range: range
                    });
                });
                return { suggestions };
            }
            return { suggestions };
        }
    });
    editorDidMountDisposables.current.push(completionProvider);
    const signatureHelpProvider = monacoInstance.languages.registerSignatureHelpProvider('javascript', {
        signatureHelpTriggerCharacters: ['(', ','],
        provideSignatureHelp: (model, position) => {
            const lineUntilPosition = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            });
            const methodMatch = lineUntilPosition.match(/api\.([a-zA-Z0-9_]+)\s*\((.*)$/);
            if (methodMatch) {
                const methodName = methodMatch[1];
                const argsStr = methodMatch[2];
                let argIndex = 0;
                let inString = false;
                let stringChar = '';
                let depth = 0;
                for (let i = 0; i < argsStr.length; i++) {
                    const c = argsStr[i];
                    if (inString) {
                        if (c === stringChar && argsStr[i-1] !== '\\') inString = false;
                    } else {
                        if (c === '"' || c === "'" || c === '`') { inString = true; stringChar = c; }
                        else if (c === '(' || c === '[' || c === '{') depth++;
                        else if (c === ')' || c === ']' || c === '}') depth--;
                        else if (c === ',' && depth === 0) argIndex++;
                    }
                }
                const signatureMap: Record<string, { label: string, parameters: { label: string, documentation?: string }[] }> = {
                    'setClientOption': {
                        label: 'setClientOption(playerId: PlayerId, option: PassedOption, value: ClientOptions[PassedOption])',
                        parameters: [
                            { label: 'playerId: PlayerId', documentation: 'The ID of the player' },
                            { label: 'option: PassedOption', documentation: 'The name of the client option' },
                            { label: 'value: ClientOptions[PassedOption]', documentation: 'The value to set' }
                        ]
                    },
                    'attemptCreateMeshEntity': {
                        label: 'attemptCreateMeshEntity(type: MeshType, opts: MeshEntityOpts[MeshType], name?: string, physicsOptions?: MeshEntityPhysicsOpts, initiatorId?: EntityId)',
                        parameters: [
                            { label: 'type: MeshType' },
                            { label: 'opts: MeshEntityOpts[MeshType]' },
                            { label: 'name?: string' },
                            { label: 'physicsOptions?: MeshEntityPhysicsOpts' },
                            { label: 'initiatorId?: EntityId' }
                        ]
                    },
                    'setBlock': {
                        label: 'setBlock(x: number | number[], y?: number | BlockName, z?: number, blockName?: BlockName)',
                        parameters: [
                            { label: 'x: number | number[]' },
                            { label: 'y?: number | BlockName' },
                            { label: 'z?: number' },
                            { label: 'blockName?: BlockName' }
                        ]
                    },
                    'giveItem': {
                        label: 'giveItem(playerId: PlayerId, itemName: ItemName, itemAmount?: number, attributes?: ItemAttributes)',
                        parameters: [
                            { label: 'playerId: PlayerId' },
                            { label: 'itemName: ItemName' },
                            { label: 'itemAmount?: number' },
                            { label: 'attributes?: ItemAttributes' }
                        ]
                    },
                    'playSound': {
                        label: 'playSound(playerId: PlayerId, soundName: string, volume: number, rate: number, posSettings?: any)',
                        parameters: [
                            { label: 'playerId: PlayerId' },
                            { label: 'soundName: string' },
                            { label: 'volume: number' },
                            { label: 'rate: number' },
                            { label: 'posSettings?: any' }
                        ]
                    },
                    'sendMessage': {
                        label: 'sendMessage(playerId: PlayerId, message: string | CustomTextStyling, style?: { fontWeight?: number | string; color?: string })',
                        parameters: [
                            { label: 'playerId: PlayerId' },
                            { label: 'message: string | CustomTextStyling' },
                            { label: 'style?: { fontWeight?: number | string; color?: string }' }
                        ]
                    },
                    'applyEffect': {
                        label: 'applyEffect(lifeformId: LifeformId, effectName: string, duration: number | null, customEffectInfo?: any)',
                        parameters: [
                            { label: 'lifeformId: LifeformId' },
                            { label: 'effectName: string' },
                            { label: 'duration: number | null' },
                            { label: 'customEffectInfo?: any' }
                        ]
                    },
                    'broadcastMessage': {
                        label: 'broadcastMessage(message: string | CustomTextStyling, style?: { fontWeight?: number | string; color?: string; colour?: string })',
                        parameters: [
                            { label: 'message: string | CustomTextStyling' },
                            { label: 'style?: { fontWeight?: number | string; color?: string; colour?: string }' }
                        ]
                    },
                    'getPosition': {
                        label: 'getPosition(entityId: EntityId): [number, number, number]',
                        parameters: [{ label: 'entityId: EntityId' }]
                    },
                    'setPosition': {
                        label: 'setPosition(entityId: EntityId, x: number | number[], y?: number, z?: number)',
                        parameters: [
                            { label: 'entityId: EntityId' },
                            { label: 'x: number | number[]', documentation: 'Can also be [x, y, z] array; omit y and z if so' },
                            { label: 'y?: number' },
                            { label: 'z?: number' }
                        ]
                    },
                    'getHealth': {
                        label: 'getHealth(entityId: EntityId): number',
                        parameters: [{ label: 'entityId: EntityId' }]
                    },
                    'setHealth': {
                        label: 'setHealth(entityId: EntityId, newHealth: number | null, whoDidDamage?: LifeformId, increaseMaxHealthIfNeeded?: boolean)',
                        parameters: [
                            { label: 'entityId: EntityId' },
                            { label: 'newHealth: number | null', documentation: 'Pass null to remove health entirely' },
                            { label: 'whoDidDamage?: LifeformId' },
                            { label: 'increaseMaxHealthIfNeeded?: boolean' }
                        ]
                    },
                    'forceRespawn': {
                        label: 'forceRespawn(playerId: PlayerId, respawnPos?: number[])',
                        parameters: [
                            { label: 'playerId: PlayerId' },
                            { label: 'respawnPos?: number[]', documentation: 'Defaults to [0,0,0]' }
                        ]
                    },
                    'killLifeform': {
                        label: 'killLifeform(lifeformId: LifeformId, whoKilled?: LifeformId | { lifeformId: LifeformId; withItem: string })',
                        parameters: [
                            { label: 'lifeformId: LifeformId' },
                            { label: 'whoKilled?: LifeformId' }
                        ]
                    },
                    'applyImpulse': {
                        label: 'applyImpulse(eId: EntityId, xImpulse: number, yImpulse: number, zImpulse: number)',
                        parameters: [
                            { label: 'eId: EntityId' },
                            { label: 'xImpulse: number' },
                            { label: 'yImpulse: number' },
                            { label: 'zImpulse: number' }
                        ]
                    },
                    'setVelocity': {
                        label: 'setVelocity(eId: EntityId, x: number, y: number, z: number)',
                        parameters: [
                            { label: 'eId: EntityId' },
                            { label: 'x: number' },
                            { label: 'y: number' },
                            { label: 'z: number' }
                        ]
                    },
                    'broadcastSound': {
                        label: 'broadcastSound(soundName: string, volume: number, rate: number, posSettings?: { playerIdOrPos: PlayerId | number[]; maxHearDist?: number; refDistance?: number }, exceptPlayerId?: PlayerId)',
                        parameters: [
                            { label: 'soundName: string', documentation: 'Remove number suffix for random variant (e.g. "grass" plays a random grass sound)' },
                            { label: 'volume: number', documentation: '0.0 – 1.0' },
                            { label: 'rate: number', documentation: 'Playback rate 0.5–4; also affects pitch' },
                            { label: 'posSettings?: any' },
                            { label: 'exceptPlayerId?: PlayerId' }
                        ]
                    },
                    'setMobSetting': {
                        label: 'setMobSetting(mobId: MobId, setting: MobSetting, value: any)',
                        parameters: [
                            { label: 'mobId: MobId' },
                            { label: 'setting: MobSetting' },
                            { label: 'value: any' }
                        ]
                    },
                    'getMobSetting': {
                        label: 'getMobSetting(mobId: MobId, setting: MobSetting, returnDefaultIfNotOverridden?: boolean)',
                        parameters: [
                            { label: 'mobId: MobId' },
                            { label: 'setting: MobSetting' },
                            { label: 'returnDefaultIfNotOverridden?: boolean' }
                        ]
                    },
                    'setDefaultMobSetting': {
                        label: 'setDefaultMobSetting(mobType: MobType, setting: MobSetting, value: any)',
                        parameters: [
                            { label: 'mobType: MobType' },
                            { label: 'setting: MobSetting' },
                            { label: 'value: any' }
                        ]
                    },
                    'setMobAiState': {
                        label: 'setMobAiState(mobId: MobId, state: MobAiState, params: MobAiStateParams)',
                        parameters: [
                            { label: 'mobId: MobId' },
                            { label: 'state: MobAiState', documentation: 'idle | disabled | idleBeforeTurning | turning | idleBeforeWalking | walking | runningAway | chasing | following | watching | walkingToPosition | runningToPosition' },
                            { label: 'params: MobAiStateParams', documentation: 'null for most states. { targetId } for runningAway/chasing/following/watching. { pos } for walkingToPosition/runningToPosition' }
                        ]
                    },
                    'attemptSpawnMob': {
                        label: 'attemptSpawnMob(mobType: MobType, x: number, y: number, z: number, opts?: MobSpawnOpts): MobId | null',
                        parameters: [
                            { label: 'mobType: MobType' },
                            { label: 'x: number' },
                            { label: 'y: number' },
                            { label: 'z: number' },
                            { label: 'opts?: MobSpawnOpts', documentation: '{ mobHerdId?, spawnerId?, mobDbId?, name?, playSoundOnSpawn?, variation?, physicsOpts? }' }
                        ]
                    },
                    'setOtherEntitySetting': {
                        label: 'setOtherEntitySetting(relevantPlayerId: PlayerId, targetedEntityId: EntityId, settingName: Setting, settingValue: any)',
                        parameters: [
                            { label: 'relevantPlayerId: PlayerId' },
                            { label: 'targetedEntityId: EntityId' },
                            { label: 'settingName: Setting' },
                            { label: 'settingValue: any' }
                        ]
                    },
                    'setTargetedPlayerSettingForEveryone': {
                        label: 'setTargetedPlayerSettingForEveryone(targetedPlayerId: PlayerId, settingName: Setting, settingValue: any, includeNewJoiners?: boolean)',
                        parameters: [
                            { label: 'targetedPlayerId: PlayerId' },
                            { label: 'settingName: Setting' },
                            { label: 'settingValue: any' },
                            { label: 'includeNewJoiners?: boolean' }
                        ]
                    },
                    'setEveryoneSettingForPlayer': {
                        label: 'setEveryoneSettingForPlayer(playerId: PlayerId, settingName: Setting, settingValue: any, includeNewJoiners?: boolean)',
                        parameters: [
                            { label: 'playerId: PlayerId' },
                            { label: 'settingName: Setting' },
                            { label: 'settingValue: any' },
                            { label: 'includeNewJoiners?: boolean' }
                        ]
                    },
                    'setPlayerPose': {
                        label: 'setPlayerPose(playerId: PlayerId, pose: PlayerPose, poseOffset?: [number, number, number])',
                        parameters: [
                            { label: 'playerId: PlayerId' },
                            { label: 'pose: PlayerPose', documentation: 'standing | sitting | zombie | gliding | driving | sleeping | riding' },
                            { label: 'poseOffset?: [number, number, number]' }
                        ]
                    },
                    'changePlayerIntoSkin': {
                        label: 'changePlayerIntoSkin(playerId: PlayerId, cosmeticType: CosmeticType, cosmeticName: CosmeticName)',
                        parameters: [
                            { label: 'playerId: PlayerId' },
                            { label: 'cosmeticType: CosmeticType', documentation: 'hat | head | body | legs | shoes | eyebrows | eyes | skin' },
                            { label: 'cosmeticName: CosmeticName' }
                        ]
                    },
                    'updateEntityNodeMeshAttachment': {
                        label: 'updateEntityNodeMeshAttachment(eId: EntityId, node: EntityNamedNode, type: MeshType | null, opts?: MeshEntityOpts, offset?: [number, number, number], rotation?: [number, number, number])',
                        parameters: [
                            { label: 'eId: EntityId' },
                            { label: 'node: EntityNamedNode', documentation: 'TorsoNode | HeadMesh | ArmRightMesh | ArmLeftMesh | LegLeftMesh | LegRightMesh' },
                            { label: 'type: MeshType | null', documentation: 'Box | BloxdBlock | Person | ParticleEmitter. Pass null to detach.' },
                            { label: 'opts?: MeshEntityOpts' },
                            { label: 'offset?: [number, number, number]' },
                            { label: 'rotation?: [number, number, number]' }
                        ]
                    },
                    'attemptCreateThrowable': {
                        label: 'attemptCreateThrowable(throwerEId: EntityId, itemName: ThrowableItem, position: [number,number,number], direction: [number,number,number], velocityMult?: number, damageMult?: number, gravityMult?: number, attributes?: ItemAttributes): string | null',
                        parameters: [
                            { label: 'throwerEId: EntityId' },
                            { label: 'itemName: ThrowableItem' },
                            { label: 'position: [number, number, number]' },
                            { label: 'direction: [number, number, number]' },
                            { label: 'velocityMult?: number' },
                            { label: 'damageMult?: number' },
                            { label: 'gravityMult?: number' },
                            { label: 'attributes?: ItemAttributes' }
                        ]
                    },
                    'addQTE': {
                        label: 'addQTE(playerId: PlayerId, qteParameters: QTEClientParameters): QTERequestId',
                        parameters: [
                            { label: 'playerId: PlayerId' },
                            { label: 'qteParameters: QTEClientParameters', documentation: '{ type: "progressBar" | "timedClick" | "gravityBar" | "precisionBar" | "rhythmClick", parameters: { ... } }' }
                        ]
                    },
                    'animateEntity': {
                        label: 'animateEntity(entityId: EntityId, animationSchema: AnimationSchema | BlockbenchAnimationSchema | null, initialTimeFraction?: number, animationSpeed?: number)',
                        parameters: [
                            { label: 'entityId: EntityId' },
                            { label: 'animationSchema: AnimationSchema | BlockbenchAnimationSchema | null', documentation: 'Pass null to stop the current animation' },
                            { label: 'initialTimeFraction?: number' },
                            { label: 'animationSpeed?: number' }
                        ]
                    },
                    'matchmakePlayer': {
                        label: 'matchmakePlayer(playerId: PlayerId, game?: string, lobbyName?: string)',
                        parameters: [
                            { label: 'playerId: PlayerId' },
                            { label: 'game?: string', documentation: 'Game to join. Defaults to current game. Format: gamename_variation' },
                            { label: 'lobbyName?: string', documentation: 'Defaults to "Quick Play"' }
                        ]
                    },
                    'setLobbyDbValue': {
                        label: 'setLobbyDbValue(key: string, value: string | number)',
                        parameters: [
                            { label: 'key: string' },
                            { label: 'value: string | number' }
                        ]
                    },
                    'setPlayerDbValue': {
                        label: 'setPlayerDbValue(playerId: PlayerId, key: string, value: string | number)',
                        parameters: [
                            { label: 'playerId: PlayerId' },
                            { label: 'key: string' },
                            { label: 'value: string | number' }
                        ]
                    },
                    'addCustomKillfeedMessage': {
                        label: 'addCustomKillfeedMessage(killer: Killer, victim: Victim, withItem: string)',
                        parameters: [
                            { label: 'killer: { eId: EntityId } | { name: string; colour: string }' },
                            { label: 'victim: { eId: EntityId } | { name: string; colour: string }' },
                            { label: 'withItem: string' }
                        ]
                    },
                    'copyChunk': {
                        label: 'copyChunk(fromPos: number[], toPos: number[])',
                        parameters: [
                            { label: 'fromPos: number[]', documentation: 'Block coordinate within source chunk' },
                            { label: 'toPos: number[]', documentation: 'Block coordinate within destination chunk' }
                        ]
                    },
                    'deleteAllItems': {
                        label: 'deleteAllItems()',
                        parameters: []
                    },
                    'removeItemNameFromStandardChest': {
                        label: 'removeItemNameFromStandardChest(chestPos: number[], itemName: ItemName, amount: number, playerId: PlayerId)',
                        parameters: [
                            { label: 'chestPos: number[]' },
                            { label: 'itemName: ItemName' },
                            { label: 'amount: number' },
                            { label: 'playerId: PlayerId', documentation: 'Player interacting with the chest' }
                        ]
                    },
                    'resetCanPickUpItem': {
                        label: 'resetCanPickUpItem(playerId: PlayerId, itemId: EntityId)',
                        parameters: [
                            { label: 'playerId: PlayerId' },
                            { label: 'itemId: EntityId' }
                        ]
                    },
                    'hasEffect': {
                        label: 'hasEffect(lifeformId: LifeformId, name: string, atOrAboveLevel: number): boolean',
                        parameters: [
                            { label: 'lifeformId: LifeformId' },
                            { label: 'name: string', documentation: 'Name of the effect' },
                            { label: 'atOrAboveLevel: number' }
                        ]
                    },
                    'getEffectLevel': {
                        label: 'getEffectLevel(lifeformId: LifeformId, name: string): number',
                        parameters: [
                            { label: 'lifeformId: LifeformId' },
                            { label: 'name: string', documentation: 'Name of the effect' }
                        ]
                    },
                    'getItemDropName': {
                        label: 'getItemDropName(itemEId: EntityId): ItemName | null',
                        parameters: [
                            { label: 'itemEId: EntityId', documentation: 'ID of the dropped item' }
                        ]
                    },
                    'getItemIDsOverlappingWithPlayer': {
                        label: 'getItemIDsOverlappingWithPlayer(playerId: PlayerId): EntityId[]',
                        parameters: [
                            { label: 'playerId: PlayerId' }
                        ]
                    },
                    'findItem': {
                        label: 'findItem(playerId: PlayerId, itemName: ItemName): number | null',
                        parameters: [
                            { label: 'playerId: PlayerId' },
                            { label: 'itemName: ItemName' }
                        ]
                    },
                    'findStandardChestItem': {
                        label: 'findStandardChestItem(chestPos: number[], itemName: ItemName): number | null',
                        parameters: [
                            { label: 'chestPos: number[]' },
                            { label: 'itemName: ItemName' }
                        ]
                    },
                    'passifyHostility': {
                        label: 'passifyHostility(mobId: MobId, targetLifeformId: LifeformId)',
                        parameters: [
                            { label: 'mobId: MobId' },
                            { label: 'targetLifeformId: LifeformId' }
                        ]
                    },
                    'preventFallDamageNextGrounding': {
                        label: 'preventFallDamageNextGrounding(playerId: PlayerId)',
                        parameters: [
                            { label: 'playerId: PlayerId' }
                        ]
                    },
                    'resetCanChangeBlock': {
                        label: 'resetCanChangeBlock(playerId: PlayerId, x: number, y: number, z: number)',
                        parameters: [
                            { label: 'playerId: PlayerId' },
                            { label: 'x: number' },
                            { label: 'y: number' },
                            { label: 'z: number' }
                        ]
                    },
                    'updateMeshParticleSystems': {
                        label: 'updateMeshParticleSystems(updates: MeshParticleSystemUpdates)',
                        parameters: [
                            { label: 'updates: MeshParticleSystemUpdates' }
                        ]
                    },
                    'setOtherEntitySettingToDefault': {
                        label: 'setOtherEntitySettingToDefault(relevantPlayerId: PlayerId, targetedEntityId: EntityId, settingName: Setting)',
                        parameters: [
                            { label: 'relevantPlayerId: PlayerId' },
                            { label: 'targetedEntityId: EntityId' },
                            { label: 'settingName: Setting' }
                        ]
                    },
                    'setPlayerPhysicsState': {
                        label: 'setPlayerPhysicsState(playerId: PlayerId, physicsState: PlayerPhysicsStateData, positionOffset?: [number, number, number])',
                        parameters: [
                            { label: 'playerId: PlayerId' },
                            { label: 'physicsState: PlayerPhysicsStateData' },
                            { label: 'positionOffset?: [number, number, number]', documentation: 'Optional position offset adjustment' }
                        ]
                    }
                };
                const sig = signatureMap[methodName];
                if (sig) {
                    return {
                        value: {
                            activeParameter: argIndex,
                            activeSignature: 0,
                            signatures: [
                                {
                                    label: sig.label,
                                    parameters: sig.parameters
                                }
                            ]
                        },
                        dispose: () => {}
                    };
                }
            }
            return {
                value: { activeParameter: 0, activeSignature: 0, signatures: [] },
                dispose: () => {}
            };
        }
    });
    editorDidMountDisposables.current.push(signatureHelpProvider);
  };
  const handleSendMessage = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;
    if (attachments.length > 0 && !hasVision(selectedModel)) {
      toast.error("Select a vision-capable model to send image attachments.");
      return;
    }
    const currentInput = input;
    lastSubmittedInputRef.current = currentInput;
    if (!activeSessionId) {
      createNewSession();
    }
    const imageParts = attachments.map(a => ({ type: 'image_url' as const, image_url: { url: a.dataUrl } }));
    setInput("");
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = '44px';
    await sendMessage(currentInput, turnstileToken || "", undefined, undefined, imageParts);
  };
  const handleTryAgain = async (overrideModelId?: string, msgIndex?: number) => {
    if (isLoading) stopGeneration();
    setRetryDropdownOpenId(null);
    const startIndex = msgIndex !== undefined ? msgIndex - 1 : messages.length - 1;
    let targetUserIndex = -1;
    for (let i = startIndex; i >= 0; i--) {
      if (messages[i].role === 'user') {
        targetUserIndex = i;
        break;
      }
    }
    if (targetUserIndex === -1) return;
    const targetMsg = messages[targetUserIndex];
    const prompt = messageContentToText(targetMsg.content);
    const imageParts = typeof targetMsg.content !== 'string'
      ? targetMsg.content.filter((p): p is { type: 'image_url'; image_url: { url: string } } => p.type === 'image_url')
      : [];
    const retryModel = overrideModelId || selectedModel;
    if (imageParts.length > 0 && !hasVision(retryModel)) {
      toast.error("Choose a vision-capable model to retry an image message.");
      return;
    }
    const newHistory = messages.slice(0, targetUserIndex);
    if (overrideModelId) setSelectedModel(overrideModelId);
    await sendMessage(prompt, turnstileToken || "", newHistory, overrideModelId, imageParts);
  };
  const handleEditPrompt = async (msgIndex: number, newContent: string) => {
    if (isLoading) stopGeneration();
    setEditingMessageIndex(null);
    const newHistory = messages.slice(0, msgIndex);
    await sendMessage(newContent, turnstileToken || "", newHistory);
  };
  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    if (textareaRef.current) textareaRef.current.focus();
  };
  const formatToolName = (toolName: string) => {
    return toolName
      .replace(/^get_/, '')
      .replace(/^search_/, 'search_')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const getToolSummary = (toolName: string, content: string) => {
    const normalized = content.trim();
    if (toolName === 'lint_code') {
      if (normalized === 'No linting errors found.') return 'Linting passed';
      const lintMatch = normalized.match(/^Found\s+(\d+)\s+linting errors?:/i);
      if (lintMatch) return `Linting: ${lintMatch[1]} problems found`;
    }
    if (normalized.startsWith('Success:')) return `Executed ${formatToolName(toolName)}`;
    if (normalized.startsWith('Error:')) return `Failed ${formatToolName(toolName)}`;
    return `Ran ${formatToolName(toolName)}`;
  };
  const contextUsage = useMemo(() => {
    const selectedModelData = allChatModels.find(m => m.id === selectedModel) || AI_MODELS[0];
    const contextLimit = selectedModelData.contextLimit;
    const estimateTextTokens = (text: string) => Math.ceil(text.length / 4);
    const pendingInputTokens = estimateTextTokens(input);
    const usageData = latestUsage as UsageData | null;
    const promptTokens = usageData?.prompt_tokens;
    const fallbackEstimatedTokens = Math.ceil((messages.reduce((total, message) => {
      const messageChars =
        (message.content || '').length +
        (message.reasoning || '').length +
        (message.name || '').length +
        (message.tool_call_id || '').length +
        (message.tool_calls || []).reduce((toolTotal, toolCall) => {
          return toolTotal + (toolCall.function.name || '').length + (toolCall.function.arguments || '').length;
        }, 0);
      return total + messageChars;
    }, 0) + input.length) / 4);
    const currentContextTokens = typeof promptTokens === 'number'
      ? promptTokens + pendingInputTokens
      : fallbackEstimatedTokens;
    const usageRatio = Math.min(1, currentContextTokens / contextLimit);
    const usagePercent = Math.round(usageRatio * 100);
    const center = 12;
    const radius = 10;
    const angle = usageRatio * Math.PI * 2 - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const largeArcFlag = usageRatio > 0.5 ? 1 : 0;
    const piePath = usageRatio <= 0
      ? ""
      : usageRatio >= 1
        ? "M12 12 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0"
        : `M12 12 L12 2 A10 10 0 ${largeArcFlag} 1 ${x} ${y} Z`;
    return {
      contextLimit,
      estimatedTokens: currentContextTokens,
      promptTokens,
      completionTokens: usageData?.completion_tokens,
      totalTokens: usageData?.total_tokens,
      reasoningTokens: usageData?.completion_tokens_details?.reasoning_tokens,
      cachedTokens: usageData?.prompt_tokens_details?.cached_tokens,
      cacheWriteTokens: usageData?.prompt_tokens_details?.cache_write_tokens,
      cost: usageData?.cost,
      usagePercent,
      usageRatio,
      piePath,
    };
  }, [messages, input, selectedModel, latestUsage, allChatModels]);
  const isRetryTargetMessage = useCallback((index: number) => {
    const current = messages[index];
    if (isLoading || !current || current.role !== 'assistant' || !current.content || current.tool_calls?.length) return false;
    const nextUserIndex = messages.findIndex((message, idx) => idx > index && message.role === 'user');
    const segmentEnd = nextUserIndex === -1 ? messages.length : nextUserIndex;
    for (let i = index + 1; i < segmentEnd; i += 1) {
      const candidate = messages[i];
      if (candidate.role === 'assistant' && (candidate.content || candidate.reasoning)) {
        return false;
      }
    }
    return true;
  }, [messages, isLoading]);
  const mobileContent = useMemo(() => {
    if (!isMobile) return null;
    if (mobileSelectedItem) {
      return (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col animate-in slide-in-from-right-10 duration-200">
          <div className="flex items-center gap-3 p-4 border-b border-surface-border bg-background sticky top-0 z-10">
            <button onClick={() => setMobileSelectedItem(null)} className="p-2 -ml-2 text-text-muted hover:text-white"><ArrowLeft size={20} /></button>
            <h2 className="font-bold text-white truncate flex-1">{mobileSelectedItem.title}</h2>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold whitespace-nowrap ${mobileSelectedItem.type === 'doc' ? 'bg-blue-900/30 text-blue-400' : 'bg-primary/10 text-primary'}`}>
              {mobileSelectedItem.tag}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-background prose-pre:border prose-pre:border-surface-border prose-code:text-primary">
              <div className="mb-6 text-text-muted text-sm italic border-l-2 border-surface-border pl-3">{mobileSelectedItem.description}</div>
              {mobileSelectedItem.type === 'wiki' && mobileSelectedItem.content && (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[
                    [rehypeSanitize, SANITIZE_CONFIG],
                    rehypeKatex
                  ]}
                  components={markdownComponents}
                >
                  {mobileSelectedItem.content}
                </ReactMarkdown>
              )}
              {mobileSelectedItem.type === 'doc' && (
                <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-text-subtle">
                    <TerminalSquare size={24} />
                  </div>
                  <p className="text-text-muted">This is an external documentation file.</p>
                  {mobileSelectedItem.url && (
                    <a href={mobileSelectedItem.url} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors">View official docs on bloxd.io</a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    const combinedItems: CombinedItem[] = [
      ...wikiData.map(w => ({ type: 'wiki' as const, title: w.title, tag: w.tag, description: w.description, content: w.content })),
      ...DOC_FILES.map(d => ({ type: 'doc' as const, title: d.name, tag: 'API DOC', description: `Official documentation for ${d.name}.`, url: d.officialUrl }))
    ];
    let filtered = combinedItems;
    if (mobileFilter !== 'all') filtered = filtered.filter(item => item.type === mobileFilter);
    if (debouncedQuery) filtered = fuzzySearch(filtered, debouncedQuery, ['title', 'tag', 'description']);
    return (
      <div className="h-full flex flex-col bg-[#0a0a0a]">
        <div className="p-4 space-y-4 bg-background border-b border-surface-border">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Blogs &amp; Guides</h1>
            <div className="flex bg-surface rounded-lg p-0.5 border border-surface-border">
              <button onClick={() => setMobileFilter('all')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mobileFilter === 'all' ? 'bg-hairline-strong text-white shadow-sm' : 'text-text-subtle'}`}>All</button>
              <button onClick={() => setMobileFilter('wiki')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mobileFilter === 'wiki' ? 'bg-hairline-strong text-white shadow-sm' : 'text-text-subtle'}`}>Wiki</button>
              <button onClick={() => setMobileFilter('doc')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mobileFilter === 'doc' ? 'bg-hairline-strong text-white shadow-sm' : 'text-text-subtle'}`}>API</button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
            <input type="text" placeholder="Search..." className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors" value={mobileSearchQuery} onChange={(e) => setMobileSearchQuery(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {debouncedQuery === "" && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-text-subtle uppercase tracking-wider mb-3">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {['setBlock', 'Player', 'Movement', 'Inventory', 'Crafting'].map(topic => (
                  <button key={topic} onClick={() => setMobileSearchQuery(topic)} className="px-3 py-1.5 bg-surface border border-surface-border rounded-lg text-xs text-gray-300 hover:border-primary hover:text-white transition-colors">{topic}</button>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-3">
            {filtered.map((item, idx) => (
              <button key={idx} onClick={() => setMobileSelectedItem(item)} className="w-full text-left bg-background border border-surface-border rounded-xl p-4 active:scale-[0.99] transition-transform hover:border-white/20">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-white text-base">{item.title}</h3>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${item.type === 'doc' ? 'text-blue-400 bg-blue-400/10' : 'text-primary bg-primary/10'}`}>{item.tag}</span>
                </div>
                <p className="text-sm text-text-subtle line-clamp-2 leading-relaxed">{item.description}</p>
              </button>
            ))}
            {filtered.length === 0 && debouncedQuery !== "" && (
              <div className="text-center py-10 text-text-subtle"><p>No results found for &quot;{debouncedQuery}&quot;</p></div>
            )}
          </div>
        </div>
      </div>
    );
  }, [isMobile, wikiData, mobileSearchQuery, debouncedQuery, mobileFilter, mobileSelectedItem]);
  if (isMobile && mobileContent) return mobileContent;
  return (
    <div className="flex h-full w-full bg-[#0a0a0a] overflow-hidden relative">
      <div className="flex-1 flex flex-col h-full bg-background transition-all duration-300 min-w-0">
        <div className="flex items-center justify-between p-3 border-b border-surface-border bg-background">
          <div className="flex items-center gap-2 text-primary font-bold"><Code2 size={20} /><span>Script Editor</span></div>
          <div className="flex items-center gap-2">
            <button onClick={() => { navigator.clipboard.writeText(code); toast.success("Code copied!"); }} className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Copy Code"><Copy size={16} /></button>
            <button onClick={() => { const b=new Blob([code],{type:"text/javascript"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="bloxd-script.js";a.click();URL.revokeObjectURL(u); }} className="p-2 hover:bg-primary/20 rounded-lg text-primary" title="Download Script (.js)"><Download size={16} /></button>
            {!isChatOpen && (
              <button onClick={() => setIsChatOpen(true)} className="ml-2 px-3 py-1.5 border border-surface-border hover:border-primary/50 text-gray-300 hover:text-primary rounded-md flex items-center gap-2 text-xs font-medium transition-all shadow-sm">
                <PanelRightOpen size={14} /> 
                <span>Open AI</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 pt-2 bg-background border-b border-surface-border overflow-x-auto custom-scrollbar shrink-0">
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => { setActiveTabId(tab.id); setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, modified: false } : t)); }}
              onDoubleClick={() => handleRenameTabPrompt(tab.id)}
              className={clsx(
                "group flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs font-medium cursor-pointer border border-b-0 min-w-0 max-w-[200px] transition-colors select-none",
                activeTabId === tab.id
                  ? "bg-surface text-white border-surface-border"
                  : "text-text-subtle border-transparent hover:bg-surface-hover hover:text-gray-300"
              )}
              title={tab.name}
            >
              {tab.modified && (
                <span className="w-2 h-2 rounded-full bg-primary shrink-0" aria-label="modified" />
              )}
              <span className="truncate">{tab.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleRenameTabPrompt(tab.id); }}
                className="opacity-0 group-hover:opacity-100 hover:text-primary text-text-subtle shrink-0"
                title="Rename tab"
                aria-label={`Rename ${tab.name}`}
              >
                <Pencil size={12} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                className="opacity-0 group-hover:opacity-100 hover:text-red-400 text-text-subtle shrink-0"
                title="Close tab"
                aria-label={`Close ${tab.name}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button onClick={createNewTab} className="p-1.5 text-text-subtle hover:text-primary rounded-md transition-colors shrink-0" title="New script tab" aria-label="New script tab">
            <Plus size={14} />
          </button>
        </div>
        {renamingTabId && (
          <RenameScriptTabModal
            currentName={tabs.find(t => t.id === renamingTabId)?.name || ""}
            onConfirm={(name) => { renameTab(renamingTabId, name); setRenamingTabId(null); }}
            onCancel={() => setRenamingTabId(null)}
          />
        )}
        <div className="flex-1 relative min-h-0">
          <Editor 
            height="100%" 
            defaultLanguage="javascript" 
            path={activeTabId || "script-editor"}
            value={code} 
            onChange={(v) => setCode(v || "")} 
            theme="vs-dark" 
            onMount={handleEditorDidMount} 
            options={{ 
              minimap: { enabled: false }, 
              fontSize: 14, 
              fontFamily: editorFontFamily, 
              padding: { top: 16 }, 
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              automaticLayout: true
            }} 
          />
        </div>
        <div className={clsx("flex-shrink-0 bg-background border-t border-surface-border flex flex-col transition-all duration-300", isProblemsOpen ? "h-48" : "h-9")}>
          <div 
            className="flex items-center justify-between px-3 py-1.5 bg-surface border-b border-surface-border cursor-pointer hover:bg-surface-hover"
            onClick={() => setIsProblemsOpen(!isProblemsOpen)}
          >
            <div className="flex items-center gap-2">
              {isProblemsOpen ? <ChevronDown size={14} className="text-text-subtle" /> : <ChevronRight size={14} className="text-text-subtle" />}
              <span className="text-xs font-bold text-text-muted tracking-wider">PROBLEMS</span>
              {lintErrors.length > 0 && (
                <span className="flex items-center justify-center bg-hairline-strong text-[10px] text-gray-300 rounded-full h-4 min-w-[1rem] px-1">
                  {lintErrors.length}
                </span>
              )}
            </div>
          </div>
          {isProblemsOpen && (
            <div className="flex-1 overflow-y-auto p-0 custom-scrollbar bg-[#0a0a0a]">
              {lintErrors.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-text-subtle opacity-60 gap-2">
                  <CheckCircle size={24} className="text-green-500" />
                  <span className="text-xs">No problems detected</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  {lintErrors.map((err, i) => (
                    <button key={i} onClick={() => jumpToError(err)} className="w-full text-left flex items-start gap-3 p-2 hover:bg-surface border-b border-surface group transition-colors">
                      <div className="mt-0.5 shrink-0">
                        {err.severity === 'error' ? <AlertCircle size={14} className="text-red-400" /> : <AlertTriangle size={14} className="text-yellow-400" />}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-xs font-medium ${err.severity === 'error' ? 'text-red-300' : 'text-yellow-300'}`}>{err.message}</span>
                        <span className="text-[10px] text-text-subtle font-mono group-hover:text-text-muted">Ln {err.line}, Col {err.column}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={clsx(
        "flex flex-col bg-[#0a0a0a] border-l border-surface-border shadow-2xl transition-[width] duration-300 ease-in-out shrink-0 overflow-hidden",
        isChatOpen ? "w-[420px]" : "w-0"
      )}>
        <div
          className="w-[420px] h-full flex flex-col relative"
          onDragEnter={handleChatDragEnter}
          onDragOver={handleChatDragOver}
          onDragLeave={handleChatDragLeave}
          onDrop={handleChatDrop}
        >
          {isImageDragActive && (
            <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="rounded-xl border border-primary/50 bg-background/95 px-6 py-4 text-center shadow-2xl">
                <ImagePlus size={24} className="mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium text-white">Drop your image anywhere</p>
              </div>
            </div>
          )}
          {isChatOpen && isVerifying && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-background border border-surface-border rounded-2xl p-6 flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200 shadow-xl">
                <p className="text-white font-medium">Security Check</p>
                {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
                  <Turnstile
                    key={turnstileWidgetKey}
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                    onSuccess={async (token: string) => {
                      setTurnstileToken(token);
                      setIsVerifying(false);
                      const pendingInput = pendingCaptchaRetryRef.current;
                      pendingCaptchaRetryRef.current = null;
                      if (pendingInput && !isLoading) {
                        lastSubmittedInputRef.current = pendingInput;
                        setInput("");
                        if (textareaRef.current) textareaRef.current.style.height = '44px';
                        await sendMessage(pendingInput, token);
                      } else {
                        await resubmitLast(token);
                      }
                    }}
                    onExpire={() => setTurnstileToken(null)}
                    onError={() => { toast.error('Security check failed. Please refresh the page.'); setIsVerifying(false); }}
                    options={{ theme: "dark" }}
                  />
                ) : (
                   <p className="text-xs text-yellow-500 text-center">Turnstile not configured.</p>
                )}
                <p className="text-xs text-text-subtle text-center max-w-xs">Please complete the check to use the AI Assistant.</p>
              </div>
            </div>
          )}
          <div className="h-12 px-4 border-b border-surface-border bg-background flex justify-between items-center shrink-0 z-10">
            <div className="flex items-center gap-2">
              <AIAgentLogo size={16} className="text-primary" />
              <span className="font-semibold text-sm text-foreground">AI Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={handleCreateNewSession} className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="New Chat" aria-label="New Chat"><Plus size={14} aria-hidden="true" /></button>
              <button onClick={() => setShowHistory(!showHistory)} className={`p-2 rounded-lg transition-colors ${showHistory ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-white hover:bg-white/10'}`} title="Chat History" aria-label="Chat History"><History size={14} aria-hidden="true" /></button>
              <Link href="/studio/settings?tab=ai" className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="AI Settings">
                <Settings2 size={14} />
              </Link>
              <div className="w-px h-4 bg-hairline-strong mx-1"></div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Close Panel" aria-label="Close Panel"><PanelRightClose size={14} aria-hidden="true" /></button>
            </div>
          </div>
          {showHistory ? (
            <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-4 flex flex-col gap-2 custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-sm font-semibold text-foreground">Chat History</h2>
              </div>
              {sessionOrder.map((id: string) => {
                const s = sessions[id];
                if (!s) return null;
                return (
                  <div key={id} onClick={() => handleSwitchSession(id)} className={`group flex flex-col p-3 rounded-lg cursor-pointer border transition-colors ${activeSessionId === id ? 'bg-surface border-primary/30' : 'bg-background border-surface-border hover:border-hairline-strong'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground truncate pr-4">{s.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); deleteSession(id); }} className="text-text-subtle hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete Chat"><Trash2 size={14} /></button>
                    </div>
                    <span className="text-xs text-text-subtle mt-1">{s.messages.filter(m => m.role === 'user').length} prompts{s.tabs?.length ? ` · ${s.tabs.length} tab${s.tabs.length === 1 ? '' : 's'}` : ''}</span>
                  </div>
                );
              })}
              {sessionOrder.length === 0 && (
                <div className="text-center py-10 text-text-subtle text-sm">No chat history found.</div>
              )}
            </div>
          ) : (
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0a0a]">
              {messages.length === 0 && (
                <div className="h-full flex flex-col justify-center px-6 pb-12">
                  <h3 className="text-base font-medium text-foreground mb-2">How can I help you?</h3>
                  <p className="text-sm text-text-subtle mb-6 leading-relaxed">Ask me to generate scripts, debug code, or explain specific Bloxd API functions.</p>
                  <div className="flex flex-col gap-2">
                    {["Generate a Bedwars team shop.", "How do I teleport a player?", "Check my code for errors."].map(p => (
                      <button key={p} onClick={() => handleSuggestedPrompt(p)} className="text-xs bg-background hover:bg-surface border border-surface-border px-4 py-3 rounded-lg transition-colors text-left text-text-muted hover:text-foreground font-medium w-full">
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col pb-4 pt-2">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  const isEmptyAssistant = msg.role === 'assistant' && !msg.content && !msg.reasoning;
                  const normalizedAssistantContent = msg.role === 'assistant'
                    ? normalizeAssistantMarkdown(messageContentToText(msg.content))
                    : '';
                  const showRetryControls = msg.role === 'assistant' && isRetryTargetMessage(idx);
                  if (isEmptyAssistant) return null;
                  if (msg.role === 'tool') {
                    const toolOutput = typeof msg.content === 'string' ? msg.content : '[No output]';
                    const isError = toolOutput.trim().startsWith('Error:');
                    const summary = getToolSummary(msg.name || 'tool', toolOutput);
                    return (
                      <details key={idx} className="group px-5 py-0.5 my-0.5">
                        <summary className="list-none flex items-center gap-1.5 cursor-pointer w-fit select-none text-[11px] font-mono text-text-subtle hover:text-text-muted transition-colors">
                          <ChevronRight size={12} className="transition-transform group-open:rotate-90 text-text-subtle" />
                          {isError ? <AlertCircle size={11} className="text-red-400" /> : <TerminalSquare size={11} />}
                          <span>{summary}</span>
                        </summary>
                        <div className="mt-1 ml-[7px] pl-4 border-l border-surface-border text-[11px] font-mono text-text-subtle whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar leading-relaxed">
                          {toolOutput}
                        </div>
                      </details>
                    );
                  }
                  if (isUser) {
                    const isEditing = editingMessageIndex === idx;
                    return (
                      <div key={idx} className="px-4 py-3 flex justify-end group">
                        {isEditing ? (
                          <div className="w-full max-w-[85%] bg-surface border border-surface-border rounded-2xl rounded-tr-sm p-3">
                            <textarea 
                              className="w-full bg-transparent text-sm text-foreground focus:outline-none resize-none custom-scrollbar"
                              defaultValue={messageContentToText(msg.content)}
                              rows={Math.min(10, messageContentToText(msg.content).split('\n').length + 1)}
                              id={`edit-prompt-${idx}`}
                              autoFocus
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button onClick={() => setEditingMessageIndex(null)} className="px-3 py-1.5 text-xs text-text-muted hover:text-white transition-colors bg-surface-hover rounded-lg border border-surface-border font-bold">Cancel</button>
                              <button onClick={() => {
                                const newContent = (document.getElementById(`edit-prompt-${idx}`) as HTMLTextAreaElement).value;
                                if (newContent.trim() && newContent !== messageContentToText(msg.content)) {
                                   handleEditPrompt(idx, newContent);
                                } else {
                                   setEditingMessageIndex(null);
                                }
                              }} className="px-3 py-1.5 text-xs text-white bg-primary hover:bg-primary-hover transition-all rounded-lg font-bold shadow-sm shadow-primary/10">Send</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-end gap-2 max-w-[85%]">
                            <button onClick={() => setEditingMessageIndex(idx)} className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0 mb-1" title="Edit prompt">
                              <Pencil size={14} />
                            </button>
                            <div className="bg-surface border border-surface-border text-foreground text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm whitespace-pre-wrap leading-relaxed flex flex-col gap-2">
                              <span>{messageContentToText(msg.content)}</span>
                              {typeof msg.content !== 'string' && msg.content.filter(p => p.type === 'image_url').length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {msg.content.filter(p => p.type === 'image_url').map((p, i) => (
                                    <button key={i} onClick={() => setPreviewImage((p as { type: 'image_url'; image_url: { url: string } }).image_url.url)} className="block">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={(p as { type: 'image_url'; image_url: { url: string } }).image_url.url} alt={`attachment ${i + 1}`} className="w-10 h-10 object-cover rounded-md border border-surface-border" />
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <div key={idx} className="flex flex-col group">
                      {msg.reasoning && (
                        <details className="group/reasoning px-5 py-0.5 my-0.5">
                          <summary className="list-none flex items-center gap-1.5 cursor-pointer w-fit select-none text-[11px] font-mono text-text-subtle hover:text-text-muted transition-colors">
                            <ChevronRight size={12} className="transition-transform group-open/reasoning:rotate-90 text-text-subtle" />
                            <span>Thinking Process</span>
                          </summary>
                          <div className="mt-1 ml-[7px] pl-4 border-l border-surface-border text-[11px] font-mono text-text-subtle whitespace-pre-wrap leading-relaxed opacity-80">
                            {msg.reasoning}
                          </div>
                        </details>
                      )}
                      {(normalizedAssistantContent || showRetryControls) && (
                        <div className="px-5 py-4 flex flex-col gap-2">
                          {normalizedAssistantContent && (
                            <div className="text-sm text-foreground leading-relaxed break-words">
                              <div className="w-full">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm, remarkMath]}
                                  rehypePlugins={[
                                    [rehypeSanitize, SANITIZE_CONFIG],
                                    rehypeKatex
                                  ]}
                                  components={markdownComponents}
                                >
                                  {normalizedAssistantContent}
                                </ReactMarkdown>
                              </div>
                            </div>
                          )}
                          {showRetryControls && (
                          <div className="flex items-center justify-between mt-3 text-[11px] font-medium text-text-subtle opacity-50 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border border-transparent hover:border-surface-border bg-transparent hover:bg-surface rounded-md transition-colors">
                                <button onClick={() => handleTryAgain(undefined, idx)} className="flex items-center gap-1.5 px-2 py-1.5 hover:text-gray-300" title="Try Again">
                                  <RefreshCw size={12} />
                                  <span>Try Again</span>
                                </button>
                                <div className="w-px h-3 bg-hairline-strong"></div>
                                <div className="relative retry-dropdown-container">
                                  <button 
                                    onClick={() => setRetryDropdownOpenId(retryDropdownOpenId === idx ? null : idx)}
                                    className="px-1.5 py-1.5 hover:text-gray-300 flex items-center justify-center"
                                  >
                                    <ChevronDown size={12} />
                                  </button>
                                  {retryDropdownOpenId === idx && (
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 w-52 max-h-72 overflow-y-auto custom-scrollbar bg-background border border-surface-border rounded-lg shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in-95">
                                      <div className="px-3 py-1.5 text-[10px] uppercase text-text-subtle border-b border-surface-border bg-[#0a0a0a] tracking-wider font-bold">Try with...</div>
                                      <div className="p-1">
                                        {AI_MODELS.map((m: typeof AI_MODELS[number]) => (
                                          <button 
                                            key={m.id} 
                                            onClick={() => handleTryAgain(m.id, idx)} 
                                            className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-surface-hover hover:text-foreground rounded transition-colors"
                                          >
                                            BloxdForge {m.name}
                                          </button>
                                        ))}
                                        {availableCustomModels.length > 0 && (
                                          <>
                                            <div className="px-3 pt-2 pb-1 text-[10px] uppercase text-text-subtle tracking-wider font-bold">Custom</div>
                                            {availableCustomModels.map(m => (
                                              <button
                                                key={m.id}
                                                onClick={() => handleTryAgain(m.id, idx)}
                                                title={m.id}
                                                className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-[11px] hover:bg-surface-hover hover:text-foreground rounded transition-colors"
                                              >
                                                <ModelIcon src={m.iconUrl} alt={m.name} size={14} />
                                                <span className="truncate">{m.name}</span>
                                              </button>
                                            ))}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button onClick={() => { navigator.clipboard.writeText(messageContentToText(msg.content)); toast.success("Copied markdown!"); }} className="flex items-center gap-1.5 px-2 py-1.5 border border-transparent hover:border-surface-border hover:bg-surface rounded-md transition-colors hover:text-gray-300" title="Copy Raw Response">
                                <Copy size={12} /> Copy
                              </button>
                            </div>
                            <div className="text-[10px] text-text-subtle font-medium px-2">
                              {getChatModelLabel(selectedModel)}
                            </div>
                          </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {(activeTool || (isLoading && !activeTool)) && (
                  <div className="px-5 py-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <Loader2 size={14} className="text-primary animate-spin" />
                    <span className="font-medium text-[13px] text-text-muted">
                      {activeTool ? `Running ${formatToolName(activeTool)}...` : 'Thinking...'}
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
          <div className="bg-background border-t border-surface-border p-4 shrink-0 z-10">
            <div className="relative bg-[#0a0a0a] border border-surface-border rounded-xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all flex flex-col shadow-sm">
              <div className="absolute right-2 top-2 z-10 group">
                <svg width="24" height="24" viewBox="0 0 24 24" className="h-6 w-6 rounded-full border border-surface-border bg-background">
                  <circle cx="12" cy="12" r="10" className="fill-surface-border" />
                  {contextUsage.piePath && <path d={contextUsage.piePath} className="fill-primary" />}
                </svg>
                <div className="pointer-events-none absolute right-0 top-8 whitespace-nowrap rounded-md border border-surface-border bg-background px-2 py-1 text-[10px] text-gray-300 opacity-0 transition-opacity group-hover:opacity-100">
                  {contextUsage.estimatedTokens.toLocaleString()} / {contextUsage.contextLimit.toLocaleString()} tokens ({contextUsage.usagePercent}%)
                  {typeof contextUsage.promptTokens === 'number' && typeof contextUsage.completionTokens === 'number' && (
                    <>
                      <br />prompt: {contextUsage.promptTokens.toLocaleString()} | completion: {contextUsage.completionTokens.toLocaleString()}
                    </>
                  )}
                  {typeof contextUsage.reasoningTokens === 'number' && (
                    <>
                      <br />reasoning: {contextUsage.reasoningTokens.toLocaleString()}
                    </>
                  )}
                  {typeof contextUsage.cachedTokens === 'number' && (
                    <>
                      <br />cached: {contextUsage.cachedTokens.toLocaleString()}
                    </>
                  )}
                  {typeof contextUsage.cacheWriteTokens === 'number' && (
                    <>
                      <br />cache write: {contextUsage.cacheWriteTokens.toLocaleString()}
                    </>
                  )}
                  {typeof contextUsage.cost === 'number' && (
                    <>
                      <br />cost: {contextUsage.cost}
                    </>
                  )}
                </div>
              </div>
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-3 pt-2">
                  {attachments.map(a => (
                    <div key={a.id} className="relative group">
                      <button onClick={() => setPreviewImage(a.dataUrl)} className="block" title={a.name}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={a.dataUrl} alt={a.name} className="w-10 h-10 object-cover rounded-md border border-surface-border" />
                      </button>
                      <button
                        onClick={() => removeAttachment(a.id)}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        aria-label={`Remove ${a.name}`}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <textarea 
                ref={textareaRef}
                className="w-full bg-transparent border-0 px-4 pr-11 pt-3 pb-2 text-sm text-foreground focus:outline-none focus:ring-0 placeholder:text-text-subtle resize-none custom-scrollbar"
                style={{ minHeight: '44px', maxHeight: '200px' }}
                placeholder="Ask a question or request a script..." 
                value={input} 
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = '44px';
                  e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                }} 
                onPaste={handleComposerPaste}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="flex items-center justify-between px-2 pb-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <div className="relative model-dropdown-container">
                    <button 
                      onClick={() => setModelMenuOpen(!modelMenuOpen)}
                      className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-surface max-w-[220px]"
                      title={allChatModels.find(m => m.id === selectedModel)?.id || selectedModel}
                    >
                      <span className="truncate">{allChatModels.find(m => m.id === selectedModel)?.name || "Select model"}</span>
                      <ChevronDown size={12} className={`transition-transform duration-200 shrink-0 ${modelMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {modelMenuOpen && (
                      <div className="absolute left-0 bottom-full mb-2 w-64 max-h-80 overflow-y-auto custom-scrollbar bg-background border border-surface-border rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                        <div className="px-3 py-2 text-[10px] uppercase font-bold text-text-subtle border-b border-surface-border bg-[#0a0a0a] tracking-wider">Select Model</div>
                        <div className="p-1">
                          {AI_MODELS.map((m: typeof AI_MODELS[number]) => (
                            <button 
                              key={m.id} 
                              onClick={() => { setSelectedModel(m.id); setModelMenuOpen(false); }}
                              title={m.id}
                              className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${selectedModel === m.id ? 'bg-primary/10 text-primary font-medium' : 'text-text-muted hover:bg-surface hover:text-foreground'}`}
                            >
                              BloxdForge {m.name}
                            </button>
                          ))}
                          {availableCustomModels.length > 0 && (
                            <>
                              <div className="px-3 pt-2 pb-1 text-[10px] uppercase font-bold text-text-subtle tracking-wider">Custom</div>
                              {availableCustomModels.map(m => (
                                <button
                                  key={m.id}
                                  onClick={() => { setSelectedModel(m.id); setModelMenuOpen(false); }}
                                  title={m.id}
                                  className={`w-full flex items-center gap-2 text-left px-3 py-2 text-xs rounded-md transition-colors ${selectedModel === m.id ? 'bg-primary/10 text-primary font-medium' : 'text-text-muted hover:bg-surface hover:text-foreground'}`}
                                >
                                  <ModelIcon src={m.iconUrl} alt={m.name} size={16} />
                                  <span className="truncate">{m.name}</span>
                                </button>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="relative tone-dropdown-container">
                    <button
                      onClick={() => setToneMenuOpen(!toneMenuOpen)}
                      className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-surface"
                    >
                      Tone
                      <ChevronDown size={12} className={`transition-transform duration-200 ${toneMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {toneMenuOpen && (
                      <div className="absolute left-0 bottom-full mb-2 w-44 bg-background border border-surface-border rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                        <div className="px-3 py-2 text-[10px] uppercase font-bold text-text-subtle border-b border-surface-border bg-[#0a0a0a] tracking-wider">Response Tone</div>
                        <div className="p-1">
                          {AI_TONES.map((tone: typeof AI_TONES[number]) => (
                            <button
                              key={tone.id}
                              onClick={() => { setSelectedTone(tone.id as AiToneId); setToneMenuOpen(false); }}
                              className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${selectedTone === tone.id ? 'bg-primary/10 text-primary font-medium' : 'text-text-muted hover:bg-surface hover:text-foreground'}`}
                            >
                              {tone.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasVision(selectedModel) ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-text-subtle hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Attach image (or paste/drop)"
                      aria-label="Attach image"
                    >
                      <ImagePlus size={16} />
                    </button>
                  ) : null}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => { handleAttachFiles(e.target.files); e.target.value = ''; }}
                  />
                  {isLoading ? (
                    <button onClick={stopGeneration} className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Stop Generation" aria-label="Stop Generation">
                      <Square size={16} className="fill-current" aria-hidden="true" />
                    </button>
                  ) : (
                    <button onClick={handleSendMessage} disabled={!input.trim() && attachments.length === 0} className="p-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:hover:bg-primary transition-all flex items-center justify-center shadow-sm shadow-primary/10" aria-label="Send message">
                      <ArrowUp size={16} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-text-subtle px-1">
              <div className="flex items-center gap-1.5"><ShieldAlert size={10} /><span>AI can make mistakes. Verify code.</span></div>
              <a href="/studio/settings?tab=ai" className="hover:text-primary transition-colors flex items-center gap-1"><Info size={10} /><span>Model Info</span></a>
            </div>
            {previewImage && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setPreviewImage(null)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewImage} alt="Attachment preview" className="max-h-full max-w-full rounded-lg object-contain" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}