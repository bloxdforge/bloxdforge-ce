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

import { useRef, useEffect } from "react";
import { X, GripHorizontal, AppWindow } from "lucide-react";
import { clsx } from "clsx";
interface DraggableWindowProps {
  title: string;
  initialX?: number;
  initialY?: number;
  onClose: () => void;
  children: React.ReactNode;
  onDragEnd?: (x: number, y: number) => void;
  className?: string;
  contentClassName?: string;
}
export default function DraggableWindow({ title, initialX = 100, initialY = 100, onClose, children, onDragEnd, className, contentClassName }: DraggableWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const state = useRef({
    isDragging: false,
    currentX: initialX,
    currentY: initialY,
    startX: 0,
    startY: 0
  });
  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.style.transform = `translate(${initialX}px, ${initialY}px)`;
      state.current.currentX = initialX;
      state.current.currentY = initialY;
    }
  }, [initialX, initialY]);
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const header = headerRef.current;
    if (header) {
      header.setPointerCapture(e.pointerId);
      state.current.isDragging = true;
      state.current.startX = e.clientX;
      state.current.startY = e.clientY;
      if (windowRef.current) {
        windowRef.current.style.zIndex = "60";
      }
    }
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!state.current.isDragging || !windowRef.current) return;
    e.preventDefault();
    const dx = e.clientX - state.current.startX;
    const dy = e.clientY - state.current.startY;
    const newX = state.current.currentX + dx;
    const newY = state.current.currentY + dy;
    windowRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
  };
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (state.current.isDragging) {
      state.current.isDragging = false;
      const dx = e.clientX - state.current.startX;
      const dy = e.clientY - state.current.startY;
      state.current.currentX += dx;
      state.current.currentY += dy;
      if (headerRef.current) {
        headerRef.current.releasePointerCapture(e.pointerId);
      }
      if (windowRef.current) {
        windowRef.current.style.zIndex = "50";
      }
      if (onDragEnd) {
        onDragEnd(state.current.currentX, state.current.currentY);
      }
    }
  };
  return (
    <div 
      ref={windowRef}
      style={{ 
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        touchAction: 'none',
        transition: 'none',
        willChange: 'transform'
      }}
      className={clsx(
        "bg-background border border-surface-border rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-white/5",
        className || "w-80"
      )}
    >
      <div 
        ref={headerRef}
        className="bg-surface px-3 py-2.5 flex items-center justify-between cursor-move select-none border-b border-surface-border active:cursor-grabbing active:bg-[#22] transition-colors"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="flex items-center gap-2 text-gray-300 font-bold text-xs pointer-events-none">
          <AppWindow size={14} className="text-text-subtle" />
          {title}
        </div>
        <div className="flex items-center gap-1">
          <GripHorizontal size={14} className="text-text-subtle mr-1 pointer-events-none" />
          <button 
            onClick={onClose} 
            className="text-text-subtle hover:text-white hover:bg-red-500/80 transition-colors p-1 rounded-md"
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={`Close ${title} window`}
          >
            <X size={14} />
          </button>
        </div>
      </div>
      <div className={clsx("overflow-y-auto custom-scrollbar bg-[#0a0a0a]", contentClassName || "p-4 max-h-[350px]")}>
        {children}
      </div>
    </div>
  );
}
