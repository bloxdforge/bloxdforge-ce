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

import { History, GitCommit } from 'lucide-react';
import { SectionHeader } from './SettingComponents';
import { CHANGELOG } from '@/lib/changelog';
function ChangelogItem({ log }: { log: typeof CHANGELOG[0] }) {
  return (
    <div className="p-6 hover:bg-surface/50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <GitCommit className="text-text-subtle" size={18} />
          <span className="font-bold text-white">{log.version}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${log.type === 'Major' ? 'bg-red-500/20 text-red-400' : log.type === 'Minor' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-text-muted'}`}>
            {log.type}
          </span>
        </div>
        <span className="text-xs text-text-subtle font-mono">{log.date}</span>
      </div>
      <div className="space-y-4 pl-7">
        {log.changes.added && (
          <div>
            <span className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1 block">Added</span>
            <ul className="list-disc list-inside text-sm text-text-muted space-y-1">
              {log.changes.added.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        )}
        {log.changes.improved && (
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1 block">Improved</span>
            <ul className="list-disc list-inside text-sm text-text-muted space-y-1">
              {log.changes.improved.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        )}
        {log.changes.renderingEngine && (
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1 block">Rendering Engine</span>
            <ul className="list-disc list-inside text-sm text-text-muted space-y-1">
              {log.changes.renderingEngine.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        )}
        {log.changes.fixed && (
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1 block">Fixed</span>
            <ul className="list-disc list-inside text-sm text-text-muted space-y-1">
              {log.changes.fixed.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        )}
        {log.changes.removed && (
          <div>
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1 block">Removed</span>
            <ul className="list-disc list-inside text-sm text-text-muted space-y-1">
              {log.changes.removed.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
export default function CommunitySettings() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Community & Support" description="Get help, share your work, and suggest features." />
      <div className="bg-background border border-surface-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-surface-border bg-surface flex items-center justify-between">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <History size={20} /> Update History
          </h3>
        </div>
        <div className="divide-y divide-surface-border">
          {CHANGELOG.map((log, index) => <ChangelogItem key={index} log={log} />)}
        </div>
      </div>
      <div className="bg-background border border-surface-border rounded-2xl p-6 text-center">
        <p className="text-sm text-text-subtle">
          BloxdForge {CHANGELOG[0].version} • Built for Bloxd.io
        </p>
      </div>
    </div>
  );
}