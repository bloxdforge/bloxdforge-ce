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

import { useEffect, useState } from "react";
import { Clock, HeartHandshake, X } from "lucide-react";
import EventShareButton from "@/components/events/EventShareButton";
import type { EventModalProps } from "@/components/events/studioEvents";
const READ_DELAY_MS = 3000;
const REASONS = [
  "My vision for BloxdForge has always been a free-to-use, ad-free platform which aims to be the best of its niche. However, providing said service for free (with domain registration costs, LLM credits, etc.) has become increasingly unsustainable.",
  "BloxdForge peaked in terms of visitors around late 2025, when we were getting nearly 30,000 users per month. This has since seen a sharp decline to around 8,000 users per month, which, while I'm still grateful, makes it hard to justify spending more time on a project that I need to constantly strangle due to its long development history and that is hardly ever \"fun\" to work on.",
  "Since BloxdForge's initial release in 2023, there have been significant changes to my life, making it increasingly difficult to maintain and update the project at the level of quality I desire. I really don't want to compromise on quality, just to force myself to release something.",
  "I've just mentally moved on from BloxdForge, Bloxd (the game), and the community in general. The game itself has gone in a development direction which, while I'm sure is profitable for the developers and enjoyable for many players, no longer aligns with my interests and how I hoped it would evolve when I picked it up ~6 years ago.",
];
export default function GoodbyeNoticeModal({ isOpen, onClose, requireReadDelay = false, eventId }: EventModalProps) {
  const [canClose, setCanClose] = useState(!requireReadDelay);
  const [countdownMs, setCountdownMs] = useState(READ_DELAY_MS);
  useEffect(() => {
    if (!isOpen) return;
    if (!requireReadDelay) {
      setCanClose(true);
      return;
    }
    setCanClose(false);
    setCountdownMs(READ_DELAY_MS);
    const intervalId = window.setInterval(() => {
      setCountdownMs((prev) => Math.max(0, prev - 250));
    }, 250);
    const timeoutId = window.setTimeout(() => {
      setCanClose(true);
      window.clearInterval(intervalId);
      setCountdownMs(0);
    }, READ_DELAY_MS);
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [isOpen, requireReadDelay]);
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && canClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, canClose, onClose]);
  if (!isOpen) return null;
  const handleBackdropClick = () => {
    if (canClose) {
      onClose();
    }
  };
  const secondsRemaining = Math.ceil(countdownMs / 1000);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={handleBackdropClick}>
      <div
        className="bg-background border border-surface-border w-full max-w-2xl rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="goodbye-notice-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <HeartHandshake className="text-primary" size={20} />
            </div>
            <div>
              <h2 id="goodbye-notice-title" className="text-xl font-bold text-white">Phew, we&apos;re finally done!</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EventShareButton
              eventTitle="A farewell from BloxdForge"
              eventDescription="After v2.0.0, BloxdForge enters End of Life support. Read the farewell notice."
              eventId={eventId}
            />
            <button
              onClick={onClose}
              disabled={!canClose}
              className={`p-2 rounded-lg transition-colors ${canClose ? "text-text-muted hover:text-white hover:bg-white/10" : "text-text-subtle cursor-not-allowed"}`}
              aria-label="Close farewell notice"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 p-6 space-y-4 text-sm text-gray-300 overflow-y-auto custom-scrollbar">
          <p>As this is almost certainly the last notice you will receive from me, I would really appreciate it if you could take a moment to read this message.</p>
          <p>After v2.0.0, BloxdForge will enter <strong className="text-white">End of Life (EoL)</strong> support, effective immediately. This means that there will almost certainly be <strong className="text-white">no more feature updates</strong>, with future updates (if any) focusing only on critical bugs and CVEs.</p>
          <p>Why? Well, mainly for a few reasons:</p>
          <ol className="space-y-3 list-decimal list-outside pl-5">
            {REASONS.map((reason) => (
              <li key={reason.slice(0, 24)} className="leading-relaxed">{reason}</li>
            ))}
          </ol>
          <p>As for the future of the website, it will likely remain online for the next 2-3 years. I do plan on making it open-source (after stripping out any sensitive information), so stay tuned for that.</p>
          <p>I&apos;m grateful to everyone who has used or supported BloxdForge over the years. This has been an incredible chapter of my life, but I&apos;m also ready to move on. Goodbye.</p>
          {requireReadDelay && !canClose && (
            <div className="flex items-center gap-2 text-xs text-text-subtle">
              <Clock size={14} />
              Read for {secondsRemaining} more second{secondsRemaining === 1 ? "" : "s"} to close.
            </div>
          )}
        </div>
        <div className="p-4 border-t border-surface-border flex items-center justify-end">
          <button
            onClick={onClose}
            disabled={!canClose}
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-colors ${canClose ? "bg-primary hover:bg-primary-hover text-white" : "bg-surface-hover text-text-subtle cursor-not-allowed"}`}
          >
            Goodbye!
          </button>
        </div>
      </div>
    </div>
  );
}
