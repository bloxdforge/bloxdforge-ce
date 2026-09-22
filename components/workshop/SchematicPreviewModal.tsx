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

import { useState, useEffect, useCallback, Suspense } from 'react';
import { X, Loader2, AlertTriangle, Check, Download, Share2, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/useIsMobile';
import { secureDownload, fetchThroughProxy } from '@/lib/client-download';
import { useDownloadAnimation } from '@/hooks/useDownloadAnimation';
import { clsx } from 'clsx';
import { ForgeRenderLogo } from '@/components/settings/SettingsLogos';
import { FORGE_RENDER_INFO } from '@/lib/forgerender-info';
import type { ParsedBloxdSchematic } from '@/lib/converter';
import { parseBloxdSchematic } from '@/lib/converter';
const SchematicRenderer = dynamic(() => import('./SchematicRenderer'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black flex items-center justify-center text-text-muted">Loading 3D Engine...</div>
});
export type SchematicData = ParsedBloxdSchematic;
function BetaDisclaimer({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
  if (!visible) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-background border border-surface-border rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 p-6">
        <div className="flex items-center gap-3 text-primary mb-4">
          <ForgeRenderLogo size={44} className="text-primary" />
          <h3 className="text-3xl font-bold text-white leading-tight">
            {FORGE_RENDER_INFO.name}
          </h3>
        </div>
        <div className="space-y-2 mb-6">
          <p className="text-[11px] uppercase tracking-wider text-text-subtle">Version: {FORGE_RENDER_INFO.version}</p>
          <p className="text-[11px] text-text-subtle">{FORGE_RENDER_INFO.copyrightLabel}</p>
          <p className="text-[11px] text-text-subtle">
            Last updated: {FORGE_RENDER_INFO.lastUpdated},{' '}
            <Link
              href={FORGE_RENDER_INFO.changelogLink}
              className="text-primary hover:text-primary-hover underline underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              Read full changelog
            </Link>
          </p>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary/10"
        >
          <Check size={18} />
          Got it
        </button>
      </div>
    </div>
  );
}
function RateLimitDisplay({ retryAfter }: { retryAfter: number }) {
  const [countdown, setCountdown] = useState(retryAfter);
  useEffect(() => {
    setCountdown(retryAfter);
    if (retryAfter <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [retryAfter]);
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-background border border-surface-border rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div className="flex items-center justify-center gap-3 text-yellow-400 mb-4">
          <Clock size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Rate Limit Exceeded</h3>
        <p className="text-sm text-text-muted mb-4">
          Too many schematic conversion requests. Please wait before trying again.
        </p>
        <div className="bg-[#0a0a0a] rounded-lg p-4 mb-4">
          <div className="text-3xl font-mono font-bold text-primary">
            {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-text-subtle mt-1">Time remaining</div>
        </div>
        <p className="text-xs text-text-subtle">
          You can still download the schematic file directly while waiting.
        </p>
      </div>
    </div>
  );
}
interface SchematicPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  schematic: {
    url: string;
    name: string;
    author: string;
  } | null;
}
export default function SchematicPreviewModal({ isOpen, onClose, schematic }: SchematicPreviewModalProps) {
  const [loading, setLoading] = useState(true);
  const [showBetaDisclaimer, setShowBetaDisclaimer] = useState(false);
  const { startDownload, endDownload, isDownloading } = useDownloadAnimation();
  const handleDownload = async () => {
    if (!schematic) return;
    const downloadId = 'schematic-modal-download';
    startDownload(downloadId);
    try {
      await secureDownload(schematic.url, `${schematic.name.replace(/\s+/g, '_')}.bloxdschem`);
      endDownload(downloadId);
    } catch {
      endDownload(downloadId);
    }
  };
  const [error, setError] = useState<string | null>(null);
  const [schematicData, setSchematicData] = useState<SchematicData | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFps, setShowFps] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);
  const isMobile = useIsMobile();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ',') {
        setShowFps(prev => !prev);
      }
      const scrollKeys = new Set(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
      if (scrollKeys.has(e.code)) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const scrollKeys = new Set(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
      if (scrollKeys.has(e.code)) {
        e.preventDefault();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown, { passive: false });
      window.addEventListener('keyup', handleKeyUp, { passive: false });
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [isOpen]);
  useEffect(() => {
    if (isOpen && !isMobile) {
      setShowControls(true);
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 8000);
      return () => clearTimeout(timer);
    } else {
      setShowControls(false);
    }
  }, [isOpen, isMobile]);
  useEffect(() => {
    if (isOpen) {
      const hasSeen = localStorage.getItem('bloxdforge_schematic_beta_seen');
      if (!hasSeen) {
        setShowBetaDisclaimer(true);
      }
      setCopied(false);
      setShowFps(false);
    }
  }, [isOpen]);
  const dismissDisclaimer = () => {
    localStorage.setItem('bloxdforge_schematic_beta_seen', 'true');
    setShowBetaDisclaimer(false);
  };
  const handleShare = () => {
    if (schematic?.url) {
        const url = `${window.location.origin}/studio/workshop?schematic=${encodeURIComponent(schematic.url)}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  }
  const processSchematic = useCallback(async () => {
    if (!schematic) return;
    setLoading(true);
    setError(null);
    setSchematicData(null);
    setRateLimited(false);
    try {
      const response = await fetchThroughProxy(schematic.url);
      if (response.status === 429) {
        const retryAfterHeader = response.headers.get('Retry-After');
        const retrySeconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;
        setRetryAfter(retrySeconds);
        setRateLimited(true);
        setLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch schematic file.');
      }
      const arrayBuffer = await response.arrayBuffer();
      const parsedBloxd = await parseBloxdSchematic(arrayBuffer);
      setSchematicData(parsedBloxd);
    } catch (err) {
      console.error("Schematic processing error:", err);
      setError(err instanceof Error ? err.message : "Failed to load schematic. The file may be invalid.");
    } finally {
      setLoading(false);
    }
  }, [schematic]);
  useEffect(() => {
    if (!isOpen || !schematic) {
      setSchematicData(null);
      setRateLimited(false);
      setRetryAfter(0);
      return;
    }
    processSchematic();
  }, [isOpen, schematic, processSchematic]);
  if (!isOpen || !schematic) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-background border border-surface-border w-full h-full md:w-full md:max-w-7xl md:h-[90vh] md:rounded-2xl flex flex-col overflow-hidden relative shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        {!loading && !error && <BetaDisclaimer visible={showBetaDisclaimer} onDismiss={dismissDisclaimer} />}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-linear-to-b from-black/50 to-transparent pointer-events-none">
          <div className="pointer-events-auto">
            <h2 className="text-xl font-bold text-white leading-tight shadow-black drop-shadow-md">{schematic.name}</h2>
            <p className="text-sm text-gray-300 drop-shadow-md">by {schematic.author}</p>
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
             <button
              onClick={handleShare}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg ${copied ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-black/50 hover:bg-white/20 text-white'}`}
            >
              {copied ? <Check size={16} /> : <Share2 size={16} />}
              {copied ? 'Copied!' : 'Share'}
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading('schematic-modal-download')}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-bold transition-colors shadow-lg",
                isDownloading('schematic-modal-download') ? "bg-primary/20 cursor-wait shadow-none" : "bg-primary hover:bg-primary-hover shadow-sm shadow-primary/10"
              )}
            >
              {isDownloading('schematic-modal-download') ? <Loader2 size={16} className="animate-spin text-primary" /> : <Download size={16} />}
              Download
            </button>
            <button onClick={onClose} className="p-2 bg-black/50 rounded-full text-white hover:bg-red-500/80 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-text-subtle">
            <Loader2 className="w-8 h-8 animate-spin text-primary" data-force-animation="on" />
            <span>Converting & Loading Schematic...</span>
          </div>
        ) : rateLimited ? (
          <RateLimitDisplay retryAfter={retryAfter} />
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-red-400">
            <AlertTriangle className="w-10 h-10 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Could Not Load Preview</h3>
            <p className="text-sm text-text-subtle max-w-md">{error}</p>
          </div>
        ) : (
          <Suspense fallback={null}>
            <SchematicRenderer data={schematicData} showFps={showFps} />
          </Suspense>
        )}
        <div className={`absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/50 to-transparent pointer-events-none flex justify-between items-end transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
           <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg text-xs text-gray-300 pointer-events-auto border border-white/10 hidden md:block">
            <p className="font-bold">Desktop Controls: <span className="font-normal">WASD to move, Mouse to look, Space/Shift to fly, comma (,) for FPS.</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
