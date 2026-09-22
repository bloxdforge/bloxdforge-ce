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

import { useState, useEffect, useRef } from 'react';
import { Share2, Clock, Calendar, Check, List, ChevronDown } from 'lucide-react';
import { Guide } from '@/app/studio/wiki/guides';
interface GuideContentWrapperProps {
  children: React.ReactNode;
  guide: Guide;
}
interface TocItem {
  id: string;
  text: string;
  level: number;
}
export default function GuideContentWrapper({ children, guide }: GuideContentWrapperProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [readingTime, setReadingTime] = useState("Calculating...");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!contentRef.current) return;
    const updateContentMetrics = () => {
      if (!contentRef.current) return;
      const text = contentRef.current.innerText;
      const wpm = 200;
      const words = text.trim().split(/\s+/).length;
      const time = Math.max(1, Math.ceil(words / wpm));
      setReadingTime((prev) => prev === `${time} min read` ? prev : `${time} min read`);
      const headings = contentRef.current.querySelectorAll('h2, h3');
      const items: TocItem[] = [];
      const seen: Record<string, number> = {};
      headings.forEach((heading) => {
        const text = heading.textContent || "";
        const base = heading.id || text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || "section";
        let id = base;
        if (seen[base] !== undefined) {
          seen[base]++;
          id = `${base}-${seen[base]}`;
        } else {
          seen[base] = 0;
        }
        heading.id = id;
        items.push({
          id,
          text,
          level: parseInt(heading.tagName[1])
        });
      });
      setToc((prev) => JSON.stringify(prev) === JSON.stringify(items) ? prev : items);
    };
    updateContentMetrics();
    const observer = new MutationObserver(updateContentMetrics);
    observer.observe(contentRef.current, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [children]);
  useEffect(() => {
    const scrollContainer = document.getElementById('guide-scroll-container');
    if (!scrollContainer) return;
    const handleScroll = () => {
      const totalScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const currentScroll = scrollContainer.scrollTop;
      const progress = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;
      setScrollProgress(progress);
      if (contentRef.current) {
        const headings = contentRef.current.querySelectorAll<HTMLElement>('h2, h3');
        let currentId = "";
        const containerTop = scrollContainer.getBoundingClientRect().top;
        headings.forEach((section) => {
          if (section.getBoundingClientRect().top - containerTop <= 150) {
            currentId = section.id;
          }
        });
        setActiveId(currentId || (headings[0] ? headings[0].id : ""));
      }
    };
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [toc]);
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const scrollContainer = document.getElementById('guide-scroll-container');
    const el = document.getElementById(id) as HTMLElement | null;
    if (el && scrollContainer) {
      const offsetPosition = scrollContainer.scrollTop + el.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top - 100;
      scrollContainer.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  return (
    <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 relative items-start">
      <div className="fixed top-0 left-0 h-1 bg-linear-to-r from-primary to-blue-500 z-[100] transition-all duration-100 ease-out shadow-[0_0_10px_var(--ring)]" style={{ width: `${scrollProgress}%` }} />
      <aside className="hidden xl:block w-48 shrink-0 sticky top-12 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <Calendar size={16} className="text-primary" />
            <time dateTime={new Date(guide.dateFull).toISOString()}>{guide.dateFull}</time>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <Clock size={16} className="text-primary" />
            <span>{readingTime}</span>
          </div>
        </div>
        <button 
          onClick={handleShare}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border w-full justify-center ${copied ? 'bg-green-500/10 text-green-400 border-green-500/50' : 'bg-surface text-gray-300 border-surface-border hover:border-white/30 hover:text-white'}`}
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          {copied ? 'Copied' : 'Share'}
        </button>
      </aside>
      <article 
        className="flex-1 min-w-0 w-full" 
        itemScope 
        itemType="http://schema.org/Article"
      >
        <meta itemProp="headline" content={guide.title} />
        <meta itemProp="description" content={guide.description} />
        <meta itemProp="datePublished" content={new Date(guide.dateFull).toISOString()} />
        <meta itemProp="author" content="KHROTU" />
        <div className="xl:hidden mb-8 space-y-6 border-b border-surface-border pb-8">
           <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                <span>{guide.dateFull}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <span>{readingTime}</span>
              </div>
           </div>
           {toc.length > 0 && (
             <div className="bg-surface border border-surface-border rounded-xl overflow-hidden transition-all">
               <button
                 onClick={() => setMobileTocOpen(!mobileTocOpen)}
                 className="w-full flex items-center justify-between p-4 text-left font-bold text-foreground hover:bg-surface-hover transition-colors"
               >
                 <span className="flex items-center gap-2 text-sm uppercase tracking-wider"><List size={16} className="text-primary"/> On this page</span>
                 <ChevronDown size={16} className={`transition-transform duration-200 ${mobileTocOpen ? 'rotate-180' : ''}`} />
               </button>
               <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${mobileTocOpen ? 'max-h-[80vh]' : 'max-h-0'}`}>
                 <nav className="p-2 border-t border-surface-border bg-background">
                   {toc.map((item) => (
                     <a
                       key={item.id}
                       href={`#${item.id}`}
                       onClick={(e) => { scrollToSection(e, item.id); setMobileTocOpen(false); }}
                       className={`block text-sm py-2.5 px-3 rounded-lg transition-colors truncate ${activeId === item.id ? 'bg-primary/10 text-primary font-medium' : 'text-text-muted hover:bg-surface-hover hover:text-white'}`}
                       style={{ paddingLeft: `${Math.max(0.75, (item.level - 1) * 1)}rem` }}
                     >
                       {item.text}
                     </a>
                   ))}
                 </nav>
               </div>
             </div>
           )}
           <button
              onClick={handleShare}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all border ${copied ? 'bg-green-500/10 text-green-400 border-green-500/50' : 'bg-surface text-gray-300 border-surface-border hover:border-white/30 hover:text-white'}`}
            >
              {copied ? <Check size={16} /> : <Share2 size={16} />}
              {copied ? 'Link Copied' : 'Share Guide'}
            </button>
        </div>
        <div 
          ref={contentRef} 
          itemProp="articleBody"
          className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-bold prose-headings:scroll-mt-24 prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-pre:bg-background prose-pre:border prose-pre:border-surface-border prose-img:rounded-xl prose-img:border prose-img:border-surface-border"
        >
          {children}
        </div>
      </article>
      <aside className="hidden xl:block w-64 shrink-0 sticky top-12 h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar pb-8">
        {toc.length > 0 && (
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-bold text-text-subtle uppercase tracking-wider mb-4">
              <List size={14} /> On this page
            </h4>
            <nav className="flex flex-col relative space-y-0.5">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-surface-border rounded-full" />
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`text-sm py-1.5 px-4 border-l-[2px] -ml-[2px] transition-all duration-200 block leading-relaxed h-auto rounded-r-md ${activeId === item.id ? 'border-primary text-primary font-bold bg-linear-to-r from-primary/10 to-transparent pl-5' : 'border-transparent text-text-subtle hover:text-gray-300 hover:border-gray-600 hover:pl-5'}`}
                  style={{ 
                    paddingLeft: activeId === item.id ? '1.25rem' : '1rem',
                    marginLeft: item.level > 2 ? `${(item.level - 2) * 0.75}rem` : '0' 
                  }}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        )}
      </aside>
    </div>
  );
}