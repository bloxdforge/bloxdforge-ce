"use client";

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

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Monitor,
  LifeBuoy,
  Settings2,
  HardDrive,
} from 'lucide-react';
import { TabButton } from '@/components/settings/SettingComponents';
import GeneralSettings from '@/components/settings/GeneralSettings';
import SchematicSettings from '@/components/settings/SchematicSettings';
import AiSettings from '@/components/settings/AiSettings';
import DataSettings from '@/components/settings/DataSettings';
import CommunitySettings from '@/components/settings/CommunitySettings';
import { AIAgentLogo, ForgeRenderLogo } from '@/components/settings/SettingsLogos';
type SettingsTab = 'general' | 'schematic' | 'ai' | 'data' | 'support';
const TABS = [
  { id: 'general', icon: <Monitor size={18} />, label: 'General' },
  { id: 'schematic', icon: <ForgeRenderLogo size={18} />, label: 'Schematic Preview' },
  { id: 'ai', icon: <AIAgentLogo size={18} />, label: 'AI Assistant' },
  { id: 'data', icon: <HardDrive size={18} />, label: 'Data & Storage' },
  { id: 'support', icon: <LifeBuoy size={18} />, label: 'Community' },
] as const;
const isValidTab = (tab: string | null): tab is SettingsTab => {
  return TABS.some(t => t.id === tab);
};
export default function SettingsClient() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  useEffect(() => {
    const tabFromQuery = searchParams.get('tab');
    if (tabFromQuery && isValidTab(tabFromQuery)) {
      setActiveTab(tabFromQuery);
    }
  }, [searchParams]);
  const renderContent = () => {
    switch(activeTab) {
      case 'general': return <GeneralSettings />;
      case 'schematic': return <SchematicSettings />;
      case 'ai': return <AiSettings />;
      case 'data': return <DataSettings />;
      case 'support': return <CommunitySettings />;
      default: return null;
    }
  };
  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-[#0a0a0a] overflow-hidden">
      <aside className="w-full md:w-64 bg-background border-b md:border-b-0 md:border-r border-surface-border flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-surface-border hidden md:block">
          <h2 className="font-bold text-white text-lg flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            Settings
          </h2>
        </div>
        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible p-2 md:p-4 gap-1 no-scrollbar md:flex-1">
          {TABS.map(tab => (
            <TabButton 
              key={tab.id}
              active={activeTab === tab.id} 
              onClick={() => setActiveTab(tab.id as SettingsTab)} 
              icon={tab.icon} 
              label={tab.label} 
            />
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto bg-[#0a0a0a] p-4 md:p-12">
        <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}