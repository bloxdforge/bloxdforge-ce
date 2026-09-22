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

export default function CombatPvpStrategiesGuide() {
  return (
    <div className="space-y-8 text-gray-300">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. Technical Stats</h2>
        <p className="mb-4">Combat effectiveness in player-versus-player engagements is determined by comprehensive understanding of hit registration mechanics, damage cooldown intervals, and weapon-specific statistics. The following data represents verified values current as of recent patches.</p>
        <div className="bg-background border border-surface-border rounded-2xl overflow-hidden mb-6">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-hover text-white">
              <tr>
                <th className="p-3">Mechanic</th>
                <th className="p-3">Value</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <tr>
                <td className="p-3 font-medium">Damage Cooldown</td>
                <td className="p-3 font-mono">0.4s</td>
                <td className="p-3 text-xs text-text-muted">Standard server tick rate for damage registration. Attacks executed within this interval do not register additional damage.</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Optimal CPS</td>
                <td className="p-3 font-mono">12 – 16</td>
                <td className="p-3 text-xs text-text-muted">Clicks per second exceeding 16 provide no additional benefit and may reduce accuracy. Target this range for maximum efficiency without wasted inputs.</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Critical Multiplier</td>
                <td className="p-3 font-mono">~30%</td>
                <td className="p-3 text-xs text-text-muted">Critical hits occur when attacking while in downward vertical motion. Damage increase approximately 30% over base damage values.</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Knockback</td>
                <td className="p-3 font-mono">Variable</td>
                <td className="p-3 text-xs text-text-muted">Affected by sprint state, weapon type, and vertical momentum. W-tapping maximizes knockback application.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-background border border-surface-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-hover text-white">
              <tr>
                <th className="p-3">Weapon</th>
                <th className="p-3">Base Dmg</th>
                <th className="p-3">Meta Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <tr>
                <td className="p-3 font-bold text-white">Diamond Sword</td>
                <td className="p-3 font-mono">40</td>
                <td className="p-3 text-xs text-text-muted">Standard PvP weapon providing consistent damage output and reliable performance. Widely accessible and cost-effective for extended engagements.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Knight Sword</td>
                <td className="p-3 font-mono">&gt; 40</td>
                <td className="p-3 text-xs text-text-muted">Superior damage and enhanced knockback properties. Resource investment justified in competitive scenarios requiring maximum combat efficiency.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">The Whip</td>
                <td className="p-3 font-mono">Med</td>
                <td className="p-3 text-xs text-text-muted">Primary utility weapon with 8-block pull range. Lower damage output offset by tactical displacement capabilities. Essential for terrain manipulation strategies.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Axe</td>
                <td className="p-3 font-mono">~35</td>
                <td className="p-3 text-xs text-text-muted">Secondary combat option with reduced damage relative to swords. Primarily utilitarian but viable in early-game encounters or resource-constrained scenarios.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. Fundamental Combat Techniques</h2>
        <p className="mb-4">Mastery of core combat mechanics forms the foundation for advanced PvP performance. The following techniques represent essential skills that should be developed through deliberate practice.</p>
        <ul className="list-disc pl-5 space-y-3 text-sm text-text-muted">
          <li>
            <strong className="text-white">W-Tapping (Sprint Reset):</strong> This technique maximizes knockback application by resetting the sprint state between consecutive attacks. Implementation requires releasing the forward movement key momentarily after each hit, then immediately resuming movement. The sprint reset triggers enhanced knockback multipliers, increasing opponent displacement. Proficient execution maintains offensive pressure while controlling engagement distance.
          </li>
          <li>
            <strong className="text-white">Strafing Patterns:</strong> Lateral movement during combat encounters reduces predictability and complicates opponent targeting. Effective strafing incorporates irregular directional changes rather than simple left-right oscillation. Advanced implementations combine strafing with jump timing to create three-dimensional movement patterns that further increase evasion probability.
          </li>
          <li>
            <strong className="text-white">Critical Hit Timing:</strong> Critical strikes require executing attacks while descending vertically. Optimal execution involves jumping and attacking at the apex of the jump or during the descent phase. Consistent critical hit application significantly increases damage per second (DPS) output. Practice timing to ensure regular critical hits without sacrificing hit accuracy.
          </li>
          <li>
            <strong className="text-white">Block Placement (Defensive):</strong> Rapid block placement creates temporary barriers that absorb damage and disrupt opponent combos. Competent players can place blocks while maintaining attack rhythm, creating windows for healing or strategic repositioning. This technique proves particularly effective when outnumbered or when facing opponents with superior equipment.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">3. Advanced Weapon Combinations</h2>
        <p className="mb-4">The introduction of specialized weapons has created sophisticated combat strategies that leverage weapon-specific properties in coordinated sequences.</p>
        <div className="bg-surface border border-surface-border rounded-xl p-4 mb-4">
          <h3 className="font-bold text-white mb-2">Hook-and-Blade Sequence</h3>
          <p className="text-sm text-text-muted mb-3">The Whip enables a dominant engagement pattern: execute a pull at maximum range (8 blocks), immediately weapon-swap to Knight Sword during the pull animation, and deliver a critical strike as the opponent reaches melee range. The opponent suffers significant knockback from the Knight Sword hit, potentially resetting distance. This cycle can be repeated, creating sustained pressure that opponents struggle to counter without Moonstone Pearl mobility or superior positioning.</p>
          <h3 className="font-bold text-white mb-2 mt-4">Whip-to-Environment Displacement</h3>
          <p className="text-sm text-text-muted mb-3">The Whip&apos;s pull mechanic can redirect opponents into environmental hazards including lava pools, cliff edges, or enclosed spaces. Positioning near hazards and executing pulls at strategic moments converts the Whip from a combat opener into a primary elimination tool. This technique proves exceptionally effective against opponents of equal or superior equipment levels.</p>
          <h3 className="font-bold text-white mb-2 mt-4">Weapon Slot Optimization</h3>
          <p className="text-sm text-text-muted">Hotbar organization significantly impacts weapon swap speed. Position primary combat weapons (Knight Sword, Diamond Sword) in adjacent slots to the Whip to minimize the delay during transitions. Rapid weapon swapping between attacks increases versatility and enables real-time tactical adjustment based on opponent behavior.</p>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">4. Armor and Equipment Optimization</h2>
        <p className="mb-4">Equipment selection and upgrade prioritization directly influence combat survivability and damage output. Resource allocation should follow strategic priorities based on game mode and available resources.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white block mb-2">Armor Progression</strong>
            <p className="text-xs text-text-muted mb-2">Standard progression: Leather, Iron, Diamond, then Netherite. Each tier provides substantial damage reduction improvements. Prioritize chest plate and leggings first, as these slots provide the greatest protection per resource investment.</p>
            <p className="text-xs text-text-subtle italic">Full Diamond armor provides approximately 60% damage reduction against unenhanted weapons.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white block mb-2">Enchantment Priority</strong>
            <p className="text-xs text-text-muted mb-2">Protection enchantments compound with armor base values. Sharpness increases weapon damage output. In resource-limited scenarios, prioritize weapon enchantments over armor enchantments to maximize offensive capability first.</p>
            <p className="text-xs text-text-subtle italic">Sharpness V provides approximately 25% damage increase.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white block mb-2">Shield Usage</strong>
            <p className="text-xs text-text-muted mb-2">Shields provide complete frontal damage negation when raised. Effective shield usage requires anticipating opponent attacks and raising the shield immediately before impact. Note that shields introduce attack delay, creating vulnerability windows if mistimed.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white block mb-2">Consumables</strong>
            <p className="text-xs text-text-muted mb-2">Golden Apples provide temporary health regeneration and absorption. Maintain several in hotbar for emergency healing during extended engagements. Proper timing of consumable usage can reverse losing engagements.</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">5. Tactical Positioning and Terrain Utilization</h2>
        <p className="mb-4">Environmental awareness and strategic positioning provide significant advantages that can offset equipment disparities. Terrain features should be actively incorporated into combat strategy.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-text-muted">
          <li><strong className="text-white">Elevation Advantage:</strong> Higher ground provides increased critical hit opportunity and complicates opponent targeting. When possible, maneuver to secure elevation before engaging. Vertical positioning also increases retreat options.</li>
          <li><strong className="text-white">Chokepoint Control:</strong> Narrow passages limit opponent movement options and negate numerical advantages. When outnumbered, retreat to chokepoints to force sequential rather than simultaneous combat.</li>
          <li><strong className="text-white">Water Combat:</strong> Water reduces movement speed and limits jump height, significantly altering combat dynamics. Lure opponents into water when possessing superior equipment. Avoid water when retreating or when facing multiple opponents.</li>
          <li><strong className="text-white">Escape Route Planning:</strong> Before initiating combat, identify potential retreat paths. Maintain awareness of nearby cover, terrain features, or friendly positions that can be utilized if the engagement becomes disadvantageous.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">6. Multiple Opponent Scenarios</h2>
        <p className="mb-4">Engagements against multiple simultaneous opponents require modified tactics and strategic resource management. Direct confrontation against superior numbers typically results in elimination; alternative approaches improve survival probability.</p>
        <div className="bg-surface border border-surface-border rounded-xl p-4">
          <p className="text-sm text-text-muted mb-3">
            <strong className="text-white">Target Prioritization:</strong> Focus damage on a single opponent to eliminate them quickly rather than distributing damage across multiple targets. Reducing opponent numbers as rapidly as possible decreases total incoming damage and improves combat math.
          </p>
          <p className="text-sm text-text-muted mb-3">
            <strong className="text-white">Mobility and Kiting:</strong> Maintain maximum distance from all opponents while continuing to deal damage. Utilize terrain obstacles to force opponents into single-file approach paths. Pearls and other mobility items become essential in these scenarios.
          </p>
          <p className="text-sm text-text-muted">
            <strong className="text-white">Strategic Retreat:</strong> Recognizing unwinnable engagements and executing tactical retreat preserves equipment and provides opportunity for advantageous re-engagement. Attempting to fight against overwhelming odds typically results in equipment loss without strategic benefit.
          </p>
        </div>
      </section>
    </div>
  );
}