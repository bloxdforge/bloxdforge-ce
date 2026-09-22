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

export default function BloxdHopStrategiesGuide() {
  return (
    <div className="space-y-8 text-gray-300">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. Physics & B-Hopping</h2>
        <p className="mb-4">Bloxd.io physics allow for momentum stacking. &quot;Bunny Hopping&quot; (jumping the moment you land) prevents friction from slowing you down.</p>
        <div className="bg-background border border-surface-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-hover text-white">
              <tr>
                <th className="p-3">Technique</th>
                <th className="p-3">Jump Distance</th>
                <th className="p-3">Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <tr>
                <td className="p-3 font-medium">Standard Sprint Jump</td>
                <td className="p-3">4 Blocks</td>
                <td className="p-3 text-white">Easy</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Single B-Hop</td>
                <td className="p-3">6 Blocks</td>
                <td className="p-3 text-white">Medium</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Double B-Hop</td>
                <td className="p-3">7 Blocks</td>
                <td className="p-3 text-white">Hard</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Ice B-Hop</td>
                <td className="p-3">9 Blocks</td>
                <td className="p-3 text-white">Expert</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. Advanced Tech</h2>
        <div className="space-y-4">
          <div>
            <strong className="text-white block mb-1">Ladder Jumping</strong>
            <p className="text-sm text-text-muted">Crouch at the very top of a ladder, then press <code>Shift + Space + W</code> simultaneously. This launches you significantly higher than a normal jump, allowing you to skip sections of a parkour map.</p>
          </div>
          <div>
            <strong className="text-white block mb-1">Wall Running (DoodleCube)</strong>
            <p className="text-sm text-text-muted">In modes like DoodleCube, you can maintain momentum along vertical surfaces. Hit the wall at an angle and time your jumps to &quot;run&quot; along it without losing height.</p>
          </div>
          <div>
            <strong className="text-white block mb-1">Edge Grabbing</strong>
            <p className="text-sm text-text-muted">If you miss a jump slightly, aiming directly at the corner of the block and holding Shift (Sneak) can sometimes glitch you onto the edge, saving you from falling.</p>
          </div>
        </div>
      </section>
    </div>
  );
}