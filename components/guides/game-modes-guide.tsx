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

export default function GameModesGuide() {
  return (
    <div className="space-y-8 text-gray-300">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. The Big 5 (Most Popular)</h2>
        <p className="mb-4">These modes currently dominate the player count.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-text-muted">
          <li><strong className="text-white">Survival (Sandbox):</strong> The classic experience. Gather resources, claim land with Protectors, and raid others.</li>
          <li><strong className="text-white">Bedwars:</strong> 4v4v4v4 tactical PvP. Protect your bed, gather diamonds/emeralds, destroy enemies.</li>
          <li><strong className="text-white">Lucky Blocks Battlegrounds:</strong> Chaotic PvP where breaking blocks grants random OP weapons or spawns traps. Extremely popular for fast fun.</li>
          <li><strong className="text-white">One Block:</strong> Skyblock with a twist. You stand on a single block that regenerates infinitely, giving better resources as you break it.</li>
          <li><strong className="text-white">99 Nights:</strong> A wave-based survival mode. Gather loot during the day, survive hordes of mobs at night. Hardcore difficulty.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. PvP & Shooters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-surface p-3 rounded border border-surface-border">
            <strong className="text-primary">Cube Warfare</strong><br/>
            Third-person shooter with building mechanics. Guns + Walls.
          </div>
          <div className="bg-surface p-3 rounded border border-surface-border">
            <strong className="text-primary">Infection</strong><br/>
            Humans vs Zombies. Zombies have classes (Puker, Tank, Sprinter).
          </div>
          <div className="bg-surface p-3 rounded border border-surface-border">
            <strong className="text-primary">Paintball</strong><br/>
            One-shot kill mechanics with projectile paintballs. Fast reflexes required.
          </div>
          <div className="bg-surface p-3 rounded border border-surface-border">
            <strong className="text-primary">Rocket Spleef</strong><br/>
            Destroy the platform under other players using rocket launchers.
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">3. Parkour & Arcade</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-text-muted">
          <li><strong>Evil Tower:</strong> No checkpoints. One fall means restarting. For masochists.</li>
          <li><strong>Bloxd Hop:</strong> CS:GO style movement parkour. Maintain momentum to clear huge gaps.</li>
          <li><strong>Doodle Cube:</strong> Thematic building competition. Build the word, vote on the best.</li>
          <li><strong>Hide and Seek:</strong> Hide as a literal block in the map.</li>
          <li><strong>Natural Disaster:</strong> Survive randomly generated disasters (Tsunamis, Tornados) on a crumbling map.</li>
        </ul>
      </section>
    </div>
  );
}