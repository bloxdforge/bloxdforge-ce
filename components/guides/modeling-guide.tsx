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

export default function ModelingGuide() {
  return (
    <div className="space-y-8 text-gray-300">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. Technical Limits</h2>
        <p className="mb-4">The Bloxd rendering engine enforces strict performance constraints to ensure compatibility across diverse device specifications, including mobile platforms with limited processing capabilities. Custom item models must adhere to the following technical requirements to achieve approval and proper in-game functionality.</p>
        <div className="bg-background border border-surface-border rounded-2xl overflow-hidden mb-6">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-hover text-white">
              <tr>
                <th className="p-3">Requirement</th>
                <th className="p-3">Limit</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <tr>
                <td className="p-3 font-medium">Polygon Count</td>
                <td className="p-3 text-white">~12,000 Triangles</td>
                <td className="p-3 text-xs text-text-muted">Maximum triangle count for optimal performance. Models exceeding this threshold may experience rendering issues or rejection. Lower-detail models (6,000-8,000 triangles) provide better performance headroom.</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">File Size</td>
                <td className="p-3 text-white">&lt; 2MB (Recommended)</td>
                <td className="p-3 text-xs text-text-muted">Binary glTF (.glb) file size limit. Excessive file sizes increase loading times and may cause mobile device compatibility issues. Texture compression and geometry optimization reduce file size.</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Texture Map</td>
                <td className="p-3">Maximum 1024x1024px</td>
                <td className="p-3 text-xs text-text-muted">Single texture atlas resolution limit. Higher resolutions cause performance degradation. Use 512x512px for simple models. Embedded textures must be compressed appropriately.</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Format</td>
                <td className="p-3">Binary glTF 2.0 (.glb)</td>
                <td className="p-3 text-xs text-text-muted">Only supported format. All model data including meshes, textures, and materials must be embedded in a single .glb file. Separate texture files are not supported.</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Materials</td>
                <td className="p-3">PBR Standard</td>
                <td className="p-3 text-xs text-text-muted">Physically-Based Rendering materials only. Supports base color, metallic, roughness, and normal maps. Complex shader networks are not preserved during import.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-text-muted">Models that violate these constraints will either fail to import or display incorrectly in-game. Test models on lower-end devices when possible to ensure acceptable performance across the player base.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. Blockbench Workflow</h2>
        <p className="mb-4">Blockbench represents the community-standard 3D modeling application for Bloxd custom items. The software provides specialized tools optimized for voxel-based and low-polygon modeling while supporting the required glTF 2.0 export format.</p>
        <div className="bg-surface border border-surface-border rounded-xl p-4 mb-4">
          <h3 className="font-bold text-white mb-2">Project Configuration</h3>
          <p className="text-xs text-text-muted mb-3">Creating a new project in Blockbench requires selecting the <strong>&quot;Generic Model&quot;</strong> format. This format provides unrestricted geometry creation without the constraints imposed by Minecraft-specific formats. Avoid using &quot;Java Block/Item&quot; or &quot;Bedrock Model&quot; formats as these impose limitations incompatible with Bloxd requirements.</p>
          <h3 className="font-bold text-white mb-2 mt-4">Geometry Construction</h3>
          <p className="text-xs text-text-muted mb-3">Blockbench operates on a cube-primitive workflow where models are constructed from rectangular cuboid elements. Each cube can be positioned, scaled, and rotated independently. For organic shapes, utilize small cube elements to approximate curved surfaces. The software automatically triangulates cube geometry during export, so the displayed cube count does not directly correspond to the final triangle count.</p>
          <h3 className="font-bold text-white mb-2 mt-4">UV Mapping and Texturing</h3>
          <p className="text-xs text-text-muted mb-3">Blockbench provides automatic UV unwrapping for cube-based geometry. Access the UV panel to review texture mapping and make adjustments. Create a texture atlas in the Paint tab, ensuring the resolution does not exceed 1024x1024 pixels. Each cube face can be painted individually, or external texture files can be imported. Ensure all texture data is embedded in the final export rather than externally referenced.</p>
          <h3 className="font-bold text-white mb-2 mt-4">Export Configuration</h3>
          <p className="text-xs text-text-muted">Navigate to File &gt; Export &gt; Export glTF Model. Select the <strong>Binary (.glb)</strong> option, not the separate .gltf format. Verify that &quot;Embed Textures&quot; is enabled to ensure the texture atlas is included in the binary file. The resulting .glb file should contain all model data in a single package ready for Bloxd import.</p>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">3. Optimization Techniques</h2>
        <p className="mb-4">Efficient polygon utilization maximizes visual quality while maintaining performance requirements. The following optimization strategies reduce triangle counts without significant visual degradation.</p>
        <ul className="list-disc pl-5 space-y-3 text-sm text-text-muted">
          <li>
            <strong className="text-white">Backface Culling Awareness:</strong> Faces oriented away from the camera are not rendered. Interior faces that are never visible can be deleted or merged without visual impact. This technique proves particularly effective for hollow objects or models with concealed internal geometry.
          </li>
          <li>
            <strong className="text-white">Level of Detail Consideration:</strong> Bloxd items are typically viewed at small screen sizes (as held items or dropped world items). Extremely fine details that are imperceptible at typical viewing distances represent wasted polygon budget. Simplify small features and consolidate adjacent elements where appropriate.
          </li>
          <li>
            <strong className="text-white">Cube Consolidation:</strong> Multiple small cubes occupying the same axis-aligned space can often be merged into fewer, larger cubes. This reduces the total element count and simplifies the model structure without altering the visual appearance.
          </li>
          <li>
            <strong className="text-white">Texture-Based Detail:</strong> Surface details such as engravings, patterns, or color variations should be implemented through texture mapping rather than geometric modeling. A normal map can simulate surface relief without additional geometry, providing visual complexity at minimal performance cost.
          </li>
          <li>
            <strong className="text-white">Symmetry Optimization:</strong> Utilize mirroring techniques during modeling to reduce creation time, then selectively add asymmetric details after establishing the base form. This ensures symmetrical elements maintain consistent polygon density.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">4. Animation Constraints</h2>
        <p className="mb-4">The Bloxd engine supports limited animation functionality for custom models. Understanding these constraints prevents development of incompatible animation systems.</p>
        <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg mb-4">
          <p className="text-gray-300 text-xs mb-2"><strong>Current Limitation:</strong> The Bloxd rendering pipeline does not currently support skeletal animation or vertex animation for custom item models. Animated textures and shader-based effects are similarly unsupported.</p>
          <p className="text-gray-300 text-xs">All animation data embedded in glTF files will be ignored during import. Custom items render as static meshes regardless of animation data presence. Model creators should focus on optimizing the static pose appearance rather than developing animation systems.</p>
        </div>
        <p className="text-sm text-text-muted">Future engine updates may introduce animation support. Monitor official development announcements for capability expansions. When animation support is implemented, existing static models will likely require manual conversion to utilize the new functionality.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">5. Material and Texture Best Practices</h2>
        <p className="mb-4">Proper material configuration ensures custom models render as intended across different device specifications and lighting conditions.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white block mb-2">Base Color/Albedo</strong>
            <p className="text-xs text-text-muted">The primary texture map defining surface color. Ensure adequate contrast and avoid excessively dark or bright values that may display poorly under varying in-game lighting. Recommended value range: 30-220 RGB for most surfaces.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white block mb-2">Metallic Properties</strong>
            <p className="text-xs text-text-muted">Defines reflective behavior. Full metallic (1.0) creates mirror-like reflections appropriate for metal surfaces. Non-metallic (0.0) for fabric, wood, or organic materials. Avoid intermediate values unless simulating specific material types.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white block mb-2">Roughness Mapping</strong>
            <p className="text-xs text-text-muted">Controls surface smoothness and specular highlight distribution. High roughness (0.8-1.0) creates matte surfaces. Low roughness (0.0-0.3) produces glossy, polished appearances. Texture variation in roughness maps adds visual interest.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white block mb-2">Normal Mapping</strong>
            <p className="text-xs text-text-muted">Simulates surface details through lighting calculations without additional geometry. Normal maps enable the appearance of engravings, seams, or surface imperfections at zero polygon cost. Ensure normal maps are generated in tangent space for proper rendering.</p>
          </div>
        </div>
        <p className="text-sm text-text-muted">Test materials under various in-game lighting conditions (daylight, torchlight, shadow) to ensure consistent visual quality. Some material configurations may appear incorrect under specific lighting scenarios.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">6. Testing and Validation</h2>
        <p className="mb-4">Systematic testing prevents common issues that may cause model rejection or in-game display problems.</p>
        <div className="bg-surface border border-surface-border rounded-xl p-4 mb-4">
          <h3 className="font-bold text-white mb-2">Pre-Upload Validation</h3>
          <p className="text-xs text-text-muted mb-3">
            <strong>File Size Check:</strong> Verify the .glb file size remains under 2MB. If exceeded, reduce texture resolution or simplify geometry.<br/>
            <strong>Triangle Count:</strong> Use Blockbench&apos;s statistics panel or external glTF viewers to confirm polygon count remains below 12,000 triangles.<br/>
            <strong>Texture Embedding:</strong> Open the .glb file in a glTF viewer (e.g., online validators) to confirm textures display correctly without external dependencies.
          </p>
          <h3 className="font-bold text-white mb-2 mt-4">In-Game Testing</h3>
          <p className="text-xs text-text-muted mb-3">
            After successful upload, test the custom item in multiple contexts:<br/>
            • Held first-person view (verify proportions and positioning)<br/>
            • Third-person view on player model (check scale and orientation)<br/>
            • Dropped item entity (confirm visibility and collision)<br/>
            • Various lighting conditions (daylight, shadow, artificial light)
          </p>
          <h3 className="font-bold text-white mb-2 mt-4">Common Issues</h3>
          <p className="text-xs text-text-muted">
            <strong>Black/Missing Textures:</strong> Texture not properly embedded. Re-export with &quot;Embed Textures&quot; enabled.<br/>
            <strong>Incorrect Orientation:</strong> Model rotated improperly. Adjust rotation in Blockbench before export.<br/>
            <strong>Excessive Brightness:</strong> Improper metallic/roughness values. Review PBR material settings.<br/>
            <strong>Performance Issues:</strong> Polygon count too high. Optimize geometry and reduce triangle count.
          </p>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">7. Alternative Software Options</h2>
        <p className="mb-4">While Blockbench represents the recommended workflow, alternative 3D modeling applications can be utilized with appropriate export configuration.</p>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white block mb-2">Blender</strong>
            <p className="text-xs text-text-muted mb-2">Professional-grade open-source modeling application. Provides significantly more powerful modeling tools than Blockbench but requires steeper learning curve. Blender natively supports glTF 2.0 export with proper configuration. Enable &quot;glTF Binary (.glb)&quot; format and ensure all textures are embedded via the export options panel.</p>
            <p className="text-xs text-text-subtle italic">Recommended for complex organic models or when precise polygon optimization is required.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white block mb-2">Maya/3ds Max</strong>
            <p className="text-xs text-text-muted mb-2">Professional commercial applications. Require glTF export plugins to generate compatible formats. These applications provide industry-standard modeling tools but impose licensing costs and significant complexity for simple item creation.</p>
            <p className="text-xs text-text-subtle italic">Only recommended for users already proficient with these platforms.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <strong className="text-white block mb-2">Web-Based Editors</strong>
            <p className="text-xs text-text-muted mb-2">Various browser-based 3D editors support glTF export. These provide accessibility advantages but typically offer limited feature sets compared to desktop applications. Verify export format compatibility before investing significant modeling time.</p>
          </div>
        </div>
      </section>
    </div>
  );
}