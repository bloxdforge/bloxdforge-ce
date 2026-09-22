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

import { useState, useCallback, useRef, RefObject } from 'react';
interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
interface UseDragSelectProps {
  containerRef: RefObject<HTMLElement | null>;
  itemRefs: RefObject<HTMLElement[]>;
  onDragUpdate: (idsInBox: Set<string>) => void;
  onDragEnd: (idsInBox: Set<string>) => void;
  onItemClick: (id: string) => void;
  onBackgroundClick: () => void;
}
export function useDragSelect({ 
  containerRef, 
  itemRefs, 
  onDragUpdate, 
  onDragEnd, 
  onItemClick,
  onBackgroundClick 
}: UseDragSelectProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectionBox, setSelectionBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const cachedItemRects = useRef<Map<string, Rect>>(new Map());
  const state = useRef({
    isMouseDown: false,
    didDrag: false,
    startX: 0,
    startY: 0,
    rafId: 0
  });
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0 || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    if (e.clientX >= containerRect.right || e.clientY >= containerRect.bottom) {
        return;
    }
    const x = e.clientX - containerRect.left + containerRef.current.scrollLeft;
    const y = e.clientY - containerRect.top + containerRef.current.scrollTop;
    state.current.isMouseDown = true;
    state.current.didDrag = false;
    state.current.startX = x;
    state.current.startY = y;
    cachedItemRects.current.clear();
    if (itemRefs.current) {
        itemRefs.current.forEach(el => {
            if (el && el.offsetParent) {
                const id = el.dataset.id;
                if (id) {
                    cachedItemRects.current.set(id, {
                        left: el.offsetLeft,
                        top: el.offsetTop,
                        right: el.offsetLeft + el.offsetWidth,
                        bottom: el.offsetTop + el.offsetHeight
                    });
                }
            }
        });
    }
  }, [containerRef, itemRefs]);
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!state.current.isMouseDown || !containerRef.current) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left + containerRef.current.scrollLeft;
    const currentY = e.clientY - rect.top + containerRef.current.scrollTop;
    const dx = Math.abs(currentX - state.current.startX);
    const dy = Math.abs(currentY - state.current.startY);
    if (!state.current.didDrag) {
        if (dx > 5 || dy > 5) {
            state.current.didDrag = true;
            setIsDragging(true);
        } else {
            return;
        }
    }
    if (state.current.rafId) cancelAnimationFrame(state.current.rafId);
    state.current.rafId = requestAnimationFrame(() => {
        const startX = state.current.startX;
        const startY = state.current.startY;
        const x = Math.min(startX, currentX);
        const y = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);
        setSelectionBox({ x, y, width, height });
        const boxRect = {
            left: x, top: y, right: x + width, bottom: y + height
        };
        const idsInBox = new Set<string>();
        cachedItemRects.current.forEach((itemRect, id) => {
            const isIntersecting = boxRect.right >= itemRect.left &&
                                   boxRect.left <= itemRect.right &&
                                   boxRect.bottom >= itemRect.top &&
                                   boxRect.top <= itemRect.bottom;
            if (isIntersecting) {
                idsInBox.add(id);
            }
        });
        onDragUpdate(idsInBox);
    });
  }, [onDragUpdate, containerRef]);
  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!state.current.isMouseDown) return;
    state.current.isMouseDown = false;
    if (state.current.rafId) cancelAnimationFrame(state.current.rafId);
    if (!state.current.didDrag) {
        const target = e.target as HTMLElement;
        const itemElement = target.closest('[data-id]');
        if (itemElement) {
            const id = itemElement.getAttribute('data-id');
            if (id) onItemClick(id);
        } else {
            onBackgroundClick();
        }
    } else {
        const finalIds = new Set<string>();
        const { x, y, width, height } = selectionBox;
        const boxRect = { left: x, top: y, right: x + width, bottom: y + height };
        cachedItemRects.current.forEach((itemRect, id) => {
             if (boxRect.right >= itemRect.left && boxRect.left <= itemRect.right &&
                 boxRect.bottom >= itemRect.top && boxRect.top <= itemRect.bottom) {
                finalIds.add(id);
            }
        });
        onDragEnd(finalIds);
    }
    setIsDragging(false);
    setSelectionBox({ x: 0, y: 0, width: 0, height: 0 });
    state.current.didDrag = false;
    cachedItemRects.current.clear();
  }, [onItemClick, onBackgroundClick, onDragEnd, selectionBox]);
  return { isDragging, selectionBox, handlePointerDown, handlePointerMove, handlePointerUp };
}