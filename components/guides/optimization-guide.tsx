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

import { Monitor, Power } from "lucide-react";
export default function OptimizationGuide() {
  return (
    <div className="space-y-8 text-gray-300">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. BloxdForge Performance Mode</h2>
        <p className="mb-4">If you are playing on a Chromebook or an older laptop, the BloxdForge Studio itself can use up system resources. We have built-in settings to minimize this impact.</p>
        <div className="grid gap-4">
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white flex items-center gap-2 mb-2">
              <Power size={18} /> Eco Mode
            </strong>
            <p className="text-sm text-text-muted">Found in <strong>Settings &gt; General</strong>. Turning this on instantly disables all UI animations, blurs, and shadows. It makes the interface look simpler but frees up CPU/GPU power for the game.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white flex items-center gap-2 mb-2">
              <Monitor size={18} /> Low Resolution Game
            </strong>
            <p className="text-sm text-text-muted">Also in Settings. This forces the embedded game iframe to render at 50% resolution and scale up. This offers a massive FPS boost at the cost of visual clarity.</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. In-Game Graphics Settings</h2>
        <p className="mb-4">Within Bloxd.io (Press P), adjust these specific values for the best results:</p>
        <div className="bg-background border border-surface-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-hover text-white">
              <tr>
                <th className="p-3">Setting</th>
                <th className="p-3">Recommendation</th>
                <th className="p-3">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <tr>
                <td className="p-3 font-medium">Horizontal Chunk Load Distance</td>
                <td className="p-3">2 - 4</td>
                <td className="p-3 text-white">Very High</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Show Fog</td>
                <td className="p-3">Unchecked (Off)</td>
                <td className="p-3 text-white">Medium</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Pixel Scale</td>
                <td className="p-3">0.5x - 1x</td>
                <td className="p-3 text-white">Very High</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Anti-Aliasing</td>
                <td className="p-3">Unchecked</td>
                <td className="p-3 text-white">Medium</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">3. Browser Tips</h2>
        <ul className="list-disc pl-5 space-y-2 marker:text-primary">
          <li>
            <strong>Hardware Acceleration:</strong> Ensure this is ENABLED in your browser settings (chrome://settings/system).
          </li>
          <li>
            <strong>Close Tabs:</strong> BloxdForge is a heavy application. Close YouTube or other streaming tabs while playing.
          </li>
          <li>
            <strong>Install the App:</strong> Installing BloxdForge as a PWA (Desktop App) can sometimes offer better performance than running it inside a browser tab with other extensions active.
          </li>
        </ul>
      </section>
    </div>
  );
}