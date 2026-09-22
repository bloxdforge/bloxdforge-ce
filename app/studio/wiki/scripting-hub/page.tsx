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
import { Metadata } from 'next';
import { ChevronLeft, Code2, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
export const metadata: Metadata = {
  title: 'Scripting Hub - Learn Bloxd.io Code Blocks API',
  description: 'Master Bloxd.io scripting with our comprehensive hub. Learn Code Blocks API, JavaScript basics, and AI-assisted development. From beginner to advanced.',
  keywords: [
    'bloxd.io scripting',
    'bloxd.io code blocks',
    'bloxd.io javascript',
    'bloxd.io api tutorial',
    'bloxd.io script guide',
  ],
  alternates: {
    canonical: 'https://www.bloxdforge.com/studio/wiki/scripting-hub',
  },
  openGraph: {
    title: 'Scripting Hub - Learn Bloxd.io Code Blocks API',
    description: 'Master Bloxd.io scripting with Code Blocks API tutorials and AI-assisted development tools.',
    url: 'https://www.bloxdforge.com/studio/wiki/scripting-hub',
    type: 'website',
  },
};
const guides = [
  {
    slug: 'coding-guide',
    title: 'Scripting Basics with Code Blocks API',
    description: 'Learn JavaScript fundamentals and the Bloxd.io Code Blocks API. Functions, events, player interactions, and AI-assisted coding.',
    icon: Code2,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
  },
];
export default function ScriptingHub() {
  return (
    <div className="flex-1 overflow-y-auto h-full bg-[#0a0a0a] scroll-smooth">
      <div className="relative bg-background border-b border-surface-border">
        <div className="absolute inset-0 bg-linear-to-r from-green-500/5 to-cyan-500/5 opacity-50" />
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10">
          <Link
            href="/studio/wiki"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors mb-8 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5 hover:border-white/20"
          >
            <ChevronLeft size={16} />
            Back to Blogs &amp; Guides
          </Link>
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="p-2 bg-green-400/10 rounded-lg text-green-400">
                <Code2 size={20} />
              </span>
              <span className="text-green-400 font-bold tracking-wider text-xs uppercase">Content Hub</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              Scripting Hub
            </h1>
            <p className="text-xl md:text-2xl text-text-muted leading-relaxed max-w-2xl">
              Learn to write scripts for Bloxd.io worlds using the Code Blocks API. From JavaScript basics to advanced automation with AI assistance.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link
                key={guide.slug}
                href={`/studio/wiki/guides/${guide.slug}`}
                className="group bg-background border border-surface-border rounded-2xl p-6 hover:border-green-400/50 transition-all flex flex-col"
              >
                <div className={`p-3 ${guide.bgColor} rounded-xl w-fit mb-4`}>
                  <Icon size={24} className={guide.color} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed flex-1 mb-4">
                  {guide.description}
                </p>
                <span className="text-sm text-green-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read Guide <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
          <Link
            href="/studio/wiki/api-docs"
            className="group bg-background border border-surface-border rounded-2xl p-6 hover:border-green-400/50 transition-all flex flex-col"
          >
            <div className="p-3 bg-blue-400/10 rounded-xl w-fit mb-4">
              <BookOpen size={24} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
              API Documentation
            </h3>
            <p className="text-sm text-text-muted leading-relaxed flex-1 mb-4">
              Complete reference for all Code Blocks API functions, events, and parameters. Searchable and always up-to-date.
            </p>
            <span className="text-sm text-green-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
              View Docs <ArrowRight size={14} />
            </span>
          </Link>
        </div>
        <div className="bg-background border border-surface-border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-green-400/10 rounded-xl">
              <Sparkles size={24} className="text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Try World Tools</h2>
              <p className="text-text-muted">
                Our AI-powered script editor reads the official API docs, analyzes your code, and helps you debug in real-time. Write scripts faster with intelligent assistance.
              </p>
            </div>
          </div>
          <Link
            href="/studio/world-tools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
          >
            Open World Tools <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}