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

import { ExternalLink } from "lucide-react";
const BLOCKBENCH_URL = "https://web.blockbench.net/";
export default function ExternalTools() {
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      <div className="flex-1 relative bg-[#0a0a0a]">
        <iframe
          src={BLOCKBENCH_URL}
          className="w-full h-full border-none"
          title="Blockbench"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
          <a 
            href={BLOCKBENCH_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur text-white text-xs font-bold rounded-lg hover:bg-primary transition-colors border border-white/10"
          >
            <ExternalLink size={14} /> Open in New Tab
          </a>
        </div>
      </div>
    </div>
  );
}