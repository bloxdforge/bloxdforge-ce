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

export default function BedwarsStrategiesGuide() {
  return (
    <div className="space-y-8 text-gray-300">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. Bed Defense Meta</h2>
        <p className="mb-4">The current meta emphasizes layered defensive structures to maximize protection against hostile infiltration. With the introduction of Ranked 4v4 matchmaking, defensive planning has become essential for competitive success.</p>
        <div className="bg-background border border-surface-border rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-surface-border pb-2">
            <span className="font-bold text-white">1. Core Layer</span>
            <span className="text-xs bg-surface text-gray-300 px-2 py-1 rounded">Obsidian / End Stone</span>
          </div>
          <p className="text-xs text-text-muted"><strong>Obsidian</strong> (8 Diamonds) or <strong>End Stone</strong> provides the primary blast resistance against Moonstone Explosives. This material forms the critical innermost barrier and should be prioritized in defensive construction.</p>
          <div className="flex items-center justify-between border-b border-surface-border pb-2 pt-2">
            <span className="font-bold text-white">2. Tool-Switch Layer</span>
            <span className="text-xs bg-surface text-gray-300 px-2 py-1 rounded">Wood</span>
          </div>
          <p className="text-xs text-text-muted">Wood planks force attackers to switch from Shears or Pickaxes to an Axe, creating a delay that provides defenders with additional response time. This layer exploits the tool efficiency mechanics to create tactical disadvantage for infiltrators.</p>
          <div className="flex items-center justify-between pt-2">
            <span className="font-bold text-white">3. Outer Shell</span>
            <span className="text-xs bg-surface text-gray-300 px-2 py-1 rounded">Wool</span>
          </div>
          <p className="text-xs text-text-muted">The exterior wool layer serves as visual obfuscation, preventing attackers from identifying the core defensive materials until they have committed to the breach attempt. Multiple wool colors can be employed to create additional confusion regarding structural composition.</p>
        </div>
        <p className="mt-4 text-sm text-text-muted">Advanced defensive configurations may incorporate additional layers such as slabs or trapdoors to further complicate breach attempts. Defenders should regularly assess and reinforce weak points in the defensive perimeter.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. Resource Management and Economy</h2>
        <p className="mb-4">Efficient resource allocation is fundamental to establishing both defensive superiority and offensive capacity. Generator upgrades should be prioritized according to the following hierarchy:</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-text-muted">
          <li>
            <strong className="text-white">Iron Forge Upgrades:</strong> Initial upgrades to iron generation provide the economic foundation for consistent equipment acquisition and bed defense construction.
          </li>
          <li>
            <strong className="text-white">Team Upgrades:</strong> Sharpened Swords and Reinforced Armor provide permanent combat advantages that compound throughout the match duration.
          </li>
          <li>
            <strong className="text-white">Diamond Collection:</strong> Secondary generator control is critical. Teams should establish defensive positions near diamond generators to deny enemy access while securing resources for obsidian and specialized equipment.
          </li>
        </ul>
        <p className="mt-4 text-sm text-text-muted">Resource distribution among team members should follow strategic roles. Dedicated defenders require obsidian and construction materials, while offensive players benefit from combat equipment and mobility items such as Moonstone Pearls.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">3. Weapon Meta</h2>
        <p className="mb-4">Combat efficiency relies on understanding weapon mechanics and implementing proven engagement techniques.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-text-muted">
          <li>
            <strong className="text-white">The Whip:</strong> This utility weapon provides significant tactical versatility with an effective range of 8 blocks. Primary applications include displacing attackers from bridge approaches and neutralizing opponents positioned at elevation advantages. The pull mechanic can be utilized to redirect enemies into environmental hazards or teammate positioning.
          </li>
          <li>
            <strong className="text-white">W-Tapping:</strong> Sprint resetting between consecutive strikes remains the optimal technique for maximizing knockback distance. This mechanic functions by interrupting the sprint state momentarily to reset knockback multipliers, effectively increasing opponent displacement per hit.
          </li>
          <li>
            <strong className="text-white">Knight Sword:</strong> The superior damage output and enhanced knockback properties of the Knight Sword justify the resource investment in competitive scenarios. This weapon should be prioritized for frontline combatants.
          </li>
          <li>
            <strong className="text-white">Block Placement:</strong> Defensive block placement during combat encounters provides critical damage mitigation. Competent players should practice placing blocks while maintaining offensive pressure to create temporary barriers during health disadvantages.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">4. Offensive Strategies and Rushing</h2>
        <p className="mb-4">Offensive operations require coordinated timing and strategic resource allocation to maximize success probability.</p>
        <div className="bg-surface border border-surface-border rounded-xl p-4 mb-4">
          <h3 className="font-bold text-white mb-2">Early Game Rush</h3>
          <p className="text-xs text-text-muted mb-3">Immediate aggression can exploit defensive vulnerabilities before opponents establish fortified positions. This strategy requires rapid iron collection and minimal equipment investment, typically an iron sword and basic armor. Target selection should prioritize isolated or undefended beds.</p>
          <h3 className="font-bold text-white mb-2 mt-4">Mid-Game Pressure</h3>
          <p className="text-xs text-text-muted mb-3">Once initial defenses are established, coordinated pressure on secondary objectives (diamond generators, neighboring bases) creates strategic advantages. The Split Rush strategy proves particularly effective: two players execute offensive operations while two maintain base security and resource generation.</p>
          <h3 className="font-bold text-white mb-2 mt-4">Late Game Elimination</h3>
          <p className="text-xs text-text-muted">In extended matches, resource accumulation enables acquisition of specialized equipment including Moonstone Explosives and enhanced armor. Systematic elimination of remaining opponents requires methodical base sieging and spawn point control.</p>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">5. Team Coordination in Ranked 4v4</h2>
        <p className="mb-4">Ranked matchmaking emphasizes coordinated team execution over individual mechanical skill. Effective teams implement the following organizational structures:</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-text-muted">
          <li>
            <strong className="text-white">Role Assignment:</strong> Designate specific responsibilities (base defense, resource collection, offensive pressure) to individual team members based on their proficiencies.
          </li>
          <li>
            <strong className="text-white">Communication Protocols:</strong> Establish callouts for enemy movements, resource availability, and defensive breaches. Verbal communication significantly increases defensive response efficiency and offensive coordination.
          </li>
          <li>
            <strong className="text-white">Spawn Point Management:</strong> Following bed destruction, controlling the opponent spawn location becomes the priority. Position team members to intercept respawning opponents before they can re-equip or retreat.
          </li>
          <li>
            <strong className="text-white">Backup Equipment:</strong> Maintain reserve equipment stores in secondary locations to facilitate rapid re-engagement following eliminations. This reduces downtime and maintains consistent team presence.
          </li>
        </ul>
      </section>
    </div>
  );
}