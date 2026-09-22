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
import { ChevronLeft, Hammer, Shield, Pickaxe, Gamepad2, ArrowRight } from 'lucide-react';
export const metadata: Metadata = {
  title: 'Building Hub - Master Bloxd.io Construction & Survival',
  description: 'Master building, survival, and combat in Bloxd.io. Learn architecture techniques, resource gathering strategies, and game mode tactics all in one place.',
  keywords: [
    'bloxd.io building',
    'bloxd.io survival guide',
    'bloxd.io construction',
    'bloxd.io base building',
    'bloxd.io gameplay guide',
  ],
  alternates: {
    canonical: 'https://www.bloxdforge.com/studio/wiki/building-hub',
  },
  openGraph: {
    title: 'Building Hub - Master Bloxd.io Construction & Survival',
    description: 'Master building, survival, and combat in Bloxd.io with comprehensive guides and strategies.',
    url: 'https://www.bloxdforge.com/studio/wiki/building-hub',
    type: 'website',
  },
};
const guides = [
  {
    slug: 'building-techniques',
    title: 'Building and Construction Techniques',
    description: 'Learn architectural styles, terraforming, interior design, and creative construction. Build structures that stand out.',
    icon: Hammer,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    slug: 'survival-mode-strategies',
    title: 'Advanced Survival Mode Strategies',
    description: 'Master base building, mob defense, raiding tactics, and progression in survival mode. Dominate the sandbox.',
    icon: Shield,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
  },
  {
    slug: 'resource-gathering',
    title: 'Resource Gathering and Crafting Guide',
    description: 'Efficient mining techniques, farming strategies, ore locations, and automated resource management systems.',
    icon: Pickaxe,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
  },
  {
    slug: 'game-modes-guide',
    title: 'Guide to Bloxd.io Game Modes',
    description: 'Overview of all game modes: Survival, Bedwars, Sky Wars, Infection, and more. Rules, strategies, and tips for each.',
    icon: Gamepad2,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
  },
];
export default function BuildingHub() {
  return (
    <div className="flex-1 overflow-y-auto h-full bg-[#0a0a0a] scroll-smooth">
      <div className="relative bg-background border-b border-surface-border">
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-yellow-500/5 opacity-50" />
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
                <Hammer size={20} />
              </span>
              <span className="text-primary font-bold tracking-wider text-xs uppercase">Content Hub</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              Building &amp; Survival Hub
            </h1>
            <p className="text-xl md:text-2xl text-text-muted leading-relaxed max-w-2xl">
              Everything you need to master construction, survival, and combat in Bloxd.io. From basic building techniques to advanced game mode strategies.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/studio/wiki/guides/combat-pvp-strategies"
            className="group bg-background border border-surface-border rounded-2xl p-6 hover:border-red-400/50 transition-all"
          >
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
              Combat &amp; PvP Strategies
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Master fighting techniques, weapon strategies, and movement tactics to dominate every battle.
            </p>
          </Link>
          <Link
            href="/studio/wiki/guides/bedwars-strategies"
            className="group bg-background border border-surface-border rounded-2xl p-6 hover:border-pink-400/50 transition-all"
          >
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
              Bedwars Strategies
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Bed defense, rush tactics, resource management, and winning strategies for competitive play.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}