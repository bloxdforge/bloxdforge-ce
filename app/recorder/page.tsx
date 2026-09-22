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

import { useState, useRef } from "react";
import { Video } from "lucide-react";
export default function RecorderPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startRecording = async () => {
    setError(null);
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
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      stream.getVideoTracks()[0]?.addEventListener("ended", () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Screen share was cancelled.");
      } else {
        setError("Failed to start recording. Check browser permissions.");
      }
      console.error("Recording error:", err);
    }
  };
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };
  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col p-4">
      <div className="bg-background border border-surface-border rounded-2xl p-5 w-full max-w-sm mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <Video size={18} className={isRecording ? "text-red-400" : "text-text-subtle"} />
          <h3 className="font-bold text-sm text-foreground">Recorder</h3>
        </div>
        {error && (
          <div className="bg-surface border border-surface-border rounded-lg p-3 mb-4 text-xs text-text-muted">
            {error}
          </div>
        )}
        <p className="text-xs text-text-subtle mb-4">
          Record your screen as a .webm file. Select a tab or window when prompted.
        </p>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-full font-bold text-xs rounded-lg py-2.5 transition-colors ${
            isRecording
              ? "bg-surface border border-surface-border text-gray-300 hover:bg-surface-hover"
              : "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/10"
          }`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
    </div>
  );
}