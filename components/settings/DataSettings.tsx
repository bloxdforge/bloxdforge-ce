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

import { LifeBuoy, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { SectionHeader, SettingCard } from './SettingComponents';
import { useSettingsStore } from '@/stores/useSettingsStore';
export default function DataSettings() {
  const { 
    confirmTextureDeletion, 
    setConfirmTextureDeletion,
    confirmPackDeletion,
    setConfirmPackDeletion
  } = useSettingsStore();
  const clearCache = () => {
    localStorage.removeItem("bloxdforge_docs_cache");
    toast.success("Documentation cache cleared.");
  };
  return (
    <div className="space-y-8">
      <SectionHeader title="Data & Storage" description="Manage your local data, cache, and confirmation prompts." />
      <div className="bg-background border border-surface-border rounded-2xl p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="font-bold text-white text-base">Clear API Docs Cache</h3>
            <p className="text-sm text-text-muted mt-2 max-w-sm">
              Forces a re-download of all API documentation. Use this if you suspect the AI is giving outdated information.
            </p>
          </div>
          <button 
            onClick={clearCache}
            className="px-5 py-2.5 bg-red-900/10 hover:bg-red-900/20 text-red-400 border border-red-900/30 hover:border-red-900/50 rounded-lg text-sm font-bold transition-colors whitespace-nowrap"
          >
            Clear Cache
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <SettingCard 
          title="Confirm Texture File Deletion"
          description="Show a prompt before deleting an individual texture file from a pack."
          icon={<AlertTriangle size={20} />}
          checked={confirmTextureDeletion}
          onChange={() => setConfirmTextureDeletion(!confirmTextureDeletion)}
        />
        <SettingCard 
          title="Confirm Texture Pack Deletion"
          description="Show a prompt before permanently deleting an entire texture pack."
          icon={<AlertTriangle size={20} />}
          checked={confirmPackDeletion}
          onChange={() => setConfirmPackDeletion(!confirmPackDeletion)}
        />
      </div>
      <div className="p-5 bg-blue-900/10 border border-blue-900/30 rounded-2xl">
        <div className="flex gap-4">
          <div className="mt-0.5 text-blue-400"><LifeBuoy size={24} /></div>
          <div className="text-sm text-blue-200">
            <span className="font-bold block mb-1">Privacy Note</span>
            BloxdForge operates primarily client-side. Your textures, scripts, and settings are stored in your browser&apos;s LocalStorage. Clearing your browser data will reset this application.
          </div>
        </div>
      </div>
    </div>
  );
}