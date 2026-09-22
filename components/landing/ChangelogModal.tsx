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

import { useEffect, useState, useRef, useCallback } from 'react';
import { X, Sparkles, Plus, Wrench, Trash2, Bug, RefreshCw, ArrowRight, Cuboid } from 'lucide-react';
import Link from 'next/link';
import { CHANGELOG } from '@/lib/changelog';
interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastViewedVersion: string | null;
}
const TYPE_CONFIG = {
  Major: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
  Minor: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  Patch: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
};
const CHANGE_ICONS = {
  added: Plus,
  improved: Wrench,
  renderingEngine: Cuboid,
  removed: Trash2,
  fixed: Bug,
  changed: RefreshCw,
};
export default function ChangelogModal({ isOpen, onClose, lastViewedVersion }: ChangelogModalProps) {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);
  useEffect(() => {
    if (isOpen) {
      const newVersions = new Set<string>();
      if (lastViewedVersion) {
        const lastIdx = CHANGELOG.findIndex(e => e.version === lastViewedVersion);
        const unseen = CHANGELOG.slice(0, Math.max(0, lastIdx));
        unseen.slice(0, 3).forEach(e => newVersions.add(e.version));
      } else {
        CHANGELOG.slice(0, 3).forEach(e => newVersions.add(e.version));
      }
      setExpandedVersions(newVersions);
      setIsAtBottom(false);
    }
  }, [isOpen, lastViewedVersion]);
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    setIsAtBottom(atBottom);
  }, []);
  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => handleScroll());
      return () => cancelAnimationFrame(raf);
    }
  }, [isOpen, handleScroll]);
  if (!isOpen) return null;
  const toggleVersion = (version: string) => {
    setExpandedVersions(prev => {
      const next = new Set(prev);
      if (next.has(version)) {
        next.delete(version);
      } else {
        next.add(version);
      }
      return next;
    });
  };
  const isNewVersion = (version: string) => {
    if (!lastViewedVersion) return true;
    const lastIdx = CHANGELOG.findIndex(e => e.version === lastViewedVersion);
    const currentIdx = CHANGELOG.findIndex(e => e.version === version);
    return currentIdx < lastIdx;
  };
  const visibleUpdates = CHANGELOG.slice(0, 7);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <style>{`
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        style={{ animation: 'backdropIn 150ms ease-out' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative bg-background border border-surface-border w-full max-w-2xl max-h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        style={{ animation: 'modalIn 200ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="changelog-title"
      >
        <div className="flex justify-between items-center p-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="text-primary" size={20} />
            </div>
            <div>
              <h2 id="changelog-title" className="text-xl font-bold text-white">What&apos;s New</h2>
              <p className="text-sm text-text-muted">Recent updates and improvements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close changelog"
          >
            <X size={20} />
          </button>
        </div>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
        >
          {visibleUpdates.map((entry) => {
            const isExpanded = expandedVersions.has(entry.version);
            const isNew = isNewVersion(entry.version);
            const typeConfig = TYPE_CONFIG[entry.type];
            return (
              <div
                key={entry.version}
                className={`bg-surface border rounded-xl overflow-hidden transition-colors ${
                  isNew ? 'border-primary/30 shadow-[0_0_15px_-5px_rgba(255,107,57,0.15)]' : 'border-surface-border'
                }`}
              >
                <button
                  onClick={() => toggleVersion(entry.version)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3">
                    {isNew && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-primary text-white rounded-full uppercase tracking-wide">
                        New
                      </span>
                    )}
                    <span className="font-bold text-white">{entry.version}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeConfig.bg} ${typeConfig.color} ${typeConfig.border} border`}>
                      {entry.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-subtle">{entry.date}</span>
                    <ArrowRight
                      size={16}
                      className={`text-text-muted transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    {Object.entries(entry.changes).map(([changeType, changes]) => {
                      if (!changes || changes.length === 0) return null;
                      const Icon = CHANGE_ICONS[changeType as keyof typeof CHANGE_ICONS] || RefreshCw;
                      return (
                        <div key={changeType} className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-text-muted capitalize">
                            <Icon size={14} />
                            {changeType}
                          </div>
                          <ul className="space-y-1 pl-6">
                            {changes.map((change, idx) => (
                              <li key={idx} className="text-sm text-gray-300 relative before:content-['•'] before:absolute before:-left-4 before:text-text-subtle">
                                {change}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <div
            className={`flex justify-center pt-2 pb-1 transition-[opacity,transform] duration-300 ease-out ${
              isAtBottom
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-1 pointer-events-none'
            }`}
          >
            <Link
              href="/studio/settings?tab=support"
              className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary-hover transition-colors"
              onClick={onClose}
            >
              View full changelog
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div
          className={`flex justify-end items-center p-4 border-t border-surface-border transition-opacity duration-300 ${
            isAtBottom ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <Link
            href="/studio/settings?tab=support"
            className="text-sm text-text-muted hover:text-white transition-colors flex items-center gap-1.5"
            onClick={onClose}
          >
            View full changelog
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}