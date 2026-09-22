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

import { Skull, Shield, Zap } from "lucide-react";
export default function InfectionModeStrategiesGuide() {
  return (
    <div className="space-y-8 text-gray-300">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. Zombie Class Stats</h2>
        <p className="mb-4">The zombie faction operates through a class-based system with distinct capabilities and statistical profiles. Following movement speed reductions implemented in recent updates, coordinated class synergy has become increasingly critical for zombie success. Each class maintains specific spawn probability and strategic application.</p>
        <div className="space-y-4">
          <div className="flex gap-4 bg-surface p-4 rounded-xl border border-surface-border">
            <div className="bg-surface p-3 rounded-lg h-fit text-text-muted"><Skull size={20} /></div>
            <div className="flex-1">
              <div className="flex justify-between">
                 <h4 className="font-bold text-white text-sm">The Puker (Epic - 15%)</h4>
                 <span className="text-[10px] text-text-subtle font-mono">100 HP</span>
              </div>
              <p className="text-xs text-text-muted mt-1 leading-relaxed mb-2">
                <strong>Ability:</strong> Acid projectile inflicting Poison II effect.<br/>
                <strong>Range:</strong> Approximately 12 blocks (buffed in recent update).<br/>
                <strong>Cooldown:</strong> 8 seconds between projectile launches.
              </p>
              <p className="text-xs text-text-muted leading-relaxed">
                <strong>Strategic Application:</strong> The extended range following the recent balance adjustment enables harassment of human positions from relative safety. The Poison II debuff prevents health regeneration, maintaining pressure between direct confrontations. Optimal positioning involves maintaining maximum range while coordinating with Tank-class allies who absorb return fire. Puker players should prioritize isolated humans and maintain awareness of projectile trajectory to maximize hit probability.
              </p>
            </div>
          </div>
          <div className="flex gap-4 bg-surface p-4 rounded-xl border border-surface-border">
            <div className="bg-surface p-3 rounded-lg h-fit text-text-muted"><Zap size={20} /></div>
            <div className="flex-1">
              <div className="flex justify-between">
                 <h4 className="font-bold text-white text-sm">The Bomber (Legendary - 5%)</h4>
                 <span className="text-[10px] text-text-subtle font-mono">80 HP</span>
              </div>
              <p className="text-xs text-text-muted mt-1 leading-relaxed mb-2">
                <strong>Ability:</strong> Explosive detonation upon elimination.<br/>
                <strong>Damage Radius:</strong> 4 blocks (knockback reduced in recent patch).<br/>
                <strong>Explosion Damage:</strong> 60-80 HP depending on distance.
              </p>
              <p className="text-xs text-text-muted leading-relaxed">
                <strong>Strategic Application:</strong> The explosive suicide mechanism provides area denial and multi-target damage potential. Recent knockback reduction requires precise positioning directly beneath or adjacent to human targets for reliable damage application. Effective Bomber tactics involve infiltrating human formations and executing self-elimination at optimal positioning. This class excels at breaking fortified positions and punishing clustered human groups. Coordinate with other zombie classes to herd humans into confined spaces before detonation.
              </p>
            </div>
          </div>
          <div className="flex gap-4 bg-surface p-4 rounded-xl border border-surface-border">
            <div className="bg-surface p-3 rounded-lg h-fit text-text-muted"><Shield size={20} /></div>
            <div className="flex-1">
              <div className="flex justify-between">
                 <h4 className="font-bold text-white text-sm">The Tank (Rare - 25%)</h4>
                 <span className="text-[10px] text-text-subtle font-mono">200 HP</span>
              </div>
              <p className="text-xs text-text-muted mt-1 leading-relaxed mb-2">
                <strong>Ability:</strong> Enhanced health pool and melee damage.<br/>
                <strong>Melee Damage:</strong> 48 per hit.<br/>
                <strong>Debuff:</strong> Slowness I effect (permanent).
              </p>
              <p className="text-xs text-text-muted leading-relaxed">
                <strong>Strategic Application:</strong> The Tank functions as frontline absorption, drawing human fire while protecting support-oriented zombie classes. The substantial health pool enables sustained engagement in concentrated fire zones. Despite the Slowness debuff, Tanks should lead coordinated pushes into human defensive positions. Optimal positioning involves body-blocking for Puker and Bomber allies, enabling them to execute their abilities without immediate elimination. Tank players must accept their role as damage absorption rather than pursuing elimination counts.
              </p>
            </div>
          </div>
          <div className="flex gap-4 bg-surface p-4 rounded-xl border border-surface-border">
            <div className="bg-surface p-3 rounded-lg h-fit text-text-muted"><Skull size={20} /></div>
            <div className="flex-1">
              <div className="flex justify-between">
                 <h4 className="font-bold text-white text-sm">Standard Zombie (Common - 55%)</h4>
                 <span className="text-[10px] text-text-subtle font-mono">100 HP</span>
              </div>
              <p className="text-xs text-text-muted mt-1 leading-relaxed mb-2">
                <strong>Ability:</strong> None (base zombie class).<br/>
                <strong>Melee Damage:</strong> 35 per hit.<br/>
                <strong>Movement Speed:</strong> Standard (reduced from previous patches).
              </p>
              <p className="text-xs text-text-muted leading-relaxed">
                <strong>Strategic Application:</strong> The most frequently spawned class, standard zombies provide numerical advantage and should be utilized for flanking maneuvers and multi-directional pressure. While lacking specialized abilities, coordinated standard zombie groups can overwhelm isolated humans through sustained melee pressure. Focus on surrounding targets and attacking from multiple angles simultaneously to prevent focused human defensive fire.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. Zombie Team Coordination</h2>
        <p className="mb-4">Effective zombie gameplay requires coordinated multi-class execution rather than individual action. The following tactical frameworks improve zombie team performance.</p>
        <div className="bg-surface border border-surface-border rounded-xl p-4 mb-4">
          <h3 className="font-bold text-white mb-2">Standard Formation</h3>
          <p className="text-xs text-text-muted mb-3">Tank-class zombies establish the forward line, advancing into human firing positions while absorbing damage. Puker-class zombies maintain positioning 8-12 blocks behind the Tank line, launching acid projectiles over frontline allies. Standard zombies fill gaps and execute flanking movements around the central formation. Bomber-class zombies infiltrate through any breaches created by the formation and detonate within human clusters.</p>
          <h3 className="font-bold text-white mb-2 mt-4">Pincer Movement</h3>
          <p className="text-xs text-text-muted mb-3">Split the zombie force into multiple groups approaching from different vectors. This tactic forces humans to divide their defensive fire and creates breakthrough opportunities. Particularly effective against humans occupying elevated positions or chokepoints, as it prevents them from concentrating fire in a single direction.</p>
          <h3 className="font-bold text-white mb-2 mt-4">Spawn Wave Timing</h3>
          <p className="text-xs text-text-muted">Eliminated zombies respawn at intervals. Coordinate respawn timing to create concentrated attack waves rather than continuous trickle reinforcement. Massed attacks provide numerical advantage that overwhelms defensive positions more effectively than individual zombie arrivals.</p>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">3. Human Counter-Strategies</h2>
        <p className="mb-4">Human survival depends on maximizing defensive advantages and exploiting zombie weaknesses. The following strategies provide optimal defensive frameworks.</p>
        <ul className="list-disc pl-5 space-y-3 text-sm text-text-muted">
          <li>
            <strong className="text-white">Minigun Acquisition:</strong> The final surviving human receives a Minigun with enhanced firing rate and knockback properties. Effective Minigun usage requires controlled burst firing to maintain accuracy while maximizing knockback control. Sustained fire reduces accuracy due to recoil accumulation. Short bursts (1-2 seconds) followed by brief pauses optimize accuracy and ammunition efficiency.
          </li>
          <li>
            <strong className="text-white">Elevation Dominance:</strong> Zombie mobility decreases significantly while jumping or climbing. Elevated positions such as building roofs, hills, or constructed platforms force zombies into predictable approach paths with reduced movement speed. The Airport terminal wing represents an optimal defensive position due to limited zombie approach vectors and clear sightlines. Maintain elevation throughout the match duration.
          </li>
          <li>
            <strong className="text-white">Chokepoint Defense:</strong> Narrow passages limit zombie numerical advantage by forcing sequential rather than simultaneous engagement. Position defenses at doorways, corridors, or constructed barriers with single-block openings. This tactic proves particularly effective against standard zombie rushes but provides limited protection against Puker acid projectiles.
          </li>
          <li>
            <strong className="text-white">Motion Detection:</strong> Monitor peripheral vision for zombie approach indicators. Zombies generate distinct audio cues that provide early warning before visual contact. Awareness of multiple approach vectors prevents flanking eliminations and enables defensive repositioning before being overwhelmed.
          </li>
          <li>
            <strong className="text-white">Ammunition Conservation:</strong> Firing discipline becomes critical in extended matches. Prioritize high-value targets (Bombers approaching the group, Pukers launching acid) over standard zombies at range. Maintain ammunition reserves for emergency situations rather than expending full magazines on distant targets with low hit probability.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">4. Map-Specific Tactics</h2>
        <p className="mb-4">Each Infection mode map features distinct terrain that influences optimal tactical approaches for both factions.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white block mb-2">Airport Terminal</strong>
            <p className="text-xs text-text-muted mb-2"><strong>Human Advantage:</strong> The elevated wing section provides exceptional defensive position with limited zombie approach vectors. Humans should consolidate at this position early and maintain it throughout the match.</p>
            <p className="text-xs text-text-muted"><strong>Zombie Approach:</strong> Coordinate simultaneous attacks from both stairwell approaches. Pukers should target the wing from ground level while standard zombies and Tanks execute the stair assault.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white block mb-2">Urban Streets</strong>
            <p className="text-xs text-text-muted mb-2"><strong>Human Advantage:</strong> Building rooftops provide elevation and multiple escape routes. Humans benefit from mobility between rooftop positions rather than static defense.</p>
            <p className="text-xs text-text-muted"><strong>Zombie Approach:</strong> Control ground-level streets to limit human movement between buildings. Force humans into isolated rooftop positions where they can be surrounded and eliminated sequentially.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white block mb-2">Shopping Mall</strong>
            <p className="text-xs text-text-muted mb-2"><strong>Human Advantage:</strong> The second floor central area provides 360-degree visibility with multiple retreat paths. However, limited elevation makes this position vulnerable to coordinated zombie rushes.</p>
            <p className="text-xs text-text-muted"><strong>Zombie Approach:</strong> Multi-directional assault from all escalator and stairwell access points simultaneously. This map favors zombies due to numerous approach vectors that humans cannot effectively monitor collectively.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white block mb-2">Warehouse Complex</strong>
            <p className="text-xs text-text-muted mb-2"><strong>Human Advantage:</strong> Shipping container stacks create maze-like terrain. Humans should utilize container tops for elevation while maintaining mobility to prevent being trapped.</p>
            <p className="text-xs text-text-muted"><strong>Zombie Approach:</strong> The confined spaces and numerous hiding positions benefit zombie flanking tactics. Standard zombies should utilize container maze complexity to approach undetected before emerging at melee range.</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">5. Advanced Human Survival Techniques</h2>
        <p className="mb-4">Late-game human survival when outnumbered requires sophisticated tactics and environmental awareness.</p>
        <div className="bg-surface border border-surface-border rounded-xl p-4">
          <p className="text-sm text-text-muted mb-3">
            <strong className="text-white">Constant Movement:</strong> Static positioning enables zombies to coordinate multi-directional assaults. Maintain continuous movement between defensive positions, engaging zombies briefly before relocating. This tactic prevents zombie formation establishment and complicates their targeting.
          </p>
          <p className="text-sm text-text-muted mb-3">
            <strong className="text-white">Knockback Management:</strong> All weapons generate knockback that creates temporary distance from zombie threats. Maximize knockback utility by firing at zombies attempting to close distance, thereby maintaining optimal engagement range. Particular attention should be directed at Bomber-class zombies attempting proximity approaches.
          </p>
          <p className="text-sm text-text-muted">
            <strong className="text-white">Equipment Utilization:</strong> Grenades, explosives, and environmental hazards provide area damage that supplements weapon fire. Deploy area damage when zombies cluster together, maximizing efficiency per resource expenditure. Maintain awareness of hazard locations such as elevator shafts or lava pools that can be utilized for zombie elimination through knockback displacement.
          </p>
        </div>
      </section>
    </div>
  );
}