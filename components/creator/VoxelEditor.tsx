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

import { useCallback, useEffect, useRef } from "react";
interface VoxelEditorProps {
  file: File | null;
  onSave: (buffer: ArrayBuffer, name: string) => void;
}
export default function VoxelEditor({ file, onSave }: VoxelEditorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);
  const sentRef = useRef<File | null>(null);
  const sendCurrent = useCallback(() => {
    const iframe = iframeRef.current;
    const target = file;
    if (!iframe?.contentWindow || !target) return;
    target.arrayBuffer().then(buffer => {
      console.log('[voxel-editor] sending:', target.name, buffer.byteLength);
      iframe.contentWindow!.postMessage(
        { type: 'load-model', name: target.name, buffer },
        '*',
        [buffer]
      );
      sentRef.current = target;
    });
  }, [file]);
  useEffect(() => {
    sentRef.current = null;
  }, [file]);
  useEffect(() => {
    if (readyRef.current && file && sentRef.current !== file) {
      sendCurrent();
    }
  }, [file, sendCurrent]);
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === 'vb-ready') {
        console.log('[voxel-editor] vb-ready');
        readyRef.current = true;
        if (file && sentRef.current !== file) sendCurrent();
      }
      if (e.data?.type === 'save-model') {
        console.log('[voxel-editor] received save-model:', e.data.name, e.data.buffer?.byteLength);
        onSave(e.data.buffer, e.data.name);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [file, sendCurrent, onSave]);
  const handleLoad = useCallback(() => {
    if (!file) return;
    setTimeout(() => {
      if (!readyRef.current && file && sentRef.current !== file) {
        console.log('[voxel-editor] fallback send on load');
        sendCurrent();
      }
    }, 3000);
  }, [file, sendCurrent]);
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          src="/vb"
          className="w-full h-full border-none"
          title="Voxel Editor"
          onLoad={handleLoad}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </div>
  );
}