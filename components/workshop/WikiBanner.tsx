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

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, X } from "lucide-react";
import { useSettingsStore } from "@/stores/useSettingsStore";
export default function WikiBanner() {
  const { hasDismissedWikiBanner, setHasDismissedWikiBanner } = useSettingsStore();
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted || hasDismissedWikiBanner) return null;
  return (
    <>
      <div className="bg-linear-to-r from-blue-900/20 to-primary/10 border border-white/5 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative pr-10">
        <button 
          onClick={() => setShowModal(true)}
          className="absolute top-2 right-2 p-1.5 text-text-subtle hover:text-white bg-black/20 hover:bg-black/40 rounded-lg transition-colors"
          aria-label="Hide banner"
        >
          <X size={16} />
        </button>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">New to modding?</h3>
            <p className="text-xs text-text-muted">Check out our guides on World Edit, Texturing, and Scripts.</p>
          </div>
        </div>
        <Link 
          href="/studio/wiki" 
          className="whitespace-nowrap px-6 py-2.5 bg-surface-hover hover:bg-surface border border-surface-border rounded-lg text-xs font-bold text-white flex items-center gap-2 transition-colors sm:mr-4"
        >
          Read Guides <ArrowRight size={14} />
        </Link>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <div className="bg-background border border-surface-border rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-white mb-2 text-lg">Hide Banner?</h3>
              You won&apos;t see this banner again, but you can always access the guides from the <strong className="text-foreground">Blogs &amp; Guides</strong> page in the sidebar.
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-6 py-2.5 bg-surface-hover hover:bg-surface text-white text-sm font-bold rounded-lg transition-colors border border-surface-border"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setHasDismissedWikiBanner(true);
                  setShowModal(false);
                }} 
                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg transition-all shadow-sm shadow-primary/10"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
