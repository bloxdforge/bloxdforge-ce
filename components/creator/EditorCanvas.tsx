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

import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { hexToRgb, adjustBrightness, rgbToHex } from "@/lib/pixel-utils";
import { ToolType } from "./Toolbar";
export interface EditorCanvasApi {
  save: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  copySelection: () => void;
  startPaste: () => void;
  cancelPaste: () => void;
  clearSelection: () => void;
  selectClipboardSlot: (index: number) => void;
  deleteClipboardSlot: (index: number) => void;
}
interface EditorCanvasProps {
  file: File | null;
  cachedData: ImageData | null;
  tool: ToolType;
  color: string;
  brushSize: number;
  lightenDarkenIntensity: number;
  fillMode: 'fill' | 'unfill';
  onColorPick: (color: string) => void;
  onEdit: (data: ImageData) => void;
  onFileDrop: (file: File) => void;
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
  onSelectionStateChange?: (state: { hasSelection: boolean; hasClipboard: boolean; isPasting: boolean; clipboardSlots: { previewUrl: string; width: number; height: number }[]; activeClipboardIndex: number; }) => void;
  isMobile?: boolean;
}
const EditorCanvas = React.memo(forwardRef<EditorCanvasApi, EditorCanvasProps>(({ 
  file, 
  cachedData,
  tool, 
  color,
  brushSize,
  lightenDarkenIntensity,
  fillMode,
  onColorPick, 
  onEdit,
  onFileDrop,
  onHistoryChange,
  onSelectionStateChange,
  isMobile = false
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [scale, setScale] = useState(25);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastDrawPoint, setLastDrawPoint] = useState<{x: number, y: number} | null>(null);
  const [shapeStartPoint, setShapeStartPoint] = useState<{x: number, y: number} | null>(null);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [textureDims, setTextureDims] = useState({ w: 16, h: 16 });
  const [hoverPos, setHoverPos] = useState<{x: number, y: number} | null>(null);
  const [selectionStart, setSelectionStart] = useState<{x: number, y: number} | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{x: number, y: number} | null>(null);
  const [clipboardSlots, setClipboardSlots] = useState<{ data: ImageData; previewUrl: string }[]>([]);
  const [activeClipboardIndex, setActiveClipboardIndex] = useState(-1);
  const [isPasting, setIsPasting] = useState(false);
  const [pastePos, setPastePos] = useState<{x: number, y: number} | null>(null);
  const clipboardData = clipboardSlots[activeClipboardIndex]?.data ?? null;
  const pasteDataUrl = clipboardSlots[activeClipboardIndex]?.previewUrl ?? null;
  const addToClipboard = useCallback((imageData: ImageData) => {
    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = imageData.width;
    previewCanvas.height = imageData.height;
    const pctx = previewCanvas.getContext('2d');
    if (pctx) {
      pctx.putImageData(imageData, 0, 0);
      const previewUrl = previewCanvas.toDataURL();
      setClipboardSlots(prev => [{ data: imageData, previewUrl }, ...prev].slice(0, 8));
      setActiveClipboardIndex(0);
    }
  }, []);
  useEffect(() => {
    onHistoryChange?.(historyIndex > 0, historyIndex < history.length - 1);
  }, [historyIndex, history, onHistoryChange]);
  const saveToHistory = useCallback((imageData: ImageData) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      if (newHistory.length > 30) newHistory.shift();
      return [...newHistory, imageData];
    });
    setHistoryIndex(prev => {
      const newIndex = prev < 30 ? prev + 1 : 30;
      return newIndex;
    });
  }, [historyIndex]);
  const applyImageData = useCallback((imageData: ImageData) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, textureDims.w, textureDims.h);
    ctx.putImageData(imageData, 0, 0);
    onEdit(imageData);
  }, [ctx, textureDims, onEdit]);
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      applyImageData(history[newIndex]);
    }
  }, [historyIndex, history, applyImageData]);
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      applyImageData(history[newIndex]);
    }
  }, [historyIndex, history, applyImageData]);
  const copySelection = useCallback(() => {
    if (!selectionStart || !selectionEnd || !ctx) return;
    const x0 = Math.min(selectionStart.x, selectionEnd.x);
    const y0 = Math.min(selectionStart.y, selectionEnd.y);
    const w = Math.abs(selectionEnd.x - selectionStart.x) + 1;
    const h = Math.abs(selectionEnd.y - selectionStart.y) + 1;
    if (w > 0 && h > 0) {
      addToClipboard(ctx.getImageData(x0, y0, w, h));
      setIsPasting(true);
      setPastePos(null);
    }
  }, [selectionStart, selectionEnd, ctx, addToClipboard]);
  const startPaste = useCallback(() => {
    if (activeClipboardIndex < 0) return;
    setIsPasting(true);
    setPastePos(null);
  }, [activeClipboardIndex]);
  const cancelPaste = useCallback(() => {
    setIsPasting(false);
    setPastePos(null);
  }, []);
  const selectClipboardSlot = useCallback((index: number) => {
    if (index >= 0 && index < clipboardSlots.length) {
      setActiveClipboardIndex(index);
      setIsPasting(true);
      setPastePos(null);
    }
  }, [clipboardSlots.length]);
  const deleteClipboardSlot = useCallback((index: number) => {
    setClipboardSlots(prev => prev.filter((_, i) => i !== index));
    setActiveClipboardIndex(prev => {
      if (prev === index) return -1;
      if (prev > index) return prev - 1;
      return prev;
    });
    setIsPasting(false);
    setPastePos(null);
  }, []);
  const clearSelection = useCallback(() => {
    setSelectionStart(null);
    setSelectionEnd(null);
  }, []);
  useImperativeHandle(ref, () => ({
    save: () => {
      if (!canvasRef.current || !file) return;
      canvasRef.current.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = file.name;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    },
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    copySelection,
    startPaste,
    cancelPaste,
    clearSelection,
    selectClipboardSlot,
    deleteClipboardSlot,
  }), [file, undo, redo, historyIndex, history, copySelection, startPaste, cancelPaste, clearSelection, selectClipboardSlot, deleteClipboardSlot]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (selectionStart && selectionEnd && ctx) {
          e.preventDefault();
          const x0 = Math.min(selectionStart.x, selectionEnd.x);
          const y0 = Math.min(selectionStart.y, selectionEnd.y);
          const w = Math.abs(selectionEnd.x - selectionStart.x) + 1;
          const h = Math.abs(selectionEnd.y - selectionStart.y) + 1;
          if (w > 0 && h > 0) {
            addToClipboard(ctx.getImageData(x0, y0, w, h));
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (activeClipboardIndex >= 0 && clipboardSlots[activeClipboardIndex]) {
          e.preventDefault();
          setIsPasting(true);
          setPastePos(null);
        }
      } else if (e.key === 'Escape') {
        if (isPasting) {
          setIsPasting(false);
          setPastePos(null);
        } else if (selectionStart) {
          setSelectionStart(null);
          setSelectionEnd(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectionStart, selectionEnd, ctx, activeClipboardIndex, clipboardSlots, isPasting, addToClipboard]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (context) {
      context.imageSmoothingEnabled = false;
      setCtx(context);
    }
  }, []);
  useEffect(() => {
    if (!ctx) return;
    if (cachedData) {
      setTextureDims({ w: cachedData.width, h: cachedData.height });
      ctx.canvas.width = cachedData.width;
      ctx.canvas.height = cachedData.height;
      ctx.putImageData(cachedData, 0, 0);
      centerCanvas(cachedData.width, cachedData.height);
      setHistory([cachedData]);
      setHistoryIndex(0);
      return;
    }
    if (!file) {
      ctx.clearRect(0, 0, textureDims.w, textureDims.h);
      setHistory([]);
      setHistoryIndex(-1);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const w = img.width;
      const h = img.height;
      setTextureDims({ w, h });
      ctx.canvas.width = w;
      ctx.canvas.height = h;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const initialData = ctx.getImageData(0, 0, w, h);
      onEdit(initialData);
      centerCanvas(w, h);
      setHistory([initialData]);
      setHistoryIndex(0);
    };
    img.src = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, ctx]);
  const centerCanvas = (w: number, h: number) => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const fitScale = Math.min(clientWidth, clientHeight) / (Math.max(w, h) * 1.5);
      const newScale = Math.max(Math.min(fitScale, 50), 0.1);
      setScale(newScale);
      setPan({
        x: (clientWidth - w * newScale) / 2,
        y: (clientHeight - h * newScale) / 2
      });
    }
  };
  const getPixelCoords = (e: React.MouseEvent) => {
    if (!containerRef.current) return { x: -1, y: -1 };
    const rect = containerRef.current.getBoundingClientRect();
    const containerX = e.clientX - rect.left;
    const containerY = e.clientY - rect.top;
    const x = Math.floor((containerX - pan.x) / scale);
    const y = Math.floor((containerY - pan.y) / scale);
    return { x, y };
  };
  const drawPixelDirect = useCallback((x: number, y: number) => {
    if (!ctx) return;
    if (x < 0 || y < 0 || x >= textureDims.w || y >= textureDims.h) return;
    const [r, g, b] = hexToRgb(color);
    ctx.fillStyle = `rgba(${r},${g},${b},1)`;
    ctx.clearRect(x, y, 1, 1);
    ctx.fillRect(x, y, 1, 1);
  }, [ctx, color, textureDims]);
  const drawBrushSquare = useCallback((cx: number, cy: number, size: number) => {
    if (!ctx) return;
    const offset = Math.floor(size / 2);
    const [r, g, b] = hexToRgb(color);
    ctx.fillStyle = `rgba(${r},${g},${b},1)`;
    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        const px = cx - offset + dx;
        const py = cy - offset + dy;
        if (px < 0 || py < 0 || px >= textureDims.w || py >= textureDims.h) continue;
        ctx.clearRect(px, py, 1, 1);
        ctx.fillRect(px, py, 1, 1);
      }
    }
  }, [ctx, color, textureDims]);
  const eraseBrushSquare = useCallback((cx: number, cy: number, size: number) => {
    if (!ctx) return;
    const offset = Math.floor(size / 2);
    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        const px = cx - offset + dx;
        const py = cy - offset + dy;
        if (px < 0 || py < 0 || px >= textureDims.w || py >= textureDims.h) continue;
        ctx.clearRect(px, py, 1, 1);
      }
    }
  }, [ctx, textureDims]);
  const adjustBrushSquare = useCallback((cx: number, cy: number, size: number, amount: number) => {
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, textureDims.w, textureDims.h);
    const data = imageData.data;
    const offset = Math.floor(size / 2);
    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        const px = cx - offset + dx;
        const py = cy - offset + dy;
        if (px < 0 || py < 0 || px >= textureDims.w || py >= textureDims.h) continue;
        const i = (py * textureDims.w + px) * 4;
        const a = data[i + 3];
        if (a === 0) continue;
        const [nR, nG, nB] = adjustBrightness(data[i], data[i + 1], data[i + 2], amount);
        data[i] = nR;
        data[i + 1] = nG;
        data[i + 2] = nB;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [ctx, textureDims]);
  const floodFill = useCallback((startX: number, startY: number) => {
    if (!ctx) return;
    if (startX < 0 || startY < 0 || startX >= textureDims.w || startY >= textureDims.h) return;
    const imageData = ctx.getImageData(0, 0, textureDims.w, textureDims.h);
    const data = imageData.data;
    const startIndex = (startY * textureDims.w + startX) * 4;
    const targetR = data[startIndex];
    const targetG = data[startIndex + 1];
    const targetB = data[startIndex + 2];
    const targetA = data[startIndex + 3];
    const [fillR, fillG, fillB] = hexToRgb(color);
    const fillA = 255;
    if (targetR === fillR && targetG === fillG && targetB === fillB && targetA === fillA) {
      return;
    }
    const stack = [[startX, startY]];
    const width = textureDims.w;
    const height = textureDims.h;
    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      const idx = (cy * width + cx) * 4;
      if (
        data[idx] === targetR &&
        data[idx + 1] === targetG &&
        data[idx + 2] === targetB &&
        data[idx + 3] === targetA
      ) {
        data[idx] = fillR;
        data[idx + 1] = fillG;
        data[idx + 2] = fillB;
        data[idx + 3] = fillA;
        if (cx > 0) stack.push([cx - 1, cy]);
        if (cx < width - 1) stack.push([cx + 1, cy]);
        if (cy > 0) stack.push([cx, cy - 1]);
        if (cy < height - 1) stack.push([cx, cy + 1]);
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [ctx, textureDims, color]);
  const floodUnfill = useCallback((startX: number, startY: number) => {
    if (!ctx) return;
    if (startX < 0 || startY < 0 || startX >= textureDims.w || startY >= textureDims.h) return;
    const imageData = ctx.getImageData(0, 0, textureDims.w, textureDims.h);
    const data = imageData.data;
    const startIndex = (startY * textureDims.w + startX) * 4;
    const targetR = data[startIndex];
    const targetG = data[startIndex + 1];
    const targetB = data[startIndex + 2];
    const targetA = data[startIndex + 3];
    if (targetA === 0) return;
    const stack = [[startX, startY]];
    const width = textureDims.w;
    const height = textureDims.h;
    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      const idx = (cy * width + cx) * 4;
      if (
        data[idx] === targetR &&
        data[idx + 1] === targetG &&
        data[idx + 2] === targetB &&
        data[idx + 3] === targetA
      ) {
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
        data[idx + 3] = 0;
        if (cx > 0) stack.push([cx - 1, cy]);
        if (cx < width - 1) stack.push([cx + 1, cy]);
        if (cy > 0) stack.push([cx, cy - 1]);
        if (cy < height - 1) stack.push([cx, cy + 1]);
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [ctx, textureDims]);
  const drawRect = useCallback((x0: number, y0: number, x1: number, y1: number) => {
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    for (let x = minX; x <= maxX; x++) {
        drawPixelDirect(x, minY);
        drawPixelDirect(x, maxY);
    }
    for (let y = minY; y <= maxY; y++) {
        drawPixelDirect(minX, y);
        drawPixelDirect(maxX, y);
    }
  }, [drawPixelDirect]);
  const drawCircle = useCallback((x0: number, y0: number, x1: number, y1: number) => {
    const r = Math.round(Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)));
    let x = 0;
    let y = r;
    let d = 3 - 2 * r;
    const drawCirclePixels = (xc: number, yc: number, px: number, py: number) => {
        drawPixelDirect(xc + px, yc + py);
        drawPixelDirect(xc - px, yc + py);
        drawPixelDirect(xc + px, yc - py);
        drawPixelDirect(xc - px, yc - py);
        drawPixelDirect(xc + py, yc + px);
        drawPixelDirect(xc - py, yc + px);
        drawPixelDirect(xc + py, yc - px);
        drawPixelDirect(xc - py, yc - px);
    };
    while (y >= x) {
        drawCirclePixels(x0, y0, x, y);
        x++;
        if (d > 0) {
            y--;
            d = d + 4 * (x - y) + 10;
        } else {
            d = d + 4 * x + 6;
        }
    }
  }, [drawPixelDirect]);
  const drawTriangle = useCallback((x0: number, y0: number, x1: number, y1: number) => {
    const xc = Math.round((x0 + x1) / 2);
    const topY = Math.min(y0, y1);
    const bottomY = Math.max(y0, y1);
    const drawEdge = (ax: number, ay: number, bx: number, by: number) => {
      const steps = Math.max(Math.abs(bx - ax), Math.abs(by - ay));
      for (let s = 0; s <= steps; s++) {
        const px = Math.round(ax + ((bx - ax) * s) / Math.max(1, steps));
        const py = Math.round(ay + ((by - ay) * s) / Math.max(1, steps));
        drawPixelDirect(px, py);
      }
    };
    drawEdge(xc, topY, Math.min(x0, x1), bottomY);
    drawEdge(xc, topY, Math.max(x0, x1), bottomY);
    drawEdge(Math.min(x0, x1), bottomY, Math.max(x0, x1), bottomY);
  }, [drawPixelDirect]);
  const drawPixel = useCallback((x: number, y: number) => {
    if (!ctx) return;
    if (x < 0 || y < 0 || x >= textureDims.w || y >= textureDims.h) return;
    const imageData = ctx.getImageData(0, 0, textureDims.w, textureDims.h);
    const i = (y * textureDims.w + x) * 4;
    if (tool === 'picker') {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const a = imageData.data[i + 3];
      if (a > 0) onColorPick(rgbToHex(r, g, b));
      return;
    }
    if (tool === 'pencil') {
      if (brushSize === 1) {
        drawPixelDirect(x, y);
      } else {
        drawBrushSquare(x, y, brushSize);
      }
    } else if (tool === 'eraser') {
      if (brushSize === 1) {
        ctx.clearRect(x, y, 1, 1);
      } else {
        eraseBrushSquare(x, y, brushSize);
      }
    } else if (tool === 'lighten' || tool === 'darken') {
      const amount = (tool === 'lighten' ? 1 : -1) * (lightenDarkenIntensity / 50);
      if (brushSize === 1) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];
        if (a === 0) return;
        const [nR, nG, nB] = adjustBrightness(r, g, b, amount);
        ctx.fillStyle = `rgba(${nR},${nG},${nB},${a / 255})`;
        ctx.clearRect(x, y, 1, 1);
        ctx.fillRect(x, y, 1, 1);
      } else {
        adjustBrushSquare(x, y, brushSize, amount);
      }
    }
  }, [ctx, tool, onColorPick, textureDims, drawPixelDirect, drawBrushSquare, eraseBrushSquare, adjustBrushSquare, brushSize, lightenDarkenIntensity]);
  const drawLine = useCallback((x0: number, y0: number, x1: number, y1: number) => {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    while (true) {
      drawPixel(x0, y0);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  }, [drawPixel]);
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.shiftKey) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    } else if (e.button === 0) {
      const { x, y } = getPixelCoords(e);
      if (isPasting && clipboardData && x >= 0 && y >= 0 && x < textureDims.w && y < textureDims.h) {
        const pasteX = x - Math.floor(clipboardData.width / 2);
        const pasteY = y - Math.floor(clipboardData.height / 2);
        ctx!.putImageData(clipboardData, pasteX, pasteY);
        const newState = ctx!.getImageData(0, 0, textureDims.w, textureDims.h);
        saveToHistory(newState);
        onEdit(newState);
        return;
      }
      if (tool === 'marquee') {
        setSelectionStart({ x, y });
        setSelectionEnd({ x, y });
        setIsDrawing(true);
        setIsPasting(false);
        setPastePos(null);
        if (ctx) {
          setSnapshot(ctx.getImageData(0, 0, textureDims.w, textureDims.h));
        }
        return;
      }
      if (tool === 'fill') {
        if (x < 0 || y < 0 || x >= textureDims.w || y >= textureDims.h) return;
        if (fillMode === 'unfill') {
          floodUnfill(x, y);
        } else {
          floodFill(x, y);
        }
        if (ctx) {
          const newState = ctx.getImageData(0, 0, textureDims.w, textureDims.h);
          saveToHistory(newState);
          onEdit(newState);
        }
        return;
      }
      setIsDrawing(true);
      if (tool === 'rect' || tool === 'circle' || tool === 'triangle') {
        setShapeStartPoint({ x, y });
        if (ctx) {
          setSnapshot(ctx.getImageData(0, 0, textureDims.w, textureDims.h));
        }
      } else {
        setLastDrawPoint({ x, y });
        drawPixel(x, y);
      }
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastPanPoint.x;
      const dy = e.clientY - lastPanPoint.y;
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    } else if (isPasting) {
      const { x, y } = getPixelCoords(e);
      setPastePos({ x, y });
    } else if (isDrawing && tool === 'marquee') {
      const { x, y } = getPixelCoords(e);
      setSelectionEnd({ x: Math.max(0, Math.min(x, textureDims.w - 1)), y: Math.max(0, Math.min(y, textureDims.h - 1)) });
      if (ctx && snapshot && selectionStart) {
        ctx.putImageData(snapshot, 0, 0);
      }
    } else if (isDrawing && tool !== 'picker' && tool !== 'fill') {
      const { x, y } = getPixelCoords(e);
      setHoverPos({ x, y });
      if (tool === 'rect' || tool === 'circle' || tool === 'triangle') {
        if (ctx && snapshot && shapeStartPoint) {
          ctx.putImageData(snapshot, 0, 0);
          if (tool === 'rect') {
            drawRect(shapeStartPoint.x, shapeStartPoint.y, x, y);
          } else if (tool === 'circle') {
            drawCircle(shapeStartPoint.x, shapeStartPoint.y, x, y);
          } else {
            drawTriangle(shapeStartPoint.x, shapeStartPoint.y, x, y);
          }
        }
      } else {
        if (lastDrawPoint) {
          drawLine(lastDrawPoint.x, lastDrawPoint.y, x, y);
        } else {
          drawPixel(x, y);
        }
        setLastDrawPoint({ x, y });
      }
    } else if (!isDrawing && brushSize > 1) {
      const { x, y } = getPixelCoords(e);
      const brushTools: ToolType[] = ['pencil', 'eraser', 'lighten', 'darken'];
      if (brushTools.includes(tool)) {
        setHoverPos({ x, y });
      }
    }
  };
  const handleMouseUp = () => {
    setIsPanning(false);
    if (isDrawing) {
      setIsDrawing(false);
      setLastDrawPoint(null);
      if (tool === 'marquee') {
        setShapeStartPoint(null);
        setSnapshot(null);
        const start = selectionStart;
        const end = selectionEnd;
        if (ctx && start && end) {
          const x0 = Math.min(start.x, end.x);
          const y0 = Math.min(start.y, end.y);
          const w = Math.abs(end.x - start.x) + 1;
          const h = Math.abs(end.y - start.y) + 1;
          if (w > 0 && h > 0) {
            addToClipboard(ctx.getImageData(x0, y0, w, h));
            setIsPasting(true);
            setPastePos(null);
          }
        }
        return;
      }
      setShapeStartPoint(null);
      setSnapshot(null);
      if (ctx && tool !== 'picker' && tool !== 'fill') {
        const newState = ctx.getImageData(0, 0, textureDims.w, textureDims.h);
        saveToHistory(newState);
        onEdit(newState);
      }
    }
  };
  const handleMouseLeave = () => {
    handleMouseUp();
    setHoverPos(null);
  };
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault(); 
      e.stopPropagation();
      if (e.ctrlKey || true) {
        const zoomSensitivity = 0.005;
        const delta = -e.deltaY * zoomSensitivity;
        const newScale = Math.min(Math.max(scale * (1 + delta), 0.1), 100);
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const scaleRatio = newScale / scale;
        const newPanX = mouseX - (mouseX - pan.x) * scaleRatio;
        const newPanY = mouseY - (mouseY - pan.y) * scaleRatio;
        setPan({ x: newPanX, y: newPanY });
        setScale(newScale);
      } else {
        setPan(prev => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY
        }));
      }
    };
    container.addEventListener("wheel", wheelHandler, { passive: false });
    return () => container.removeEventListener("wheel", wheelHandler);
  }, [scale, pan]);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  useEffect(() => {
    const hasSelection = !!(selectionStart && selectionEnd);
    if (onSelectionStateChange) {
      onSelectionStateChange({
        hasSelection,
        hasClipboard: clipboardSlots.length > 0,
        isPasting,
        clipboardSlots: clipboardSlots.map(s => ({ previewUrl: s.previewUrl, width: s.data.width, height: s.data.height })),
        activeClipboardIndex,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!(selectionStart && selectionEnd), clipboardSlots.length, isPasting, activeClipboardIndex, onSelectionStateChange]);
  useEffect(() => {
    if (tool !== 'marquee') {
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  }, [tool]);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'image/png') {
        onFileDrop(droppedFile);
      }
    }
  };
  return (
    <div 
      ref={containerRef}
      className="flex-1 bg-[#0a0a0a] overflow-hidden relative cursor-crosshair h-full select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onContextMenu={(e) => e.preventDefault()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px)`,
          width: textureDims.w * scale,
          height: textureDims.h * scale,
          imageRendering: 'pixelated',
        }}
        className="relative shadow-2xl"
      >
        <div 
          className="absolute inset-0 z-0"
          style={{
             backgroundImage: `
              linear-gradient(45deg, #ccc 25%, transparent 25%), 
              linear-gradient(-45deg, #ccc 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #ccc 75%), 
              linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
            backgroundSize: `${scale}px ${scale}px`,
            backgroundPosition: `0 0, 0 ${scale/2}px, ${scale/2}px -${scale/2}px, -${scale/2}px 0px`,
            backgroundColor: 'white'
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 w-full h-full block"
          style={{ imageRendering: 'pixelated' }}
        />
        {gridEnabled && scale > 8 && (
          <div 
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.2) 1px, transparent 1px)`,
              backgroundSize: `${scale}px ${scale}px`
            }}
          />
        )}
        {hoverPos && brushSize > 1 && (tool === 'pencil' || tool === 'eraser' || tool === 'lighten' || tool === 'darken') && (
          <div
            className="absolute z-30 pointer-events-none border border-white/70"
            style={{
              left: (hoverPos.x - Math.floor(brushSize / 2)) * scale,
              top: (hoverPos.y - Math.floor(brushSize / 2)) * scale,
              width: brushSize * scale,
              height: brushSize * scale,
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.4)'
            }}
          />
        )}
        {selectionStart && selectionEnd && (
          <div
            className="absolute z-25 pointer-events-none border border-dashed border-white"
            style={{
              left: Math.min(selectionStart.x, selectionEnd.x) * scale,
              top: Math.min(selectionStart.y, selectionEnd.y) * scale,
              width: (Math.abs(selectionEnd.x - selectionStart.x) + 1) * scale,
              height: (Math.abs(selectionEnd.y - selectionStart.y) + 1) * scale,
              backgroundColor: 'rgba(255,255,255,0.08)',
            }}
          />
        )}
        {selectionStart && selectionEnd && (
          <div
            className="absolute z-40 flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/20"
            style={{
              left: Math.min(selectionStart.x, selectionEnd.x) * scale,
              top: Math.min(selectionStart.y, selectionEnd.y) * scale - 28,
              transform: 'translateY(-100%)',
            }}
          >
            {isPasting ? (
              <>
                <span className="text-[10px] text-white/80 font-medium whitespace-nowrap">Click to place</span>
                <button
                  onClick={(e) => { e.stopPropagation(); cancelPaste(); }}
                  className="ml-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] text-white/80 font-bold transition-colors"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); copySelection(); }}
                  className="px-2 py-0.5 rounded bg-primary/80 hover:bg-primary text-[10px] font-bold text-white transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                  className="p-0.5 rounded hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                  title="Deselect"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </>
            )}
          </div>
        )}
        {isPasting && clipboardData && pastePos && pasteDataUrl && (
          <div
            className="absolute z-35 pointer-events-none"
            style={{
              left: (pastePos.x - Math.floor(clipboardData.width / 2)) * scale,
              top: (pastePos.y - Math.floor(clipboardData.height / 2)) * scale,
              width: clipboardData.width * scale,
              height: clipboardData.height * scale,
              opacity: 0.6,
              imageRendering: 'pixelated',
              backgroundImage: `url(${pasteDataUrl})`,
              backgroundSize: '100% 100%',
              outline: '2px solid rgba(255,255,255,0.5)',
              outlineOffset: '1px',
            }}
          />
        )}
      </div>
      {!isMobile && (
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-gray-300 border border-white/10 z-50 pointer-events-none">
          {textureDims.w}x{textureDims.h} • {scale < 1 ? scale.toFixed(1) : Math.round(scale)}x Zoom
          <span className="ml-2 text-text-subtle">|</span>
          <span className="ml-2 text-text-muted">
            {isPasting ? 'Click to place • Esc to cancel' : 
             tool === 'marquee' ? 'Drag to select region' :
             'Hold Shift + Drag to Pan'}
          </span>
        </div>
      )}
      <button 
        onClick={() => setGridEnabled(!gridEnabled)}
        className={`absolute bottom-4 right-4 px-3 py-1.5 rounded-lg text-xs font-bold border z-50 ${gridEnabled ? 'bg-primary text-white border-primary' : 'bg-black/60 text-text-muted border-white/10'}`}
      >
        {isMobile ? (gridEnabled ? 'Grid ON' : 'Grid OFF') : `Grid ${gridEnabled ? 'ON' : 'OFF'}`}
      </button>
    </div>
  );
}));
EditorCanvas.displayName = 'EditorCanvas';
export default EditorCanvas;