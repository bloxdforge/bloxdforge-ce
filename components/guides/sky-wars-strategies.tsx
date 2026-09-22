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

import { Wind, Axe, Mountain } from "lucide-react";
export default function SkyWarsStrategiesGuide() {
  return (
    <div className="space-y-8 text-gray-300">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. Best Starting Kits</h2>
        <p className="mb-4">Your kit determines your playstyle for the first 30 seconds, which is when most games are won or lost.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <div className="flex items-center gap-2 mb-2 text-text-muted">
              <Wind size={20} />
              <strong className="text-white">The Frog</strong>
            </div>
            <p className="text-xs text-text-muted"><strong>Loadout:</strong> Jump Boost Potions.<br/><strong>Playstyle:</strong> Mobility king. Use the potion immediately to jump between islands without bridging. You can loot 3 chests in the time it takes others to bridge to one.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <div className="flex items-center gap-2 mb-2 text-text-muted">
              <Axe size={20} />
              <strong className="text-white">Lumberjack</strong>
            </div>
            <p className="text-xs text-text-muted"><strong>Loadout:</strong> Stone Axe + Logs.<br/><strong>Playstyle:</strong> The rusher. You start with blocks (logs) and a weapon (axe deals high damage). Bridge instantly to your neighbor and kill them while they are still looting.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <div className="flex items-center gap-2 mb-2 text-text-muted">
              <Mountain size={20} />
              <strong className="text-white">Miner</strong>
            </div>
            <p className="text-xs text-text-muted"><strong>Loadout:</strong> Iron Pickaxe + Stone.<br/><strong>Playstyle:</strong> Fast gearing. Use the pickaxe to mine the ores on your starting island immediately. You can often get full armor before leaving your base.</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. Advanced Bridging Techniques</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-text-muted">
          <li>
            <strong>God-Bridging:</strong> Facing backward and timing your clicks perfectly to place blocks without shifting. High risk, but the fastest way to travel.
          </li>
          <li>
            <strong>Telly Bridging:</strong> A newer technique involving jumping and placing blocks to create a bridged path while maintaining sprint momentum. Requires precise timing.
          </li>
          <li>
            <strong>Ice Bridging:</strong> Placing ice blocks creates a path that is fast for you but dangerous for pursuers, as they might slip off.
          </li>
        </ul>
      </section>
    </div>
  );
}