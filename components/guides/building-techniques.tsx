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

export default function BuildingTechniquesGuide() {
  return (
    <div className="space-y-8 text-gray-300">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. Architectural Design Principles</h2>
        <p className="mb-4">Contemporary construction in Bloxd emphasizes three-dimensional depth variation and sophisticated color palette implementation to achieve professional aesthetic quality.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-text-muted">
          <li><strong className="text-white">Depth and Dimensionality:</strong> Structural facades should incorporate recessed elements and protruding architectural features to eliminate flat surface planes. Window placements should be recessed by a minimum of one block depth to create shadow definition. Pillars, frames, and varied wall depths contribute to visual complexity and architectural interest.</li>
          <li><strong className="text-white">Surface Texturing:</strong> Material variation creates organic appearance and prevents monotonous surfaces. Stone-based structures benefit from random distribution of Cobblestone, Andesite, and Stone Bricks across the surface area. This technique simulates natural weathering and material inconsistency found in authentic architecture.</li>
          <li><strong className="text-white">Color Gradient Implementation:</strong> Vertical color gradients establish visual weight distribution. Foundation elements constructed from darker materials (Blackstone, Dark Prismarine) transitioning to lighter materials at elevated levels (Light Gray Concrete, White Concrete) creates architectural balance. Gradient transitions should span multiple blocks to avoid abrupt color shifts.</li>
          <li><strong className="text-white">Roofing and Upper Structures:</strong> Roof designs should maintain appropriate pitch angles and overhang distances. Staircases and slabs provide angular variation, while contrasting materials distinguish roofing from wall structures. Consider implementing multiple roof tiers for larger constructions.</li>
        </ul>
        <p className="mt-4 text-sm text-text-muted">Advanced builders should study real-world architectural styles and adapt design elements to the block-based medium, maintaining structural coherence while accounting for the game&apos;s geometric constraints.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. Foundation and Structural Planning</h2>
        <p className="mb-4">Proper foundation establishment and preliminary planning prevent structural inconsistencies and facilitate construction efficiency.</p>
        <div className="bg-surface border border-surface-border rounded-xl p-4 mb-4">
          <h3 className="font-bold text-white mb-2">Layout Methodology</h3>
          <p className="text-xs text-text-muted mb-3">Prior to material placement, establish the construction boundaries using temporary marker blocks. This approach allows for dimensional verification and proportional assessment before committing resources to permanent construction. Measure critical distances and confirm symmetry where applicable.</p>
          <h3 className="font-bold text-white mb-2 mt-4">Foundation Depth</h3>
          <p className="text-xs text-text-muted mb-3">Foundations should extend below ground level to create structural realism. A foundation depth of 2-3 blocks below the surface provides adequate visual grounding without excessive resource expenditure. Underground sections can utilize less expensive materials as they remain largely invisible.</p>
          <h3 className="font-bold text-white mb-2 mt-4">Measurement and Symmetry</h3>
          <p className="text-xs text-text-muted">Utilize coordinate displays to ensure precise measurements and maintain symmetry across large-scale projects. Even-numbered dimensions facilitate centered entrance placements and symmetrical feature distribution. Odd-numbered dimensions allow for central elements but complicate bilateral symmetry.</p>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">3. Advanced Scouting Techniques</h2>
        <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg mb-4">
          <p className="text-gray-300 text-xs"><strong>TP-Xray Methodology:</strong> Teleportation-based reconnaissance remains a viable technique for locating concealed underground structures. By establishing a home point and executing teleport commands with specific geometric configurations, players can exploit brief rendering delays to visualize unrendered chunk sections. This technique operates within game mechanics and does not constitute unauthorized modification.</p>
        </div>
        <p className="text-sm text-text-muted mb-4">Alternative reconnaissance methods include systematic excavation patterns, observation of player movement patterns, and analysis of terrain modifications that indicate subsurface construction.</p>
        <h3 className="font-bold text-white mb-2 mt-4">Counter-Intelligence Measures</h3>
        <p className="text-sm text-text-muted"><strong>Anti-Penetration Barriers:</strong> To prevent unauthorized access via lag-clipping or pearl-glitching exploits, defensive structures should incorporate multiple material layers with varying block types (e.g., Obsidian combined with Wood planks). This heterogeneous composition disrupts the physics calculations required for clipping techniques. Additional defensive measures include water curtains and irregular geometry that complicates predictable teleportation targeting.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">4. WorldBuilder Command Utilization</h2>
        <p className="mb-4">Large-scale construction projects benefit significantly from WorldBuilder command implementation. These tools accelerate construction processes while maintaining compliance with platform guidelines.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-surface p-3 rounded border border-surface-border">
            <code className="text-primary font-bold block mb-1">{"//copy & //paste"}</code>
            <span className="text-xs text-text-muted">The fundamental duplication commands for replicating structural segments. Select the source region with the wand tool, execute the copy command, reposition to the target location, and paste. This workflow proves essential for repetitive architectural elements such as columns, wall sections, or decorative patterns.</span>
          </div>
          <div className="bg-surface p-3 rounded border border-surface-border">
            <code className="text-primary font-bold block mb-1">{"//set [block]"}</code>
            <span className="text-xs text-text-muted">Mass fill functionality for selected regions. Exercise caution with large selection volumes to prevent client performance degradation. Recommended maximum selection size varies based on client hardware specifications but generally should not exceed 50,000 blocks per operation.</span>
          </div>
          <div className="bg-surface p-3 rounded border border-surface-border">
            <code className="text-primary font-bold block mb-1">{"//replace [old] [new]"}</code>
            <span className="text-xs text-text-muted">Selective material substitution within the selected region. This command replaces specified block types with alternative materials, facilitating rapid design iteration and material experimentation without reconstruction.</span>
          </div>
          <div className="bg-surface p-3 rounded border border-surface-border">
            <code className="text-primary font-bold block mb-1">{"//undo & //redo"}</code>
            <span className="text-xs text-text-muted">Command history navigation allows reversal of recent operations. These commands prove critical for error correction and experimental modifications. Maintain awareness of undo buffer limitations on specific servers.</span>
          </div>
        </div>
        <p className="text-sm text-text-muted">WorldBuilder commands should complement manual construction rather than replace it entirely. Organic structures and detail work often require individual block placement to achieve optimal aesthetic results.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">5. Interior Design and Detailing</h2>
        <p className="mb-4">Interior spaces require comparable attention to architectural detail as exterior facades. Functional and aesthetic considerations should guide interior design implementation.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-text-muted">
          <li><strong className="text-white">Ceiling Height Variation:</strong> Standard ceiling heights of 3-4 blocks provide adequate vertical space while maintaining comfortable proportions. Large halls and ceremonial spaces benefit from increased ceiling heights (5-7 blocks) to convey scale and grandeur.</li>
          <li><strong className="text-white">Furniture and Fixtures:</strong> Utilize stairs, slabs, trapdoors, and other partial blocks to construct furniture representations. Tables, chairs, and storage solutions add functionality indicators and environmental storytelling elements.</li>
          <li><strong className="text-white">Lighting Integration:</strong> Strategic light source placement prevents hostile entity spawning while maintaining aesthetic appeal. Concealed lighting using trapdoors, carpets, or other cover mechanisms creates ambient illumination without visible light blocks. Maintain minimum light levels of 8 in all inhabited areas.</li>
          <li><strong className="text-white">Floor Patterns:</strong> Alternating material patterns or bordered designs enhance floor visual interest. Carpet layers over base flooring provide color variation and define functional zones within larger spaces.</li>
        </ul>
      </section>
    </div>
  );
}