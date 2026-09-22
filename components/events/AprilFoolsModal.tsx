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
import { Clock, PartyPopper, X } from "lucide-react";
import EventShareButton from "@/components/events/EventShareButton";
import type { EventModalProps } from "@/components/events/studioEvents";
const READ_DELAY_MS = 3000;
export default function AprilFoolsModal({ isOpen, onClose, requireReadDelay = false, eventId }: EventModalProps) {
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
        aria-labelledby="april-fools-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PartyPopper className="text-primary" size={20} />
            </div>
            <div>
              <h2 id="april-fools-title" className="text-xl font-bold text-white">April Fools 2026</h2>
              <p className="text-sm text-text-muted">April 1, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EventShareButton
              eventTitle="April Fools 2026"
              eventDescription="Check out the April Fools 2026 message from the BloxdForge team!"
              eventId={eventId}
            />
            <button
              onClick={onClose}
              disabled={!canClose}
              className={`p-2 rounded-lg transition-colors ${canClose ? "text-text-muted hover:text-white hover:bg-white/10" : "text-text-subtle cursor-not-allowed"}`}
              aria-label="Close April Fools message"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 p-6 space-y-5 text-gray-300">
          <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-4">
            <p className="text-white leading-relaxed">
              {`Hey guys, I was gonna do an April Fools this year where the logo would become "BallForge": the logo icon would be replaced with circles, and all the elements would be replaced with circles as well (I know, I know, very mature).`}
            </p>
            <p className="text-white leading-relaxed">
              {`But I'm in the middle of some things IRL and I just don't have the mental capacity to make it. So if you could just like squint your eyes, and then maybe squint a bit more, and then close them, and imagine I did a very cool April Fools prank, that would be very nice :>`}
            </p>
            <p className="text-white leading-relaxed">
              Jokes aside, expect updates to be much slower for the next 2-3 months as I sort things out. I really appreciate every one of you that has used BloxdForge, especially those who have provided me with feedback, and I hope you have a great rest of your day.
            </p>
            <p className="text-white font-semibold text-right">
              -- Much love, khrotu
            </p>
          </div>
          {requireReadDelay && !canClose && (
            <div className="flex items-center gap-2 text-xs text-text-subtle">
              <Clock size={14} />
              Read for {secondsRemaining} more second{secondsRemaining === 1 ? "" : "s"} to close.
            </div>
          )}
        </div>
        <div className="p-4 border-t border-surface-border flex items-center justify-between">
          <p className="text-xs text-text-subtle">April 1, 2026</p>
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
