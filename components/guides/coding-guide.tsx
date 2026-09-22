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

import { Bot, Terminal } from "lucide-react";
export default function CodingGuide() {
  return (
    <div className="space-y-8 text-gray-300">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">1. API Architecture and Constraints</h2>
        <p className="mb-4">The Bloxd scripting environment enforces a strict <strong>16,000 character limit</strong> per Code Block. This constraint necessitates efficient code composition and strategic optimization. BloxdForge provides tools specifically designed to assist developers in maintaining code within this character budget while preserving functionality.</p>
        <p className="text-sm text-text-muted">Scripts execute within a sandboxed JavaScript environment with access to a predefined API object. Direct DOM manipulation, external network requests, and certain JavaScript built-in functions are restricted for security and performance considerations. All game interaction must occur through the documented API methods.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">2. The BloxdForge Development Environment</h2>
        <p className="mb-4">Developing scripts within the constrained in-game code editor presents significant usability challenges. BloxdForge provides a comprehensive integrated development environment (IDE) with professional tooling specifically configured for Bloxd script development.</p>
        <div className="space-y-4">
          <div className="bg-surface p-4 rounded-lg border border-surface-border flex gap-4">
            <div className="mt-1 text-text-muted"><Bot size={24} /></div>
            <div>
              <strong className="text-white block mb-1">AI-Powered Code Assistant</strong>
              <p className="text-sm text-text-muted mb-2">The integrated AI assistant has been trained on the complete Bloxd API documentation and common scripting patterns. Developers can request specific functionality through natural language queries. Example: <em>&quot;Create a script that applies Speed II effect when a player clicks this block.&quot;</em> The assistant generates syntactically correct code utilizing appropriate API methods.</p>
              <p className="text-xs text-text-subtle">The AI assistant remains current with API updates and can provide explanations for generated code segments, facilitating learning and understanding of API mechanics.</p>
            </div>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border flex gap-4">
            <div className="mt-1 text-text-muted"><Terminal size={24} /></div>
            <div>
              <strong className="text-white block mb-1">Real-time Error Detection</strong>
              <p className="text-sm text-text-muted mb-2">The editor incorporates a specialized linter that validates code against the Bloxd API specification. Invalid function calls, incorrect parameter types, and deprecated methods are highlighted immediately. For instance, attempting to use <code className="text-white">&quot;api.kill()&quot;</code> (which does not exist) instead of the correct <code className="text-white">&quot;api.killLifeform()&quot;</code> triggers an immediate warning with suggested corrections.</p>
              <p className="text-xs text-text-subtle">The linter also identifies common logical errors such as undefined variables, scope issues, and incorrect event handler implementations.</p>
            </div>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-surface-border flex gap-4">
            <div className="mt-1 text-text-muted"><Terminal size={24} /></div>
            <div>
              <strong className="text-white block mb-1">Character Count Monitoring</strong>
              <p className="text-sm text-text-muted">A persistent character counter displays the current script length relative to the 16,000 character limit. This real-time feedback enables developers to make informed decisions about code structure and identify opportunities for optimization before exceeding the constraint.</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">3. Core API Methods</h2>
        <p className="mb-4">The following API methods represent the fundamental functions for world interaction and player manipulation. All method signatures have been verified against the current API specification.</p>
        <div className="bg-background rounded-2xl border border-surface-border overflow-hidden mb-6">
          <div className="flex items-center gap-2 bg-surface-hover px-4 py-2 border-b border-surface-border">
            <Terminal size={14} className="text-text-muted" />
            <span className="text-xs font-mono text-gray-300">Player Manipulation Functions</span>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <code className="text-white font-bold">api.setPosition(id, x, y, z)</code>
              <p className="text-xs text-text-subtle mt-1">Teleportation function. Immediately relocates the specified lifeform to the provided coordinates. Note: <code className="text-white">api.teleport</code> does not exist in the current API specification.</p>
              <p className="text-xs text-text-subtle mt-1 italic">Parameters: id (string), x (number), y (number), z (number)</p>
            </div>
            <div>
              <code className="text-white font-bold">api.setVelocity(id, x, y, z)</code>
              <p className="text-xs text-text-subtle mt-1">Applies velocity vector to the specified lifeform. Commonly utilized for jump pads, launch mechanics, and knockback effects. Example implementation for vertical jump pad: <code>api.setVelocity(playerId, 0, 12, 0)</code></p>
              <p className="text-xs text-text-subtle mt-1 italic">Parameters: id (string), x (number), y (number), z (number)</p>
            </div>
            <div>
              <code className="text-white font-bold">api.giveItem(id, &quot;item_name&quot;, count)</code>
              <p className="text-xs text-text-subtle mt-1">Adds specified items to player inventory. Item identifiers are case-sensitive and must match the official naming convention. Reference the ITEM_NAMES.md documentation for complete item identifier list.</p>
              <p className="text-xs text-text-subtle mt-1 italic">Parameters: id (string), item_name (string), count (number)</p>
            </div>
            <div>
              <code className="text-white font-bold">api.hasItem(id, &quot;item_name&quot;)</code>
              <p className="text-xs text-text-subtle mt-1">Returns boolean indicating whether the specified player possesses the named item. Essential for implementing conditional logic such as shop systems, key-card access, and quest progression tracking.</p>
              <p className="text-xs text-text-subtle mt-1 italic">Parameters: id (string), item_name (string) | Returns: boolean</p>
            </div>
            <div>
              <code className="text-white font-bold">api.removeItem(id, &quot;item_name&quot;, count)</code>
              <p className="text-xs text-text-subtle mt-1">Removes specified quantity of items from player inventory. Used in conjunction with shop systems and consumable resources.</p>
              <p className="text-xs text-text-subtle mt-1 italic">Parameters: id (string), item_name (string), count (number)</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-2xl border border-surface-border overflow-hidden mb-6">
          <div className="flex items-center gap-2 bg-surface-hover px-4 py-2 border-b border-surface-border">
            <Terminal size={14} className="text-text-muted" />
            <span className="text-xs font-mono text-gray-300">World Interaction Functions</span>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <code className="text-white font-bold">api.setBlock(x, y, z, &quot;block_type&quot;)</code>
              <p className="text-xs text-text-subtle mt-1">Places or modifies blocks at specified coordinates. Block type strings must correspond to valid block identifiers. This method forms the foundation for dynamic world modification scripts.</p>
              <p className="text-xs text-text-subtle mt-1 italic">Parameters: x (number), y (number), z (number), block_type (string)</p>
            </div>
            <div>
              <code className="text-white font-bold">api.getBlock(x, y, z)</code>
              <p className="text-xs text-text-subtle mt-1">Returns the block type identifier at the specified coordinates. Useful for conditional logic based on world state.</p>
              <p className="text-xs text-text-subtle mt-1 italic">Parameters: x (number), y (number), z (number) | Returns: string</p>
            </div>
            <div>
              <code className="text-white font-bold">api.createExplosion(x, y, z, power)</code>
              <p className="text-xs text-text-subtle mt-1">Generates explosion at specified coordinates with defined power level. Higher power values create larger blast radius and increased block destruction.</p>
              <p className="text-xs text-text-subtle mt-1 italic">Parameters: x (number), y (number), z (number), power (number)</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">4. Event Handling Architecture</h2>
        <p className="mb-4">Scripts interact with player actions and world events through event listener registration. The API provides several event types that trigger callback execution when specific conditions occur.</p>
        <div className="bg-surface rounded-xl border border-surface-border p-4 mb-4">
          <code className="text-white font-bold block mb-2">api.on(&quot;blockClick&quot;, function(event) {"{"} ... {"}"});</code>
          <p className="text-xs text-text-muted mb-3">Executes callback when a player clicks the code block. The event object contains player ID and click coordinates, enabling player-specific responses.</p>
          <code className="text-white font-bold block mb-2 mt-4">api.on(&quot;playerJoin&quot;, function(event) {"{"} ... {"}"});</code>
          <p className="text-xs text-text-muted mb-3">Triggers when a player enters the world instance. Commonly used for initialization scripts, welcome messages, and player-specific setup procedures.</p>
          <code className="text-white font-bold block mb-2 mt-4">api.on(&quot;playerLeave&quot;, function(event) {"{"} ... {"}"});</code>
          <p className="text-xs text-text-muted">Executes when a player disconnects from the world. Useful for cleanup operations and persistent data storage.</p>
        </div>
        <p className="text-sm text-text-muted">Event listeners should be registered during script initialization. Multiple listeners can be attached to the same event type, and they will execute in registration order.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">5. Code Optimization Strategies</h2>
        <p className="mb-4">Maintaining code within the 16,000 character limit requires strategic optimization techniques without sacrificing functionality or readability.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-text-muted mb-4">
          <li><strong className="text-white">Variable Name Reduction:</strong> Utilize concise variable names in production code. Replace descriptive names like <code>playerIdentifier</code> with abbreviated forms like <code>pId</code> after development and testing phases.</li>
          <li><strong className="text-white">Whitespace Minimization:</strong> Remove unnecessary whitespace, line breaks, and indentation. The BloxdForge AI can perform automated minification while preserving code logic.</li>
          <li><strong className="text-white">Function Consolidation:</strong> Identify repeated code patterns and consolidate them into reusable functions. This reduces overall character count through elimination of redundancy.</li>
          <li><strong className="text-white">Comment Removal:</strong> Remove comments from production code. Maintain documented versions externally for reference while deploying comment-free versions to the game environment.</li>
        </ul>
        <div className="bg-surface p-4 rounded-lg border border-surface-border flex gap-4">
          <div className="mt-1 text-text-muted"><Bot size={24} /></div>
          <div>
            <p className="text-sm text-text-muted">The BloxdForge AI assistant maintains training on the current API documentation. Request <strong>&quot;minify and optimize this script&quot;</strong> to receive an automated optimization pass that reduces character count while preserving functionality. The AI identifies optimization opportunities that may not be immediately apparent to human developers.</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">6. Common Implementation Patterns</h2>
        <p className="mb-4">The following patterns represent frequently implemented script functionalities and demonstrate proper API usage.</p>
        <div className="bg-surface rounded-xl border border-surface-border p-4 mb-4">
          <h3 className="font-bold text-white mb-2">Teleportation Pad</h3>
          <pre className="text-xs text-gray-300 bg-[#0a0a0a] p-3 rounded overflow-x-auto mb-2">
{`api.on("blockClick", function(e) {
  api.setPosition(e.playerId, 100, 65, 200);
});`}
          </pre>
          <p className="text-xs text-text-muted">Simple teleportation implementation triggered by block interaction.</p>
        </div>
        <div className="bg-surface rounded-xl border border-surface-border p-4 mb-4">
          <h3 className="font-bold text-white mb-2">Item Shop System</h3>
          <pre className="text-xs text-gray-300 bg-[#0a0a0a] p-3 rounded overflow-x-auto mb-2">
{`api.on("blockClick", function(e) {
  if (api.hasItem(e.playerId, "diamond", 5)) {
    api.removeItem(e.playerId, "diamond", 5);
    api.giveItem(e.playerId, "diamond_sword", 1);
  }
});`}
          </pre>
          <p className="text-xs text-text-muted">Conditional item exchange demonstrating inventory check and modification.</p>
        </div>
        <div className="bg-surface rounded-xl border border-surface-border p-4">
          <h3 className="font-bold text-white mb-2">Jump Pad Mechanism</h3>
          <pre className="text-xs text-gray-300 bg-[#0a0a0a] p-3 rounded overflow-x-auto mb-2">
{`api.on("blockClick", function(e) {
  api.setVelocity(e.playerId, 0, 15, 0);
});`}
          </pre>
          <p className="text-xs text-text-muted">Vertical velocity application for jump pad functionality.</p>
        </div>
      </section>
    </div>
  );
}