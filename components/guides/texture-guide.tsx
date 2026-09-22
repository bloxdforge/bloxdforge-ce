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

import { FolderInput, Box, Layers, Upload } from "lucide-react";
export default function TextureGuide() {
  return (
    <div className="space-y-8 text-gray-300">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. The Texture Creator</h2>
        <p className="mb-4">The BloxdForge Texture Creator is a specialized pixel art editor tailored for Bloxd.io. Unlike generic editors (like Paint or Photoshop), it understands the game&apos;s file structure and requirements.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <div className="text-text-muted mb-2"><FolderInput size={24} /></div>
            <strong className="text-white block mb-1">Folder Uploads</strong>
            <p className="text-xs text-text-muted">Drag and drop an entire texture pack folder to load hundreds of textures instantly.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <div className="text-text-muted mb-2"><Box size={24} /></div>
            <strong className="text-white block mb-1">3D Model Viewer</strong>
            <p className="text-xs text-text-muted">Upload <code>.glb</code> files to inspect your 3D models directly in the browser.</p>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border">
            <div className="text-text-muted mb-2"><Layers size={24} /></div>
            <strong className="text-white block mb-1">Multi-Resolution</strong>
            <p className="text-xs text-text-muted">Create standard (16x), HD (32x), or UHD (64x) textures with ease.</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. File Naming Conventions</h2>
        <p className="mb-4">Bloxd.io relies on specific filenames to recognize textures. If you name a file incorrectly, the game won&apos;t load it. The full list of filenames is extensive (~2600 files), but here are some of the most common ones:</p>
        <div className="bg-background border border-surface-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-hover text-white">
              <tr>
                <th className="p-3">Block</th>
                <th className="p-3">Required Filename</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <tr><td className="p-3">Stone</td><td className="p-3 font-mono text-white">stone.png</td></tr>
              <tr><td className="p-3">Dirt</td><td className="p-3 font-mono text-white">dirt.png</td></tr>
              <tr><td className="p-3">Grass (Top)</td><td className="p-3 font-mono text-white">grass_top.png</td></tr>
              <tr><td className="p-3">Grass (Side)</td><td className="p-3 font-mono text-white">grass_side.png</td></tr>
              <tr><td className="p-3">Wood Log</td><td className="p-3 font-mono text-white">log_maple.png</td></tr>
              <tr><td className="p-3">Leaves</td><td className="p-3 font-mono text-white">leaves_maple.png</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">3. Applying Your Texture Pack</h2>
        <p className="mb-4">Once you are finished editing, click the <strong>&quot;Download Pack (.zip)&quot;</strong> button in the sidebar. This bundles all your files into a single ZIP archive.</p>
        <div className="bg-surface p-4 rounded-lg border border-surface-border flex items-start gap-4">
          <div className="mt-1 text-primary"><Upload size={24} /></div>
          <div>
            <strong className="text-white block mb-2">How to Upload In-Game</strong>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-text-muted">
              <li>Launch Bloxd.io.</li>
              <li>Go to <strong>Settings</strong> (or press P).</li>
              <li>Navigate to the <strong>Texture Pack</strong> tab.</li>
              <li>Click the button that says <strong>&quot;Drag and drop a Texture Pack folder here&quot;</strong> and select the ZIP file you downloaded from BloxdForge.</li>
              <li>The game will apply your custom textures automatically.</li>
            </ol>
            <p className="text-xs text-text-subtle mt-3">You can also choose from several built-in texture packs on this same screen.</p>
          </div>
        </div>
      </section>
    </div>
  );
}