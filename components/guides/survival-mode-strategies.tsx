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

import { ShieldCheck } from "lucide-react";
export default function SurvivalModeStrategiesGuide() {
  return (
    <div className="space-y-8 text-gray-300">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. First Day Priorities</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-text-muted">
          <li><strong>Wood First:</strong> Gather 16 logs immediately. This is enough for a workbench, tools, and a basic door.</li>
          <li><strong>Stone Upgrade:</strong> Don&apos;t linger on wood tools. Dig down 3-4 blocks to find stone and upgrade to a Stone Pickaxe immediately. It speeds up everything.</li>
          <li><strong>Shelter:</strong> Don&apos;t build a house yet. Dig into a hillside. It&apos;s faster and provides materials (stone) instead of costing them (wood).</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. Securing Your Land (Protectors)</h2>
        <p className="mb-4">In Bloxd Survival, other players can grief your base unless you protect it. You need a <strong>Protector</strong> block.</p>
        <div className="bg-surface p-4 rounded-lg border border-surface-border flex gap-4">
          <div className="bg-surface-hover/50 p-3 rounded-lg h-fit text-text-muted">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">The Protector</h4>
            <p className="text-xs text-text-muted mt-1 mb-2">
              This distinct gray block with a cyan aura prevents anyone else from placing or breaking blocks in a specific chunk radius.
            </p>
            <ul className="list-disc pl-4 text-xs text-text-muted space-y-1">
              <li><strong>Recipe:</strong> 2 Diamonds + 1 Stone (Workbench).</li>
              <li><strong>Function:</strong> Protects a set area (Chunk).</li>
              <li><strong>Commands:</strong> Use <code>/protectors</code> to see your active protection list.</li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">3. Setting Home</h2>
        <p className="mb-4">Never explore without setting a spawn point. Beds are useful, but commands are better.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface p-3 rounded border border-surface-border">
            <code className="text-white font-bold block mb-1">/sethome [name]</code>
            <span className="text-xs text-text-muted">Saves your current location. You can have multiple homes! e.g., <code>/sethome mine</code></span>
          </div>
          <div className="bg-surface p-3 rounded border border-surface-border">
            <code className="text-white font-bold block mb-1">/home [name]</code>
            <span className="text-xs text-text-muted">Teleports you back instantly. Great for escaping lava or players.</span>
          </div>
        </div>
      </section>
    </div>
  );
}