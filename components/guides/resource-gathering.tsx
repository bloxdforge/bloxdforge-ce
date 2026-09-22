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

export default function ResourceGatheringGuide() {
  return (
    <div className="space-y-8 text-gray-300">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. Mining Y-Ranges</h2>
        <p className="mb-4">Efficient resource acquisition requires precise vertical positioning. Unlike other games, Bloxd.io distribution often relies on specific hard-coded levels or unique vertical bands. Use the <code>P</code> menu to ensure your coordinates are visible.</p>
        <div className="bg-background border border-surface-border rounded-2xl overflow-hidden mb-6">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-hover text-white">
              <tr>
                <th className="p-3">Resource</th>
                <th className="p-3">Y-Level Range</th>
                <th className="p-3">Technical Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <tr>
                <td className="p-3 font-bold text-white">Moonstone</td>
                <td className="p-3 font-mono">Y = -85</td>
                <td className="p-3 text-xs text-text-muted"><strong>Single-Level Spawn.</strong> Moonstone spawns exclusively at Y = -85. It does not appear higher or lower. Mine at Y = -86 to expose the Moonstone layer at eye-level.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Diamond</td>
                <td className="p-3 font-mono">Y = -86 to -99</td>
                <td className="p-3 text-xs text-text-muted">Peak concentration is found just below the Moonstone layer. Diamonds often generate in small clusters within 15 blocks of Moonstone deposits.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Gold</td>
                <td className="p-3 font-mono">Y = -70 to -99</td>
                <td className="p-3 text-xs text-text-muted">Common in deep layers. Often mined as a byproduct while searching for Diamonds and Moonstone.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Iron</td>
                <td className="p-3 font-mono">Y = -15 to -80</td>
                <td className="p-3 text-xs text-text-muted">General utility metal. Distributed widely but vanishes as you approach the bottom-most void layers.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Coal</td>
                <td className="p-3 font-mono">Y = 40 to -60</td>
                <td className="p-3 text-xs text-text-muted">Found both in surface mountains and shallow caves. The primary fuel source for early-game progression.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-text-muted">Note: Copper and Emerald ores do not naturally generate in Bloxd.io Survival/Sandbox worlds and have been excluded from this guide.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. Mining Strategy</h2>
        <div className="bg-surface border border-surface-border rounded-xl p-4 mb-4">
          <h3 className="font-bold text-white mb-2">The Moonstone-First Method</h3>
          <p className="text-xs text-text-muted mb-3">Since Moonstone is restricted to a single layer (Y=-85), it acts as a landmark for high-value mining. Dig a main tunnel at Y=-86. Every block above you in that tunnel has a chance to be Moonstone. Once found, explore the immediate 5-10 blocks below that location for Diamond veins.</p>
          <h3 className="font-bold text-white mb-2 mt-4">Tool Efficiency</h3>
          <p className="text-xs text-text-muted mb-3">
            <strong>Fortune:</strong> Multiplies drops for Coal, Diamond, and Moonstone. This is the highest priority enchantment for maximizing yield.
          </p>
          <p className="text-xs text-text-muted">
            <strong>Unbreaking:</strong> Essential for long-term mining sessions. Bloxd.io tools have finite durability that scales with material tier (Wood to Diamond).
          </p>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">3. Buff Foods & Biomes</h2>
        <p className="mb-4">Consumables in Bloxd provide unique status effects. These items are typically found in specific tree-heavy biomes.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <div className="flex justify-between mb-2">
              <strong className="text-white">Coconut</strong>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase font-bold">Speed</span>
            </div>
            <p className="text-xs text-text-muted">Dropped by <strong>Fruity Palm Leaves</strong> in Jungle biomes. Throw it to crack it, then eat the Cracked Coconut for an 8-second speed boost.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <div className="flex justify-between mb-2">
              <strong className="text-white">Plum</strong>
              <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded uppercase font-bold">Damage</span>
            </div>
            <p className="text-xs text-text-muted">Dropped by <strong>Fruity Plum Leaves</strong> in Plum Forests. Grants 8 seconds of increased melee damage.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <div className="flex justify-between mb-2">
              <strong className="text-white">Pear</strong>
              <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded uppercase font-bold">Defense</span>
            </div>
            <p className="text-xs text-text-muted">Dropped by <strong>Fruity Pear Leaves</strong> in Pear Forests. Grants 13 seconds of damage reduction. Re-eating resets the timer.</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">4. Agriculture & Water</h2>
        <p className="mb-4">Sustainable resource production relies on understanding soil and hydration mechanics.</p>
        <div className="bg-surface border border-surface-border rounded-xl p-4 mb-4">
          <h3 className="font-bold text-white mb-2">Hydration Radius</h3>
          <p className="text-xs text-text-muted mb-3">One water source block hydrates farmland in a <strong>4-block radius</strong> in all horizontal directions. A single water block can support a 9x9 field of crops.</p>
          <h3 className="font-bold text-white mb-2 mt-4">Water Sourcing</h3>
          <p className="text-xs text-text-muted">In dry biomes, locate a <strong>Fat Cactus</strong>. Right-clicking a Fat Cactus with a Bucket provides a Water Bucket, making it a critical renewable resource for desert farming.</p>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">5. The Shop Economy</h2>
        <p className="mb-4">Since there is no NPC trading system like villagers, Bloxd.io uses <strong>Shopkeepers</strong> for its economy.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-text-muted">
          <li><strong>Base Trade:</strong> Standard shops allow you to sell raw resources (like Coal or Iron) for Gold Coins.</li>
          <li><strong>Utility Purchases:</strong> Gold Coins can be used to buy items otherwise difficult to find, such as specific seeds or building materials.</li>
          <li><strong>Spawn Access:</strong> Most public lobbies have a centralized shop at the spawn point coordinates (0, 0).</li>
        </ul>
      </section>
    </div>
  );
}