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

import { Download, LayoutGrid, Maximize } from "lucide-react";
export default function StarterGuide() {
  return (
    <div className="space-y-8 text-gray-300">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. What is BloxdForge?</h2>
        <p className="mb-4">BloxdForge is the ultimate utility suite for Bloxd.io. It runs directly in your browser but offers powerful desktop-class tools. You can use it to manage texture packs, write scripts with AI, and play the game with overlay tools.</p>
        <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-start gap-4">
          <div className="bg-primary/20 p-2 rounded-lg text-primary shrink-0">
            <Download size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-1">Install as an App</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              BloxdForge is a <strong>Progressive Web App (PWA)</strong>. If you are on Chrome or Edge, look for the &quot;Install&quot; icon in your address bar (or in the 3-dot menu). This lets you run BloxdForge in its own window, launch it from your desktop, and get better performance.
            </p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. The Launcher & Game Overlay</h2>
        <p className="mb-4">The <strong>Launcher</strong> (Play tab) is more than just a game frame. It injects a suite of tools that run <em>alongside</em> your game session.</p>
        <h3 className="font-bold text-white mt-4 mb-2">Key Features</h3>
        <ul className="list-disc pl-5 space-y-2 marker:text-primary text-sm">
          <li>
            <strong>Persistent Windows:</strong> Tools like the <em>Coordinates Manager</em> and <em>Clipboard</em> can be &quot;popped out&quot; into floating windows. BloxdForge remembers exactly where you left them, even if you close the tab.
          </li>
          <li>
            <strong>Session Memory:</strong> Your saved coordinates and clipboard snippets are stored automatically. You won&apos;t lose your base coordinates if you refresh the page.
          </li>
          <li>
            <strong>Recorder:</strong> Capture gameplay clips directly from the browser window without needing external software like OBS.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">3. Customizing Your Studio</h2>
        <p className="mb-4">You can tailor the BloxdForge interface to your needs.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white flex items-center gap-2 mb-2">
              <LayoutGrid size={16} className="text-primary" /> Dashboard Layout
            </strong>
            <p className="text-sm text-text-muted">On the main Studio page, click <strong>&quot;Customize&quot;</strong> to toggle which tools appear on your home screen. Hide the ones you don&apos;t use.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white flex items-center gap-2 mb-2">
              <Maximize size={16} className="text-primary" /> Zoom & Scale
            </strong>
            <p className="text-sm text-text-muted">Use <code>Ctrl +</code> and <code>Ctrl -</code> to scale the UI. The interface is responsive and will adapt to fit more tools on your screen.</p>
          </div>
        </div>
      </section>
    </div>
  );
}