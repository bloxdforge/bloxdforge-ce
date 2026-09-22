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

import React, { Suspense, lazy } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ChevronLeft, Loader2, GraduationCap, BookOpen } from 'lucide-react';
import { GUIDES } from '@/app/studio/wiki/guides';
import { FAQ_SCHEMAS, HOWTO_SCHEMAS } from '@/lib/schema';
import { guideMetadata } from '@/app/studio/metadata';
import GuideContentWrapper from '@/components/wiki/GuideContentWrapper';
import GuideNavigation from '@/components/wiki/GuideNavigation';
const GuideComponents: { [key: string]: React.LazyExoticComponent<() => React.ReactElement> } = {
  'starter-guide': lazy(() => import('@/components/guides/starter-guide')),
  'bloxdforge-versions': lazy(() => import('@/components/guides/bloxdforge-versions')),
  'why-choose-bloxdforge': lazy(() => import('@/components/guides/why-choose-bloxdforge')),
  'texture-guide': lazy(() => import('@/components/guides/texture-guide')),
  'modeling-guide': lazy(() => import('@/components/guides/modeling-guide')),
  'optimization-guide': lazy(() => import('@/components/guides/optimization-guide')),
  'coding-guide': lazy(() => import('@/components/guides/coding-guide')),
  'survival-mode-strategies': lazy(() => import('@/components/guides/survival-mode-strategies')),
  'resource-gathering': lazy(() => import('@/components/guides/resource-gathering')),
  'building-techniques': lazy(() => import('@/components/guides/building-techniques')),
  'combat-pvp-strategies': lazy(() => import('@/components/guides/combat-pvp-strategies')),
  'game-modes-guide': lazy(() => import('@/components/guides/game-modes-guide')),
  'bedwars-strategies': lazy(() => import('@/components/guides/bedwars-strategies')),
  'sky-wars-strategies': lazy(() => import('@/components/guides/sky-wars-strategies')),
  'infection-mode-strategies': lazy(() => import('@/components/guides/infection-mode-strategies')),
  'bloxd-hop-strategies': lazy(() => import('@/components/guides/bloxd-hop-strategies')),
};
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find(g => g.id === slug);
  if (!guide) {
    return { title: 'Guide Not Found' };
  }
  const baseMetadata = guideMetadata[slug] || {};
  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      title: baseMetadata.title || guide.title,
      description: baseMetadata.description || guide.description,
      type: 'article',
      url: `https://www.bloxdforge.com/studio/wiki/guides/${slug}`,
      images: ['/og-image.png'],
      publishedTime: guide.dateFull,
      modifiedTime: guide.dateFull,
      authors: ['BloxdForge'],
    },
    twitter: {
      card: 'summary_large_image',
      title: baseMetadata.title || guide.title,
      description: baseMetadata.description || guide.description,
      images: ['/og-image.png'],
      creator: '@bloxdforge',
    },
  };
}
export function generateStaticParams() {
  return GUIDES.map(guide => ({
    slug: guide.id,
  }));
}
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guideIndex = GUIDES.findIndex(g => g.id === slug);
  const guide = GUIDES[guideIndex];
  const GuideComponent = GuideComponents[slug];
  if (!guide || !GuideComponent) {
    notFound();
  }
  const contentTypeLabel = guide.type === "blog" ? "Blog" : "Guide";
  const ContentTypeIcon = guide.type === "blog" ? BookOpen : GraduationCap;
  const prevGuide = guideIndex > 0 ? GUIDES[guideIndex - 1] : undefined;
  const nextGuide = guideIndex < GUIDES.length - 1 ? GUIDES[guideIndex + 1] : undefined;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": guide.type === "blog" ? "BlogPosting" : "Article",
    "headline": guide.title,
    "description": guide.description,
    "datePublished": guide.dateFull,
    "dateModified": guide.dateFull,
    "author": {
      "@type": "Organization",
      "name": "BloxdForge",
      "url": "https://www.bloxdforge.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BloxdForge",
      "url": "https://www.bloxdforge.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.bloxdforge.com/logo.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.bloxdforge.com/studio/wiki/guides/${slug}`
    },
    "image": "https://www.bloxdforge.com/og-image.png",
    "keywords": guide.targetKeyword,
    "articleSection": guide.type === "blog" ? "Blog" : "Guides"
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.bloxdforge.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Studio",
        "item": "https://www.bloxdforge.com/studio"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Wiki",
        "item": "https://www.bloxdforge.com/studio/wiki"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": guide.title,
        "item": `https://www.bloxdforge.com/studio/wiki/guides/${slug}`
      }
    ]
  };
  const faqSchema = FAQ_SCHEMAS[slug];
  const howToSchema = HOWTO_SCHEMAS[slug];
  return (
    <div 
      className="flex-1 overflow-y-auto h-full bg-[#0a0a0a] scroll-smooth relative" 
      id="guide-scroll-container"
    >
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      <div className="relative bg-background border-b border-surface-border">
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-blue-500/5 opacity-50" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
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
                <ContentTypeIcon size={20} />
              </span>
              <span className="text-primary font-bold tracking-wider text-xs uppercase">{contentTypeLabel}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              {guide.title}
            </h1>
            <p className="text-xl md:text-2xl text-text-muted leading-relaxed max-w-2xl">
              {guide.description}
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-12 pb-24">
        <GuideContentWrapper guide={guide}>
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-text-subtle">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span>Loading content...</span>
            </div>
          }>
            <GuideComponent />
          </Suspense>
        </GuideContentWrapper>
        <GuideNavigation prev={prevGuide} next={nextGuide} />
      </div>
    </div>
  );
}
