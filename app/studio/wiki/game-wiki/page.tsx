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
import { Search, Loader2 } from "lucide-react";
import { fuzzySearch } from "@/lib/search";
import { fetchSecureData } from "@/lib/secure-data";
import { useMediaQuery } from "@/hooks/useMediaQuery";
interface WikiItem {
  title: string;
  tag: string;
  description: string;
  content: string;
}
export default function GameWikiPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [wikiItems, setWikiItems] = useState<WikiItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(24);
  const observerTarget = useRef<HTMLDivElement>(null);
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  useEffect(() => {
    fetchSecureData<WikiItem[]>('wiki')
      .then(data => setWikiItems(data))
      .catch(err => console.error("Failed to load wiki", err));
  }, []);
  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => prev + 24);
        }
      },
      { rootMargin: '400px' }
    );
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => observer.disconnect();
  }, [searchQuery, visibleCount]);
  const filteredWiki = fuzzySearch(wikiItems, searchQuery, ['title', 'tag', 'description']);
  const visibleWiki = filteredWiki.slice(0, visibleCount);
  const numCols = isLg ? 3 : isMd ? 2 : 1;
  const wikiCols = Array.from({ length: numCols }, () => [] as typeof visibleWiki);
  visibleWiki.forEach((item, idx) => {
    wikiCols[idx % numCols].push(item);
  });
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto min-h-full flex flex-col space-y-8 pb-20">
        <header>
          <h1 className="text-3xl font-bold text-white mb-2">Game Wiki</h1>
          <p className="text-text-muted">Explore Bloxd.io items, blocks, mechanics and more.</p>
        </header>
        <div className="space-y-6">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search items, blocks, mechanics..."
              className="w-full bg-background border border-surface-border rounded-2xl pl-14 pr-5 py-4 text-white text-base focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div
            className="flex gap-6 items-start"
            role="list"
            aria-label="Wiki Items"
          >
            {wikiCols.map((col, colIdx) => (
              <div key={colIdx} className="flex-1 flex flex-col gap-6">
                {col.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-background border border-surface-border rounded-2xl p-5 hover:border-hairline-strong transition-colors duration-200"
                    style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 250px' }}
                    role="listitem"
                    itemScope
                    itemType="https://schema.org/Thing"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-white text-base" itemProp="name">{item.title}</h3>
                      <span className="text-[11px] text-primary/70 font-medium tracking-wide">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-[13px] text-text-subtle mb-4 leading-relaxed line-clamp-2" itemProp="description">{item.description}</p>
                    <div
                      className="text-[13px] text-gray-300 leading-relaxed whitespace-pre-line"
                      itemProp="text"
                    >
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {visibleCount < filteredWiki.length && (
            <div ref={observerTarget} className="py-8 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-text-subtle" />
            </div>
          )}
          {filteredWiki.length === 0 && (
            <div className="text-center py-24 text-text-subtle bg-background border border-surface-border rounded-2xl">
              <Search className="w-8 h-8 mx-auto mb-4 text-text-subtle opacity-50" />
              <p className="text-lg font-medium text-text-muted">No results found for &quot;{searchQuery}&quot;</p>
              <p className="text-sm mt-2 opacity-70">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}