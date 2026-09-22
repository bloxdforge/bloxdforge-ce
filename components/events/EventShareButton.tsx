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

import { Share2, Copy, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
interface EventShareButtonProps {
  eventTitle: string;
  eventDescription: string;
  shareUrl?: string;
  discordInvite?: string;
  eventId?: string;
}
export default function EventShareButton({
  eventTitle,
  eventDescription,
  shareUrl: customShareUrl,
  discordInvite,
  eventId,
}: EventShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const getShareUrl = () => {
    if (customShareUrl) return customShareUrl;
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    if (eventId) {
      url.searchParams.set("event", eventId);
    }
    return url.toString();
  };
  const finalShareUrl = getShareUrl();
  const shareText = `Check out: ${eventTitle}\n\n${eventDescription}`;
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(finalShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy link");
    }
  };
  const handleShareTwitter = () => {
    const twitterUrl = new URL("https://twitter.com/intent/tweet");
    twitterUrl.searchParams.set("text", shareText);
    twitterUrl.searchParams.set("url", finalShareUrl);
    window.open(twitterUrl.toString(), "_blank", "width=550,height=420");
  };
  const handleShareDiscord = () => {
    if (discordInvite) {
      window.open(discordInvite, "_blank");
    }
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors text-sm"
        aria-label="Share event"
        title="Share this event"
      >
        <Share2 size={16} />
        Share
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-surface border border-surface-border rounded-lg shadow-lg z-50 min-w-48 overflow-hidden">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            onClick={handleShareTwitter}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left border-t border-surface-border"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.916 6.75h-3.308l7.73-8.835L.424 2.25h6.7l4.67 6.168L17.71 2.25h.534zm-1.169 17.03h1.833L5.75 4.1H3.75l13.525 15.18z" />
            </svg>
            Share on X (Twitter)
          </button>
          {discordInvite && (
            <button
              onClick={handleShareDiscord}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left border-t border-surface-border"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.375-.445.864-.607 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.975 14.975 0 0 0 1.293-2.1a.07.07 0 0 0-.038-.098a13.11 13.11 0 0 1-1.872-.892a.072.072 0 0 1-.007-.12a10.51 10.51 0 0 0 .372-.294a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.098.246.198.373.295a.072.072 0 0 1-.006.119a12.265 12.265 0 0 1-1.873.892a.077.077 0 0 0-.037.099a14.997 14.997 0 0 0 1.294 2.1a.076.076 0 0 0 .084.028a19.963 19.963 0 0 0 6.002-3.03a.079.079 0 0 0 .033-.057c.5-4.782-.838-8.937-3.549-12.634a.06.06 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.948-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.948 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.948-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.948 2.418-2.157 2.418z" />
              </svg>
              Join Discord Server
            </button>
          )}
        </div>
      )}
    </div>
  );
}
