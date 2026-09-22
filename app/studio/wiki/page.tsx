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

import Link from 'next/link';
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { GUIDES } from './guides';
export default function BlogsAndGuidesPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto min-h-full flex flex-col space-y-8 pb-20">
        <header>
          <h1 className="text-3xl font-bold text-white mb-2">Blogs &amp; Guides</h1>
          <p className="text-text-muted">Everything you need to know about Bloxd and BloxdForge.</p>
        </header>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300"
          role="list"
          aria-label="Guides and Blog Posts"
        >
          {GUIDES.map((guide) => (
            <Link
              key={guide.id}
              href={`/studio/wiki/guides/${guide.id}`}
              className="group relative bg-background border border-surface-border rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer shadow-lg hover:shadow-primary/5 flex flex-col justify-between overflow-hidden"
              role="listitem"
              data-bf-guide-id={guide.id}
              data-bf-type={guide.type}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 group-hover:bg-primary/10" />
              <div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="p-3 bg-surface-hover rounded-xl text-primary ring-1 ring-white/5 group-hover:ring-primary/20 transition-all">
                    {guide.type === 'blog' ? <BookOpen size={24} /> : <GraduationCap size={24} />}
                  </div>
                  <span className="text-xs text-text-subtle font-mono bg-background px-2 py-1 rounded-md border border-surface-border">{guide.dateShort}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">{guide.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-6 line-clamp-3">{guide.description}</p>
              </div>
              <div className="flex items-center text-sm text-text-subtle font-medium group-hover:text-primary transition-colors">
                {guide.type === 'blog' ? 'Read Blog' : 'Read Guide'} <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}