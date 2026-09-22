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
import Link from "next/link";
import { Award, Clock, Crown, Image as ImageIcon, X } from "lucide-react";
import EventShareButton from "@/components/events/EventShareButton";
import type { EventModalProps } from "@/components/events/studioEvents";
const READ_DELAY_MS = 3000;
export default function LogoContestModal({ isOpen, onClose, requireReadDelay = false, eventId }: EventModalProps) {
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
        className="bg-background border border-surface-border w-full max-w-2xl rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logo-contest-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Crown className="text-primary" size={20} />
            </div>
            <div>
              <h2 id="logo-contest-title" className="text-xl font-bold text-white">2026 BloxdForge Logo Contest</h2>
              <p className="text-sm text-text-muted">Feb 12, 2026 to Feb 28, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EventShareButton
              eventTitle="2026 BloxdForge Logo Contest"
              eventDescription="Shape BloxdForge's visual identity! Submit a 500x500px logo to represent our community. Winner receives 30 SGD Steam gift card + permanent site recognition."
              eventId={eventId}
            />
            <button
              onClick={onClose}
              disabled={!canClose}
              className={`p-2 rounded-lg transition-colors ${canClose ? "text-text-muted hover:text-white hover:bg-white/10" : "text-text-subtle cursor-not-allowed"}`}
              aria-label="Close logo contest"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 p-6 space-y-5 text-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-surface-border rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <ImageIcon size={16} />
                Design Brief
              </div>
              <p className="text-white font-semibold">500x500 pixels, square format</p>
              <p className="text-sm text-text-muted">Create a clean logo that captures the essence of BloxdForge: our community, creativity, and passion for gaming.</p>
            </div>
            <div className="bg-surface border border-surface-border rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Award size={16} />
                What You Win
              </div>
              <p className="text-white font-semibold">30 SGD Steam Gift Card</p>
              <p className="text-sm text-text-muted">Plus permanent recognition across our site, seen by thousands of visitors.</p>
            </div>
          </div>
          <div className="bg-surface border border-surface-border rounded-xl p-4 space-y-3">
            <p className="text-sm text-text-muted">How to Participate</p>
            <ul className="space-y-2 text-sm">
              /*! SIMPLIFIED START */
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Submit a 500x500px square logo.
              </li>
              /*! SIMPLIFIED END */
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                DM <span className="text-white font-semibold">khrotubutms</span> with your 500x500 logo to submit.
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                All participants will be featured in our creator showcase blog post with full credit.
              </li>
            </ul>
          </div>
          {requireReadDelay && !canClose && (
            <div className="flex items-center gap-2 text-xs text-text-subtle">
              <Clock size={14} />
              Read for {secondsRemaining} more second{secondsRemaining === 1 ? "" : "s"} to close.
            </div>
          )}
        </div>
        <div className="p-4 border-t border-surface-border flex items-center justify-between">
          <p className="text-xs text-text-subtle">Ends Feb 28, 2026 at 23:59 UTC</p>
          <button
            onClick={onClose}
            disabled={!canClose}
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-colors ${canClose ? "bg-primary hover:bg-primary-hover text-white" : "bg-surface-hover text-text-subtle cursor-not-allowed"}`}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
