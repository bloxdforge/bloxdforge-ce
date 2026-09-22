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

import { Play, Globe, Hammer, Sparkles, Zap, Edit2, Check, BookOpen, Settings, Layers, Code2, Video } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Image from "next/image";
import ScriptModal, { ScriptItem } from "@/components/workshop/ScriptModal";
import imageKitLoader from "@/lib/image-loader";
import { fetchSecureData } from "@/lib/secure-data";
import { truncateAuthor } from "@/lib/filename-utils";
const PreviewModal = dynamic(() => import('@/components/workshop/PreviewModal'), {
  ssr: false
});
const SchematicPreviewModal = dynamic(() => import('@/components/workshop/SchematicPreviewModal'), {
  ssr: false
});
interface BuildItem {
  url: string;
  img: string;
  name: string;
  author: string;
  tags: string[];
}
interface TextureItem {
  name: string;
  file: string;
  img?: string;
  author?: string;
  tags?: string[];
}
interface FeaturedItem {
  type: 'Schematic' | 'Texture' | 'Script';
  title: string;
  author?: string;
  image?: string;
  link?: string;
  itemData: BuildItem | TextureItem | ScriptItem;
}
interface ToolItem {
  id: string;
  href: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  iconColor: string;
  visible: boolean;
  onClick?: () => void;
}
interface SavedToolConfig {
  id: string;
  visible: boolean;
}
const ALL_TOOLS: ToolItem[] = [
  {
    id: 'play',
    href: '/studio/play',
    title: 'Play Bloxd',
    desc: 'Standard game client.',
    icon: <Play className="w-6 h-6" />,
    color: 'from-green-500/20 to-emerald-500/10',
    iconColor: 'text-green-400',
    visible: true
  },
  {
    id: 'staging',
    href: '/studio/play?staging=true',
    title: 'Play Staging',
    desc: 'Beta features & updates.',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-purple-500/20 to-indigo-500/10',
    iconColor: 'text-purple-400',
    visible: true
  },
  {
    id: 'creator',
    href: '/studio/creator',
    title: 'Texture Studio',
    desc: 'Pixel editor for packs.',
    icon: <Hammer className="w-6 h-6" />,
    color: 'from-primary/20 to-orange-600/10',
    iconColor: 'text-primary',
    visible: true
  },
  {
    id: 'remix',
    href: '/studio/remix',
    title: 'Remix Studio',
    desc: 'Combine & customize packs.',
    icon: <Layers className="w-6 h-6" />,
    color: 'from-pink-500/20 to-fuchsia-500/10',
    iconColor: 'text-pink-400',
    visible: true
  },
  {
    id: 'world-tools',
    href: '/studio/world-tools',
    title: 'World Tools',
    desc: 'AI scripting & linter.',
    icon: <Code2 className="w-6 h-6" />,
    color: 'from-teal-500/20 to-cyan-500/10',
    iconColor: 'text-teal-400',
    visible: true
  },
  {
    id: 'workshop',
    href: '/studio/workshop',
    title: 'Workshop',
    desc: 'Community assets hub.',
    icon: <Globe className="w-6 h-6" />,
    color: 'from-blue-500/20 to-cyan-500/10',
    iconColor: 'text-blue-400',
    visible: true
  },
  {
    id: 'recorder',
    href: '/recorder',
    title: 'Recorder',
    desc: 'Record screen without game.',
    icon: <Video className="w-6 h-6" />,
    color: 'from-red-500/20 to-rose-500/10',
    iconColor: 'text-red-400',
    visible: true,
    onClick: () => {
      const popupWidth = 420;
      const popupHeight = 360;
      const left = window.screenX + (window.outerWidth - popupWidth) / 2;
      const top = window.screenY + (window.outerHeight - popupHeight) / 2;
      window.open(
        '/recorder',
        'bloxdforge_recorder',
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},noopener,noreferrer`
      );
    }
  },
  {
    id: 'wiki',
    href: '/studio/wiki',
    title: 'Blogs & Guides',
    desc: 'Learn game mechanics.',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'from-yellow-500/20 to-orange-500/10',
    iconColor: 'text-yellow-400',
    visible: false
  },
  {
    id: 'settings',
    href: '/studio/settings',
    title: 'Settings',
    desc: 'Configure BloxdForge.',
    icon: <Settings className="w-6 h-6" />,
    color: 'from-gray-500/20 to-slate-500/10',
    iconColor: 'text-text-muted',
    visible: false
  }
];
export default function StudioLauncher() {
  const [featured, setFeatured] = useState<FeaturedItem[]>([]);
  const [tools, setTools] = useState<ToolItem[]>(ALL_TOOLS);
  const [isEditing, setIsEditing] = useState(false);
  const [previewPack, setPreviewPack] = useState<{url: string, name: string, img?: string, author?: string} | null>(null);
  const [selectedScript, setSelectedScript] = useState<ScriptItem | null>(null);
  const [previewSchematic, setPreviewSchematic] = useState<BuildItem | null>(null);
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem("bloxdforge_launcher_config");
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig) as SavedToolConfig[];
        setTools(prev => prev.map(t => {
          const saved = parsed.find((p) => p.id === t.id);
          return saved ? { ...t, visible: saved.visible } : t;
        }));
      }
    } catch (e) {
      console.error("Failed to parse launcher config from localStorage", e);
      localStorage.removeItem("bloxdforge_launcher_config");
    }
  }, []);
  const saveConfig = () => {
    localStorage.setItem("bloxdforge_launcher_config", JSON.stringify(tools.map(t => ({ id: t.id, visible: t.visible }))));
    setIsEditing(false);
  };
  const toggleTool = (id: string) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, visible: !t.visible } : t));
  };
  useEffect(() => {
    const loadFeatured = async () => {
      const schems: FeaturedItem[] = [];
      const textures: FeaturedItem[] = [];
      const scripts: FeaturedItem[] = [];
      try {
        const parsedSchems = await fetchSecureData<BuildItem[]>('builds');
        parsedSchems.forEach((schem) => {
          schems.push({
            type: 'Schematic', title: schem.name, author: schem.author,
            image: schem.img, link: schem.url, itemData: schem,
          });
        });
      } catch(e) { console.error("Failed loading builds", e) }
      try {
        const texData = await fetchSecureData<TextureItem[]>('textures');
        texData.forEach((tex) => {
             textures.push({
              type: 'Texture', title: tex.name, author: tex.author,
              image: tex.img, link: tex.file, itemData: tex
            });
          });
      } catch(e) { console.error("Failed loading textures", e) }
      try {
         const scriptData = await fetchSecureData<ScriptItem[]>('scripts-list');
         scriptData.forEach((script) => {
           scripts.push({
             type: 'Script', title: script.title, author: script.author,
             image: script.img, itemData: script
           });
         });
      } catch(e) { console.error("Failed loading scripts", e) }
      const categories = [];
      if (schems.length > 0) categories.push(schems);
      if (textures.length > 0) categories.push(textures);
      if (scripts.length > 0) categories.push(scripts);
      for (let i = categories.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [categories[i], categories[j]] = [categories[j], categories[i]];
      }
      const featuredItems: FeaturedItem[] = [];
      if (categories.length > 0) {
          const cat1 = categories[0];
          featuredItems.push(cat1[Math.floor(Math.random() * cat1.length)]);
      }
      if (categories.length > 1) {
          const cat2 = categories[1];
          featuredItems.push(cat2[Math.floor(Math.random() * cat2.length)]);
      } else if (categories.length > 0 && categories[0].length > 1) {
          const cat1 = categories[0];
          let item2;
          do {
              item2 = cat1[Math.floor(Math.random() * cat1.length)];
          } while (featuredItems.length > 0 && item2.title === featuredItems[0].title);
          if (item2) featuredItems.push(item2);
      }
      setFeatured(featuredItems);
    };
    loadFeatured();
  }, []);
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto min-h-full flex flex-col space-y-10">
        {previewPack && (
          <PreviewModal 
            isOpen={!!previewPack}
            onClose={() => setPreviewPack(null)}
            zipUrl={previewPack?.url || ''}
            packName={previewPack?.name || ''}
            initialImg={previewPack.img}
            initialAuthor={previewPack.author}
          />
        )}
        <ScriptModal 
          isOpen={!!selectedScript}
          onClose={() => setSelectedScript(null)}
          script={selectedScript}
        />
        <SchematicPreviewModal
          isOpen={!!previewSchematic}
          onClose={() => setPreviewSchematic(null)}
          schematic={previewSchematic}
        />
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to the Studio</h1>
            <p className="text-text-muted">Select a tool or launch the game with integrated utilities.</p>
          </div>
          <button 
            onClick={() => isEditing ? saveConfig() : setIsEditing(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${isEditing ? 'bg-green-600 border-green-500 text-white' : 'bg-surface border-surface-border text-text-muted hover:text-white'}`}
          >
            {isEditing ? <Check size={16} /> : <Edit2 size={16} />}
            {isEditing ? "Save Layout" : "Customize"}
          </button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.filter(t => isEditing || t.visible).map((tool) => (
            <LaunchCard 
              key={tool.id}
              {...tool}
              description={tool.desc}
              isEditing={isEditing}
              onToggle={() => toggleTool(tool.id)}
              onPopupClick={tool.onClick}
            />
          ))}
        </div>
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Featured in Workshop
            </h2>
            <Link href="/studio/workshop" className="text-sm text-primary hover:text-primary-hover">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featured.length > 0 ? featured.map((item, idx) => (
              <FeaturedCard 
                key={idx}
                type={item.type}
                title={item.title}
                author={item.author}
                image={item.image}
                link={item.link}
                priority={idx < 2}
                onClick={() => {
                  if (item.type === 'Texture') {
                    setPreviewPack({ url: item.link!, name: item.title, img: item.image, author: item.author });
                  }
                  if (item.type === 'Script') {
                    const scriptItem = item.itemData as ScriptItem;
                    if (scriptItem.hash) {
                      fetch(`/api/scripts/${scriptItem.hash}`)
                        .then(r => r.ok ? r.json() : Promise.reject())
                        .then(full => setSelectedScript(full))
                        .catch(() => {});
                    } else {
                      setSelectedScript(scriptItem);
                    }
                  }
                  if (item.type === 'Schematic') {
                    setPreviewSchematic(item.itemData as BuildItem);
                  }
                }}
              />
            )) : (
              <div className="col-span-2 py-10 text-center text-text-subtle italic border-2 border-dashed border-surface-border rounded-2xl">
                Loading featured items...
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
function LaunchCard({ 
  href, 
  title, 
  description, 
  icon, 
  color, 
  iconColor, 
  isEditing,
  visible,
  onToggle,
  onPopupClick
}: { 
  href: string, 
  title: string, 
  description: string, 
  icon: React.ReactNode, 
  color: string, 
  iconColor: string,
  isEditing?: boolean,
  visible?: boolean,
  onToggle?: () => void,
  onPopupClick?: () => void
}) {
  const CardContent = (
    <div className="relative z-10">
      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-lg bg-black/40 w-fit mb-3 ${iconColor}`}>
          {icon}
        </div>
        {isEditing && (
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${visible ? 'bg-green-500 border-green-400' : 'bg-hairline-strong border-gray-500'}`}>
             {visible && <Check size={12} className="text-black" />}
          </div>
        )}
      </div>
      <h3 className="text-lg font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">{title}</h3>
      <p className="text-xs text-text-muted leading-relaxed">{description}</p>
    </div>
  );
  const className = `relative p-5 rounded-2xl border bg-linear-to-br ${color} transition-all duration-300 group overflow-hidden ${isEditing ? (visible ? 'border-green-500/50 opacity-100 cursor-pointer' : 'border-surface-border opacity-40 grayscale cursor-pointer') : 'border-surface-border hover:border-white/20'}`;
  if (isEditing) {
    return (
      <div onClick={onToggle} className={className}>
        {CardContent}
      </div>
    );
  }
  if (onPopupClick) {
    return (
      <button onClick={onPopupClick} className={className + " text-left cursor-pointer w-full"}>
        {CardContent}
      </button>
    );
  }
  return (
    <Link href={href} className={className}>
      {CardContent}
    </Link>
  );
}
function FeaturedCard({ type, title, author, image, link, priority, onClick }: { type: string, title: string, author?: string, image?: string, link?: string, priority?: boolean, onClick?: () => void }) {
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    setHasError(false);
  }, [image]);
  const commonClasses = "group relative h-48 rounded-xl overflow-hidden border border-surface-border block";
  const content = (
    <>
      {image && !hasError ? (
         <Image 
          loader={imageKitLoader}
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-200 group-hover:scale-105 opacity-60 group-hover:opacity-40"
          onError={() => setHasError(true)}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={priority}
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-gray-800 to-black opacity-60" />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
      <div className="absolute top-4 right-4">
        <span className="px-2 py-1 bg-black/50 backdrop-blur-sm border border-white/10 rounded text-[10px] text-white font-mono uppercase tracking-wider">
          {type}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        {author && (
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>by <span className="text-primary">{truncateAuthor(author)}</span></span>
          </div>
        )}
      </div>
    </>
  );
  if (type === 'Schematic' && !onClick) {
    return (
      <a 
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={commonClasses}
      >
        {content}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={commonClasses + " text-left"}>
      {content}
    </button>
  );
}
