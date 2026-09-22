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

import { useState, useEffect, useMemo, useCallback, useRef, isValidElement } from "react";
import { Loader2, ExternalLink, Search, Copy, Check, Hash, Menu, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { DOC_FILES, DOCS_SOURCE, DOCS_VERSION } from "@/lib/docs";
import toast from "react-hot-toast";
interface DocFile {
  name: string;
  url: string;
}
const CACHE_KEY = "bloxdforge_docs_cache";
const CACHE_DURATION = 86400000;
function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function stripFencedBlocks(markdown: string): string {
  return markdown.replace(/```[\s\S]*?(```|$)/g, "");
}
function extractText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode; alt?: string };
    return extractText(props.children) || (typeof props.alt === "string" ? props.alt : "");
  }
  return "";
}
function uniqueSlug(base: string, counts: Record<string, number>): string {
  const key = base || "section";
  let id = key;
  if (counts[key] !== undefined) {
    counts[key]++;
    id = `${key}-${counts[key]}`;
  } else {
    counts[key] = 0;
  }
  return id;
}
interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}
const MarkdownCodeBlock = ({ inline, className, children, ...props }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const codeValue = String(children).replace(/\n$/, "");
  const handleCopy = () => {
    navigator.clipboard.writeText(codeValue);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };
  if (!inline && match) {
    return (
      <div className="relative rounded-lg border border-surface-border bg-background my-5 overflow-hidden font-mono">
        <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-surface-border text-[11px] text-text-muted">
          <span>{match[1].toUpperCase()}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
        <div className="overflow-x-auto p-4 text-xs leading-relaxed">
          <SyntaxHighlighter
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style={vscDarkPlus as any}
            language={match[1]}
            PreTag="div"
            customStyle={{ background: "transparent", padding: 0, margin: 0 }}
          >
            {codeValue}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }
  return (
    <code className="px-1.5 py-0.5 rounded bg-surface-hover text-primary font-mono text-xs border border-surface-border" {...props}>
      {children}
    </code>
  );
};
export default function ApiDocsPage() {
  /*! SIMPLIFIED START */
  const [selectedDoc, setSelectedDoc] = useState<DocFile | null>(DOC_FILES[0] ?? null);
  /*! SIMPLIFIED END */
  const [docContent, setDocContent] = useState<string>("");
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [docSearch, setDocSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fetchDoc = useCallback(async (doc: DocFile) => {
    setLoadingDoc(true);
    try {
      const cacheKey = `${CACHE_KEY}_${doc.name}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const { content, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setDocContent(content);
          setLoadingDoc(false);
          return;
        }
      }
      const res = await fetch(doc.url);
      if (!res.ok) throw new Error("Failed to fetch documentation");
      const text = await res.text();
      localStorage.setItem(cacheKey, JSON.stringify({
        content: text,
        timestamp: Date.now()
      }));
      setDocContent(text);
    } catch (err) {
      console.error(err);
      setDocContent("# Error\nFailed to load this documentation file. Please try again later.");
    } finally {
      setLoadingDoc(false);
    }
  }, []);
  useEffect(() => {
    if (selectedDoc) {
      fetchDoc(selectedDoc);
    }
  }, [selectedDoc, fetchDoc]);
  const toc = useMemo(() => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const items: { id: string; text: string; level: number }[] = [];
    const idCounts: Record<string, number> = {};
    let match;
    const searchable = stripFencedBlocks(docContent);
    while ((match = headingRegex.exec(searchable)) !== null) {
      const level = match[1].length;
      const rawText = match[2].trim();
      const text = rawText.replace(/[\*_`]/g, "").replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
      items.push({ id: uniqueSlug(slugify(text) || `h-${items.length}`, idCounts), text, level });
    }
    return items;
  }, [docContent]);
  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const filteredDocFiles = useMemo(() => {
    if (!docSearch) return DOC_FILES;
    const query = docSearch.toLowerCase();
    return DOC_FILES.filter(doc => doc.name.toLowerCase().includes(query));
  }, [docSearch]);
  const headingCountsRef = useRef<Record<string, number>>({});
  headingCountsRef.current = {};
  const customMarkdownComponents = useMemo(() => {
    const generateUniqueId = (children: React.ReactNode) => {
      return uniqueSlug(slugify(extractText(children)), headingCountsRef.current);
    };
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      code: (props: any) => <MarkdownCodeBlock {...props} />,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      h1: ({ children }: any) => {
        const id = generateUniqueId(children);
        return (
          <h1 id={id} className="text-2xl font-bold text-white border-b border-surface-border pb-2 mb-6 mt-2 scroll-mt-20">
            {children}
          </h1>
        );
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      h2: ({ children }: any) => {
        const id = generateUniqueId(children);
        return (
          <h2 id={id} className="text-lg font-semibold text-white mt-10 mb-4 flex items-center gap-2 group scroll-mt-20">
            <span>{children}</span>
            <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 text-text-subtle hover:text-primary transition-opacity">
              <Hash size={14} />
            </a>
          </h2>
        );
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      h3: ({ children }: any) => {
        const id = generateUniqueId(children);
        return (
          <h3 id={id} className="text-base font-semibold text-foreground mt-8 mb-3 flex items-center gap-2 group scroll-mt-20">
            <span>{children}</span>
            <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 text-text-subtle hover:text-primary transition-opacity">
              <Hash size={12} />
            </a>
          </h3>
        );
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      p: ({ children }: any) => <p className="text-gray-300 leading-relaxed mb-4 text-sm">{children}</p>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      a: ({ href, children }: any) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
          {children}
          {href?.startsWith("http") && <ExternalLink size={12} />}
        </a>
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      blockquote: ({ children }: any) => (
        <div className="border-l-2 border-primary pl-4 py-1 my-5 bg-background italic text-text-muted">
          {children}
        </div>
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      table: ({ children }: any) => (
        <div className="overflow-x-auto my-5 border border-surface-border bg-background">
          <table className="w-full border-collapse text-left text-xs">{children}</table>
        </div>
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      th: ({ children }: any) => <th className="border-b border-surface-border bg-surface px-3 py-2 font-semibold text-foreground">{children}</th>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      td: ({ children }: any) => <td className="border-b border-surface-border/50 px-3 py-2 text-text-muted align-top leading-relaxed">{children}</td>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ul: ({ children }: any) => <ul className="list-disc list-outside pl-5 mb-4 space-y-1 text-gray-300 text-sm">{children}</ul>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ol: ({ children }: any) => <ol className="list-decimal list-outside pl-5 mb-4 space-y-1 text-gray-300 text-sm">{children}</ol>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    };
  }, []);
  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full w-full bg-[#0a0a0a] text-foreground select-text overflow-hidden">
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-background border-b border-surface-border shrink-0 z-30">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-text-muted hover:text-white bg-white/5 rounded-lg transition-colors"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="font-bold text-white text-xs">API Reference</div>
        <div className="w-9" />
      </header>
      <aside className={`
        fixed inset-0 top-[49px] lg:static lg:inset-auto
        w-full lg:w-64 bg-background border-r border-surface-border flex flex-col shrink-0 z-20 transition-all duration-200
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-4 border-b border-surface-border flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-subtle" />
            <input
              type="text"
              placeholder="Search reference files..."
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-surface-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-primary placeholder:text-text-subtle transition-colors"
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
          {filteredDocFiles.map((doc) => {
            const isActive = selectedDoc?.name === doc.name;
            return (
              <button
                key={doc.name}
                onClick={() => {
                  setSelectedDoc(doc);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-xs transition-all ${
                  isActive
                    ? "bg-surface-hover text-primary font-bold"
                    : "text-text-muted hover:text-white hover:bg-surface"
                }`}
              >
                {doc.name.replace(".md", "").replace(".txt", "").replace(/_/g, " ")}
              </button>
            );
          })}
          {filteredDocFiles.length === 0 && (
            <div className="text-center py-8 text-xs text-text-subtle">No matching files.</div>
          )}
        </nav>
        <div className="p-4 border-t border-surface-border bg-background flex flex-col items-center gap-1">
          <a
            href={selectedDoc ? DOC_FILES.find(d => d.name === selectedDoc.name)?.officialUrl ?? DOCS_SOURCE : DOCS_SOURCE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-text-subtle hover:text-white transition-colors"
          >
            <ExternalLink size={12} /> View official docs on bloxd.io
          </a>
          <span className="text-[10px] text-text-subtle">v{DOCS_VERSION}</span>
        </div>
      </aside>
      <main className="flex-1 flex overflow-hidden relative min-w-0">
        <div className="flex-1 overflow-y-auto custom-scrollbar flex justify-center bg-[#0a0a0a]">
          <div className="w-full max-w-3xl px-6 md:px-12 py-10 md:py-16">
            {loadingDoc ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-text-subtle gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" data-force-animation="on" />
                <span className="text-xs">Loading...</span>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                  components={customMarkdownComponents}
                >
                  {docContent}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
        <aside className="w-60 border-l border-surface-border bg-background flex flex-col shrink-0 hidden xl:flex">
          <div className="p-4 border-b border-surface-border">
            <span className="text-[10px] font-bold text-text-subtle uppercase tracking-widest">On This Page</span>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            {toc.map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                onClick={() => handleScrollToSection(item.id)}
                className="w-full text-left py-0.5 text-xs text-text-muted hover:text-white transition-all truncate block"
                style={{
                  paddingLeft: item.level > 1 ? `${(item.level - 1) * 8}px` : undefined,
                }}
              >
                {item.text}
              </button>
            ))}
            {toc.length === 0 && (
              <div className="text-center py-8 text-xs text-text-subtle italic">No headers on this page.</div>
            )}
          </nav>
        </aside>
      </main>
    </div>
  );
}