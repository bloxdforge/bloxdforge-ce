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

import { Check, X } from "lucide-react";
export default function WhyChooseBloxdForge() {
  return (
    <div className="space-y-8 text-gray-300">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Why you should choose BloxdForge: Feature Comparison</h2>
        <p className="mb-4">
          When exploring tools for Bloxd.io creation and gameplay, you&apos;ll find several platforms available, each with their own approach and feature set. BloxdForge, Bloxdhub, and Bloxdium are three of the most well-known options in the community.
        </p>
        <p className="mb-4">
          This guide provides a detailed comparison of features across these platforms to help you understand what each one offers. Whether you&apos;re a texture artist, script writer, builder, or casual player, different tools serve different needs. We&apos;ve focused on the features that matter most to creators and players based on our codebase and publicly available information about the other platforms.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Feature Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-surface-border text-sm">
            <thead>
              <tr className="bg-background">
                <th className="p-2 border border-surface-border text-left">Feature</th>
                <th className="p-2 border border-surface-border text-center">BloxdForge</th>
                <th className="p-2 border border-surface-border text-center">Bloxdhub</th>
                <th className="p-2 border border-surface-border text-center">Bloxdium</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-surface-border">Progressive Web App (PWA)</td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-yellow-400">-<sup>1</sup></td>
              </tr>
              <tr>
                <td className="p-2 border border-surface-border">Texture Pack Creator</td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
              </tr>
              <tr>
                <td className="p-2 border border-surface-border">Remix Texture Packs</td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
              </tr>
              <tr>
                <td className="p-2 border border-surface-border">Browse &amp; Download Community Assets (textures, scripts, builds)</td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
              </tr>
              <tr>
                <td className="p-2 border border-surface-border">Personalised Recommendations</td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
              </tr>
              <tr>
                <td className="p-2 border border-surface-border">Live Schematic Rendering Engine</td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
              </tr>
              <tr>
                <td className="p-2 border border-surface-border">Live Texture Pack Preview</td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
              </tr>
              <tr>
                <td className="p-2 border border-surface-border">Script Editor with Syntax Highlighting</td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
              </tr>
              <tr>
                <td className="p-2 border border-surface-border">AI-assisted Scripting</td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
              </tr>
              <tr>
                <td className="p-2 border border-surface-border">Bloxd Launcher with QoL Features</td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
              </tr>
              <tr>
                <td className="p-2 border border-surface-border">Bloxd API Documentation Viewer</td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-yellow-400">-<sup>2</sup></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
              </tr>
              <tr>
                <td className="p-2 border border-surface-border">3D model (GLB) Support</td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
              </tr>
              <tr>
                <td className="p-2 border border-surface-border">Community Feedback</td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
              </tr>
              <tr>
                <td className="p-2 border border-surface-border">Comprehensive In-app Blogs &amp; Guides</td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-green-400"><Check size={14} className="inline" /></td>
                <td className="p-2 border border-surface-border text-center text-red-400"><X size={14} className="inline" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-text-muted">
          <strong>Legend:</strong> <span className="text-green-400"><Check size={12} className="inline" /></span> = Feature available, <span className="text-red-400"><X size={12} className="inline" /></span> = Feature not available, <span className="text-yellow-400">-</span> = Special case (see footnote)
        </p>
        <div className="mt-4 text-sm text-text-muted space-y-2">
          <p><sup>1</sup> Bloxdium does not officially offer a Progressive Web App.</p>
          <p><sup>2</sup> Bloxdhub provides API documentation, though it appears to be a customized version that may not reflect the latest official specifications.</p>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Understanding the Features</h2>
        <p className="mb-4">
          Let&apos;s break down what some of these features mean for your workflow.
        </p>
        <h3 className="font-bold text-white mt-4 mb-2">Creation tools</h3>
        <p className="mb-4">
          <strong>Texture Pack Creator</strong> and <strong>Remix Studio</strong> allow you to design and customize the visual appearance of Bloxd.io. The texture creator gives you pixel-level control over every block, item, and UI element. The remix feature lets you start from existing packs and modify only what you want, saving hours of work.
        </p>
        <p className="mb-4">
          <strong>Live Preview</strong> means you can see your changes in real-time without constantly exporting and importing files. This speeds up the creative process, especially when fine-tuning colors or testing different aesthetic approaches.
        </p>
        <h3 className="font-bold text-white mt-4 mb-2">Community features</h3>
        <p className="mb-4">
          All three platforms offer community asset sharing, which is great for discovering new content. <strong>Personalised Recommendations</strong> take this a step further by learning from your downloads and interactions to suggest content that matches your interests.
        </p>
        <h3 className="font-bold text-white mt-4 mb-2">Developer tools</h3>
        <p className="mb-4">
          For script writers, having a <strong>Script Editor with Syntax Highlighting</strong> makes code easier to read and debug. <strong>AI-assisted Scripting</strong> can help write code, explain functions, and troubleshoot errors, which is especially useful for beginners or when working with unfamiliar APIs.
        </p>
        <p className="mb-4">
          The <strong>API Documentation Viewer</strong> helps keep reference material close to where you work, reducing tab switching and making long sessions more productive.
        </p>
        <h3 className="font-bold text-white mt-4 mb-2">Technical infrastructure</h3>
        <p className="mb-4">
          <strong>Progressive Web Apps (PWA)</strong> work across devices, install without app stores, and can run offline while staying lightweight. This makes it easier to work on projects even with unstable internet.
        </p>
        <p className="mb-4">
          <strong>Live Schematic Rendering</strong> visualizes builds in 3D before import. It&apos;s helpful for large constructions where you want to preview the final result or share it before committing.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Choosing the right platform</h2>
        <p className="mb-4">
          Each platform serves different needs within the Bloxd.io ecosystem. Your choice depends on what you want to accomplish.
        </p>
        <p className="mb-4">
          If you&apos;re focused on creating textures, writing scripts, building structures, or want an all-in-one toolkit with offline capabilities and AI assistance, BloxdForge provides a comprehensive creative suite. The integrated workflow means everything from texture creation to script editing to build visualization happens in one place.
        </p>
        <p className="mb-4">
          Bloxdhub offers documentation and community features that may appeal to users looking for those specific resources. Bloxdium provides community feedback mechanisms and asset sharing capabilities.
        </p>
        <p className="mb-4">
          Many users try multiple platforms to see which workflow feels most natural. Texture packs, scripts, and builds are generally portable between platforms, so you&apos;re not locked into one choice. Explore and use whatever tools help you create your best work.
        </p>
      </section>
    </div>
  );
}