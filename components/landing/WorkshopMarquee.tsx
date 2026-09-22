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

import Link from "next/link";
import { Box, Download, Loader2, Code, Hammer, Image as ImageIcon } from "lucide-react";
import { secureDownload } from "@/lib/client-download";
import { useDownloadAnimation } from "@/hooks/useDownloadAnimation";
import { truncateAuthor } from "@/lib/filename-utils";
import { clsx } from "clsx";
export interface WorkshopItem {
  id: string;
  title: string;
  author: string;
  tag: string;
  color: string;
  linkUrl: string;
  downloadUrl?: string;
  scriptCode?: string;
}
const MarqueeRow = ({ items, direction, speed, isPaused }: { items: WorkshopItem[], direction: 'left' | 'right', speed: number, isPaused: boolean }) => {
  const content = [...items, ...items];
  return (
    <div className="relative w-full overflow-hidden whitespace-nowrap marquee-container">
      <div 
        className="flex gap-4 w-max marquee-track"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
          animationPlayState: isPaused ? 'paused' : 'running',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      >
        {content.map((item, i) => (
          <WorkshopCard key={`${item.id}-${i}`} item={item} />
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-container:hover .marquee-track {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
};
function WorkshopCard({ item }: { item: WorkshopItem }) {
  const { startDownload, endDownload, isDownloading } = useDownloadAnimation();
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const downloadId = `marquee-${item.id}`;
    startDownload(downloadId);
    try {
      if (item.downloadUrl) {
        await secureDownload(item.downloadUrl, item.title.replace(/\s+/g, '_'));
      } else if (item.scriptCode) {
        const blob = new Blob([item.scriptCode], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${item.title.replace(/\s+/g, '_')}.js`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      endDownload(downloadId);
    } catch {
      endDownload(downloadId);
    }
  };
  const getIcon = () => {
    if (item.tag === 'Schematic') return <Hammer size={20} />;
    if (item.tag === 'Script') return <Code size={20} />;
    if (item.tag === 'Texture') return <ImageIcon size={20} />;
    return <Box size={20} />;
  };
  return (
    <Link 
      href={item.linkUrl}
      className="w-64 h-20 bg-surface border border-surface-border rounded-lg p-3 flex items-center gap-4 shrink-0 hover:border-primary/50 hover:bg-surface transition-all cursor-pointer group/card"
    >
      <div className={`w-12 h-12 rounded-md ${item.color}/20 flex items-center justify-center text-white/50 shrink-0 group-hover/card:text-white transition-colors`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="text-[10px] font-bold text-text-subtle uppercase tracking-wider mb-0.5">{item.tag}</div>
        <div className="text-white font-bold text-sm truncate group-hover/card:text-primary transition-colors">{item.title}</div>
        <div className="text-[10px] text-text-muted truncate">by {truncateAuthor(item.author)}</div>
      </div>
      <button 
        onClick={handleDownload}
        disabled={isDownloading(`marquee-${item.id}`)}
        className={clsx(
          "h-8 w-8 rounded-full flex items-center justify-center text-text-muted shrink-0 transition-all z-10",
          isDownloading(`marquee-${item.id}`) ? "bg-primary/20 text-primary animate-pulse" : "bg-surface-hover hover:text-white hover:bg-primary"
        )}
        title="Download"
      >
        {isDownloading(`marquee-${item.id}`) ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
      </button>
    </Link>
  );
}
export default function WorkshopMarquee({ rows, isPaused }: { rows: WorkshopItem[][], isPaused: boolean }) {
  if (rows.length === 0 || rows[0].length === 0) {
    return (
      <div className="relative w-full overflow-hidden h-[340px] bg-[#0F0F0F] border border-surface-border rounded-xl flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="relative w-full overflow-hidden h-[340px] bg-[#0F0F0F] border border-surface-border rounded-xl flex flex-col justify-center gap-5 py-4">
      <div className="absolute inset-0 bg-linear-to-r from-[#0F0F0F] via-transparent to-[#0F0F0F] z-10 pointer-events-none" />
      <MarqueeRow items={rows[0]} direction="left" speed={40} isPaused={isPaused} />
      <MarqueeRow items={rows[1]} direction="right" speed={45} isPaused={isPaused} />
      <MarqueeRow items={rows[2]} direction="left" speed={50} isPaused={isPaused} />
    </div>
  );
}
