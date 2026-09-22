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

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  Video,
  MapPin,
  Clipboard,
  Maximize2,
  ExternalLink,
  AppWindow,
  ArrowLeft,
  Code2,
  ChevronDown,
  Eye,
  EyeOff
} from "lucide-react";
import DraggableWindow from "@/components/ui/DraggableWindow";
import CoordsContent from "@/components/play/CoordsContent";
import ClipsContent from "@/components/play/ClipsContent";
import WorldToolsClient from "@/app/studio/world-tools/WorldToolsClient";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { clsx } from "clsx";
interface WindowState {
  x: number;
  y: number;
  isOpen: boolean;
}
export default function PlayClient() {
  const searchParams = useSearchParams();
  const isStaging = searchParams.get('staging') === 'true';
  const gameUrl = isStaging ? "https://staging.bloxd.io" : "https://bloxd.io";
  const { renderScale } = useSettingsStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [liteUI, setLiteUI] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [floatingTools, setFloatingTools] = useState<string[]>([]);
  const [windowPositions, setWindowPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [coords, setCoords] = useState<{ name: string; x: string; y: string; z: string }[]>([]);
  const [newCoord, setNewCoord] = useState({ name: '', x: '', y: '', z: '' });
  const [clips, setClips] = useState<string[]>([]);
  const [clipInput, setClipInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    const container = gameContainerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);
  useEffect(() => {
    try {
      const savedCoords = localStorage.getItem('bloxd_coords');
      const savedClips = localStorage.getItem('bloxd_clips');
      const savedWindows = localStorage.getItem('bloxd_window_states');
      if (savedCoords) setCoords(JSON.parse(savedCoords));
      if (savedClips) setClips(JSON.parse(savedClips));
      if (savedWindows) {
        const parsedWindows: Record<string, WindowState> = JSON.parse(savedWindows);
        const openTools = Object.keys(parsedWindows).filter(k => parsedWindows[k].isOpen);
        setFloatingTools(openTools);
        const positions: Record<string, { x: number; y: number }> = {};
        Object.entries(parsedWindows).forEach(([k, v]) => {
          positions[k] = { x: v.x, y: v.y };
        });
        setWindowPositions(positions);
      }
    } catch (e) {
      console.error("Failed to parse data from localStorage", e);
    }
    const hasSeenOnboarding = localStorage.getItem('bloxdforge_play_onboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    } else {
      setIsSidebarOpen(true);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('bloxd_coords', JSON.stringify(coords));
  }, [coords]);
  useEffect(() => {
    localStorage.setItem('bloxd_clips', JSON.stringify(clips));
  }, [clips]);
  const updateWindowState = (id: string, isOpen: boolean, x?: number, y?: number) => {
    try {
      const current = localStorage.getItem('bloxd_window_states');
      const parsed = current ? JSON.parse(current) : {};
      const newState = {
        ...parsed,
        [id]: {
          isOpen,
          x: x !== undefined ? x : (parsed[id]?.x || 100),
          y: y !== undefined ? y : (parsed[id]?.y || 100)
        }
      };
      localStorage.setItem('bloxd_window_states', JSON.stringify(newState));
    } catch (e) {
      console.error(e);
    }
  };
  const finishOnboarding = () => {
    setShowOnboarding(false);
    setIsSidebarOpen(true);
    localStorage.setItem('bloxdforge_play_onboarding', 'true');
  };
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleFloating = (toolId: string) => {
    if (floatingTools.includes(toolId)) {
      setFloatingTools(prev => prev.filter(id => id !== toolId));
      updateWindowState(toolId, false);
    } else {
      setFloatingTools(prev => [...prev, toolId]);
      if (activeTool === toolId) setActiveTool(null);
      updateWindowState(toolId, true);
    }
  };
  const handleWindowDragEnd = (id: string, x: number, y: number) => {
    setWindowPositions(prev => ({ ...prev, [id]: { x, y } }));
    updateWindowState(id, true, x, y);
  };
  const saveCoord = () => {
    if (newCoord.name && newCoord.x) {
      setCoords([...coords, newCoord]);
      setNewCoord({ name: '', x: '', y: '', z: '' });
    }
  };
  const deleteCoord = (index: number) => {
    setCoords(coords.filter((_, i) => i !== index));
  };
  const saveClip = () => {
    if (clipInput) {
      setClips([clipInput, ...clips]);
      setClipInput('');
    }
  };
  const copyClip = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `bloxd-recording-${Date.now()}.webm`;
          a.click();
          URL.revokeObjectURL(url);
          stream.getTracks().forEach(track => track.stop());
        };
        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error starting recording:", err);
      }
    }
  };
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  const iframeWidth = renderScale < 1 ? dimensions.width * renderScale : dimensions.width;
  const iframeHeight = renderScale < 1 ? dimensions.height * renderScale : dimensions.height;
  const iframeZoom = renderScale < 1 ? 1 / renderScale : 1;
  const sidebarContainerClass = clsx(
    "absolute top-0 right-0 h-full w-80 bg-background/90 backdrop-blur-xl border-l border-surface-border shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out z-40",
    isSidebarOpen ? 'translate-x-0' : 'translate-x-full',
    liteUI && !isSidebarOpen ? 'opacity-0' : liteUI ? 'opacity-20 hover:opacity-100' : 'opacity-100'
  );
  const backButtonClass = clsx(
    "absolute top-4 left-4 z-50 p-2 bg-surface/90 backdrop-blur-md border border-surface-border text-white rounded-lg hover:bg-surface-hover transition-all shadow-lg",
    liteUI ? 'opacity-20 hover:opacity-100' : 'opacity-100'
  );
  const toggleButtonClass = clsx(
    "absolute top-4 right-4 z-50 p-2 bg-surface/90 backdrop-blur-md border border-surface-border text-white rounded-lg hover:bg-surface-hover transition-all shadow-lg",
    showOnboarding ? 'ring-4 ring-primary' : '',
    liteUI && !isSidebarOpen ? 'opacity-20 hover:opacity-100' : 'opacity-100'
  );
  const urlOverlayClass = clsx(
    "absolute bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-mono text-text-muted pointer-events-none transition-opacity",
    liteUI ? "opacity-0" : "opacity-100"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ToolAccordion = ({ id, title, icon: Icon, colorClass, children, actionButton, noPadding, isWindowOnly }: any) => {
    const isActive = activeTool === id;
    const isFloating = floatingTools.includes(id);
    const handleHeaderClick = () => {
      if (actionButton) {
        actionButton.onClick();
      } else if (isWindowOnly) {
        toggleFloating(id);
      } else if (!isFloating) {
        setActiveTool(isActive ? null : id);
      }
    };
    return (
      <div className="bg-surface border border-surface-border rounded-xl overflow-hidden transition-all group hover:border-hairline-strong">
        <div
          className="flex items-center justify-between p-3.5 cursor-pointer select-none"
          onClick={handleHeaderClick}
        >
          <div className={`flex items-center gap-3 ${colorClass}`}>
            <Icon size={18} />
            <h3 className="font-bold text-sm text-foreground">{title}</h3>
          </div>
          {actionButton ? (
            <button
              onClick={(e) => { e.stopPropagation(); actionButton.onClick(); }}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${actionButton.active ? 'bg-primary text-white shadow-sm shadow-primary/10' : 'bg-surface-hover border border-surface-border text-gray-300 hover:bg-surface hover:text-white'}`}
            >
              {actionButton.label}
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); toggleFloating(id); }}
                className={clsx("p-1.5 rounded-md transition-colors", isFloating ? colorClass : "text-text-subtle hover:text-white hover:bg-surface")}
                title={isFloating ? "Close floating window" : "Pop out to floating window"}
              >
                <AppWindow size={14} />
              </button>
              {!isWindowOnly && (
                <div className={clsx("p-1 text-text-subtle transition-transform duration-200", isActive && !isFloating && "rotate-180")}>
                  <ChevronDown size={14} />
                </div>
              )}
            </div>
          )}
        </div>
        {!actionButton && !isWindowOnly && isActive && !isFloating && (
          <div className={clsx("border-t border-surface-border bg-[#0a0a0a]", noPadding ? "h-[600px]" : "p-4")}>
            {children}
          </div>
        )}
        {!actionButton && isFloating && (
          <div className="px-4 py-3 border-t border-surface-border bg-[#0a0a0a] text-xs text-text-subtle italic flex justify-center items-center gap-2">
            <AppWindow size={12} /> Opened in floating window
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="fixed inset-0 bg-black overflow-hidden flex">
      {showOnboarding && (
        <div className="absolute inset-0 z-[60] bg-black/80 flex items-center justify-center">
          <div className="bg-background border border-surface-border rounded-2xl p-6 max-w-md text-center animate-in zoom-in-95">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Game Mode</h2>
            <p className="text-text-muted mb-6">You have a powerful sidebar of tools available while you play. Click the arrow icon in the top right to access recording, scripts, coordinates, and more.</p>
            <button onClick={finishOnboarding} className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-all shadow-sm shadow-primary/10">
              Got it, let&apos;s play!
            </button>
          </div>
        </div>
      )}
      {floatingTools.map(toolId => (
        <DraggableWindow
          key={toolId}
          title={toolId === 'coords' ? 'Coordinates' : toolId === 'clip' ? 'Clipboard' : 'World Tools'}
          onClose={() => toggleFloating(toolId)}
          initialX={windowPositions[toolId]?.x || 100}
          initialY={windowPositions[toolId]?.y || 100}
          onDragEnd={(x, y) => handleWindowDragEnd(toolId, x, y)}
          className={toolId === 'script' ? 'w-[90vw] md:w-[850px] h-[80vh] md:h-[650px]' : 'w-80'}
          contentClassName={toolId === 'script' ? 'p-0 h-[calc(100%-41px)] bg-[#0a0a0a] overflow-hidden' : undefined}
        >
          {toolId === 'coords' && (
            <CoordsContent
              coords={coords}
              newCoord={newCoord}
              setNewCoord={setNewCoord}
              onSave={saveCoord}
              onDelete={deleteCoord}
            />
          )}
          {toolId === 'clip' && (
            <ClipsContent
              clips={clips}
              clipInput={clipInput}
              setClipInput={setClipInput}
              onSave={saveClip}
              onCopy={copyClip}
              onDelete={(i) => setClips(clips.filter((_, idx) => idx !== i))}
            />
          )}
          {toolId === 'script' && (
            <div className="w-full h-full relative">
              <WorldToolsClient />
            </div>
          )}
        </DraggableWindow>
      ))}
      <div
        ref={gameContainerRef}
        className="flex-1 relative h-full overflow-hidden bg-black"
        onClick={() => iframeRef.current?.focus()}
      >
        <iframe
          ref={iframeRef}
          src={gameUrl}
          width={iframeWidth > 0 ? `${iframeWidth}px` : '100%'}
          height={iframeHeight > 0 ? `${iframeHeight}px` : '100%'}
          className="border-none block absolute top-0 left-0"
          style={{
            zoom: iframeZoom,
            imageRendering: 'pixelated',
          }}
          allow="fullscreen; microphone; camera; pointer-lock; clipboard-read; clipboard-write"
        />
        <Link
          href="/studio"
          title="Back to Studio"
          className={backButtonClass}
        >
          <ArrowLeft size={20} />
        </Link>
        <div className={urlOverlayClass}>
          <ExternalLink size={10} />
          {gameUrl}
          {isStaging && <span className="text-purple-400 font-bold ml-1">STAGING</span>}
          {renderScale < 1 && <span className="text-yellow-400 font-bold ml-1">{renderScale * 100}% RES</span>}
        </div>
        <button
          onClick={toggleSidebar}
          className={toggleButtonClass}
        >
          {isSidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <div className={sidebarContainerClass}>
        <div className="p-6 h-full overflow-y-auto custom-scrollbar">
          <h2 className="text-xl font-bold text-white mb-6 pt-10">Game Tools</h2>
          <div className="space-y-3">
            <ToolAccordion id="coords" title="Coordinates" icon={MapPin} colorClass="text-primary">
              <CoordsContent coords={coords} newCoord={newCoord} setNewCoord={setNewCoord} onSave={saveCoord} onDelete={deleteCoord} />
            </ToolAccordion>
            <ToolAccordion id="clip" title="Clipboard" icon={Clipboard} colorClass="text-blue-400">
              <ClipsContent clips={clips} clipInput={clipInput} setClipInput={setClipInput} onSave={saveClip} onCopy={copyClip} onDelete={(i) => setClips(clips.filter((_, idx) => idx !== i))} />
            </ToolAccordion>
            <ToolAccordion id="script" title="World Tools" icon={Code2} colorClass="text-green-400" isWindowOnly />
            <ToolAccordion
              id="recorder"
              title="Recorder"
              icon={Video}
              colorClass={isRecording ? "text-red-500" : "text-text-muted"}
              actionButton={{
                label: isRecording ? "Stop" : "Start",
                active: isRecording,
                onClick: toggleRecording
              }}
            />
            <ToolAccordion
              id="focus"
              title="Focus Mode"
              icon={Maximize2}
              colorClass="text-purple-400"
              actionButton={{
                label: "Fullscreen",
                active: false,
                onClick: toggleFullscreen
              }}
            />
            <ToolAccordion
              id="lite"
              title="Lite UI"
              icon={liteUI ? EyeOff : Eye}
              colorClass="text-amber-400"
              actionButton={{
                label: liteUI ? "Enabled" : "Disabled",
                active: liteUI,
                onClick: () => setLiteUI(!liteUI)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
