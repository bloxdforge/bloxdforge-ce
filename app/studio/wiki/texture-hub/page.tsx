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
import { ChevronLeft, Paintbrush, Box, Zap, ArrowRight } from 'lucide-react';
export const metadata: Metadata = {
  title: 'Texture Creation Hub - Complete Guide to Bloxd.io Textures',
  description: 'Everything you need to create custom textures for Bloxd.io. From pixel art basics to 3D modeling and performance optimization. Your complete texture creation resource.',
  keywords: [
    'bloxd.io texture creation',
    'bloxd texture pack guide',
    'how to make bloxd textures',
    'bloxd.io custom textures',
    'bloxd texture tutorial',
  ],
  alternates: {
    canonical: 'https://www.bloxdforge.com/studio/wiki/texture-hub',
  },
  openGraph: {
    title: 'Texture Creation Hub - Complete Guide to Bloxd.io Textures',
    description: 'Everything you need to create custom textures for Bloxd.io. From pixel art basics to 3D modeling and optimization.',
    url: 'https://www.bloxdforge.com/studio/wiki/texture-hub',
    type: 'website',
  },
};
const guides = [
  {
    slug: 'texture-guide',
    title: 'Texture Pack Creation Guide',
    description: 'Step-by-step guide to creating custom texture packs. Learn naming conventions, file formats, and how to use the Texture Creator tool.',
    icon: Paintbrush,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    slug: 'modeling-guide',
    title: '3D Modeling (GLB) for Bloxd.io',
    description: 'Create custom 3D models using Blockbench. Learn modeling basics, texturing, animations, and exporting as GLB files.',
    icon: Box,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
  },
  {
    slug: 'optimization-guide',
    title: 'Performance & FPS Optimization',
    description: 'Optimize your textures and game settings for maximum performance. Learn how to reduce file sizes and improve rendering speed.',
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
  },
];
export default function TextureCreationHub() {
  return (
    <div className="flex-1 overflow-y-auto h-full bg-[#0a0a0a] scroll-smooth">
      <div className="relative bg-background border-b border-surface-border">
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-orange-500/5 opacity-50" />
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
              <span className="p-2 bg-primary/10 rounded-lg text-primary">
                <Paintbrush size={20} />
              </span>
              <span className="text-primary font-bold tracking-wider text-xs uppercase">Content Hub</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              Texture Creation Hub
            </h1>
            <p className="text-xl md:text-2xl text-text-muted leading-relaxed max-w-2xl">
              Your complete resource for creating custom textures and 3D models for Bloxd.io. From beginner tutorials to advanced optimization techniques.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link
                key={guide.slug}
                href={`/studio/wiki/guides/${guide.slug}`}
                className="group bg-background border border-surface-border rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col"
              >
                <div className={`p-3 ${guide.bgColor} rounded-xl w-fit mb-4`}>
                  <Icon size={24} className={guide.color} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed flex-1 mb-4">
                  {guide.description}
                </p>
                <span className="text-sm text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read Guide <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
        <div className="bg-background border border-surface-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Create?</h2>
          <p className="text-text-muted mb-6">
            Jump into the Texture Creator and start building your custom texture pack today. No downloads required: everything runs in your browser.
          </p>
          <Link
            href="/studio/creator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors"
          >
            Open Texture Creator <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}