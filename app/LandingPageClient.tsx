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

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Box,
  Globe,
  Zap,
  ShieldCheck,
  Code2,
  Layers,
  MoveRight,
  Menu,
  X,
  Star,
  Play,
  Hammer,
  BookOpen
} from "lucide-react";
import toast from "react-hot-toast";
import imageKitLoader from "@/lib/image-loader";
import { useState, useEffect } from "react";
import { useInView } from "@/hooks/useInView";
import { useSettingsStore } from "@/stores/useSettingsStore";
import AutoRedirectModal from "@/components/landing/AutoRedirectModal";
import ChangelogModal from "@/components/landing/ChangelogModal";
import WorkshopMarquee, { WorkshopItem } from "@/components/landing/WorkshopMarquee";
import TexturePainter from "@/components/landing/TexturePainter";
import AiCodeAnimation from "@/components/landing/AiCodeAnimation";
import { StatItem, FeaturePoint, TechBadge, FAQItem } from "@/components/landing/LandingPageHelpers";
import { CHANGELOG } from "@/lib/changelog";
interface LandingPageClientProps {
  schematicsCount: number;
  texturesCount: number;
  scriptsCount: number;
  initialWorkshopRows: WorkshopItem[][];
}
export default function LandingPageClient({
  schematicsCount,
  texturesCount,
  scriptsCount,
  initialWorkshopRows
}: LandingPageClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    studioVisitCount,
    incrementStudioVisitCount,
    autoRedirectToStudio,
    setAutoRedirectToStudio,
    setStudioVisitCount
  } = useSettingsStore();
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [showChangelogModal, setShowChangelogModal] = useState(false);
  const [lastViewedVersion, setLastViewedVersion] = useState<string | null>(null);
  const [workshopRows, setWorkshopRows] = useState(initialWorkshopRows);
  useEffect(() => {
    const allItems = initialWorkshopRows.flat();
    for (let i = allItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
    }
    const chunkSize = Math.ceil(allItems.length / 3);
    setWorkshopRows([
      allItems.slice(0, chunkSize),
      allItems.slice(chunkSize, chunkSize * 2),
      allItems.slice(chunkSize * 2),
    ]);
  }, [initialWorkshopRows]);
  useEffect(() => {
    if (studioVisitCount >= 10 && !autoRedirectToStudio) {
      setShowRedirectModal(true);
    }
  }, [studioVisitCount, autoRedirectToStudio]);
  useEffect(() => {
    const storedVersion = localStorage.getItem('bloxdforge_last_version');
    setLastViewedVersion(storedVersion);
    const latestVersion = CHANGELOG[0]?.version;
    if (latestVersion && storedVersion !== latestVersion) {
      setShowChangelogModal(true);
      localStorage.setItem('bloxdforge_last_version', latestVersion);
    }
  }, []);
  const handleCloseChangelog = () => {
    setShowChangelogModal(false);
  };
  const handleConfirmRedirect = () => {
    setAutoRedirectToStudio(true);
    setShowRedirectModal(false);
    toast.success('Auto-redirect to Studio enabled!');
  };
  const handleDeclineRedirect = (dontAskAgain: boolean) => {
    if (dontAskAgain) {
      setStudioVisitCount(-999);
    }
    setShowRedirectModal(false);
  };
  const handleStudioLinkClick = () => {
    incrementStudioVisitCount();
  };
  const { ref: workshopRef, inView: workshopInView } = useInView({ threshold: 0.1 });
  const { ref: textureRef, inView: textureInView } = useInView({ threshold: 0.1 });
  const { ref: toolsRef, inView: toolsInView } = useInView({ threshold: 0.1 });
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowBottomBar(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);
  const platformSummary = {
    name: "BloxdForge",
    version: CHANGELOG[0]?.version,
    lastUpdate: CHANGELOG[0]?.date,
    metrics: {
      schematics: schematicsCount,
      texturePacks: texturesCount,
      scripts: scriptsCount,
      monthlyVisitors: "20,000+"
    }
  };
  return (
    <div className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30 selection:text-white overflow-x-hidden">
      <script
        type="application/json"
        id="bloxdforge-platform-summary"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(platformSummary) }}
      />
      {showRedirectModal && <AutoRedirectModal onConfirm={handleConfirmRedirect} onDecline={handleDeclineRedirect} />}
      <ChangelogModal isOpen={showChangelogModal} onClose={handleCloseChangelog} lastViewedVersion={lastViewedVersion} />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[150px] animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[150px] animate-pulse duration-[10000ms]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
          }}
        />
      </div>
      <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${isScrolled ? 'bg-[#050505]/90 border-b border-white/5 backdrop-blur-xl h-16' : 'bg-transparent h-20 md:h-24'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 md:w-9 md:h-9">
              <Image
                loader={imageKitLoader}
                src="/logo.svg"
                alt="BloxdForge Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-white">BloxdForge</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/studio/workshop" onClick={handleStudioLinkClick} className="text-sm font-medium text-text-muted hover:text-white transition-colors">Workshop</Link>
            <Link href="/studio/creator" onClick={handleStudioLinkClick} className="text-sm font-medium text-text-muted hover:text-white transition-colors">Texture Creator</Link>
            <Link href="/studio/world-tools" onClick={handleStudioLinkClick} className="text-sm font-medium text-text-muted hover:text-white transition-colors">Script AI</Link>
            <Link href="/studio/wiki" onClick={handleStudioLinkClick} className="text-sm font-medium text-text-muted hover:text-white transition-colors">Guides</Link>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/studio/play"
              className="px-5 py-2 text-white/80 text-sm font-medium rounded-full hover:bg-white/10 transition-colors"
            >
              Play Now
            </Link>
            <Link
              href="/studio"
              onClick={handleStudioLinkClick}
              className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95"
            >
              Launch Studio
            </Link>
          </div>
          <button
            className="md:hidden p-2 -mr-2 text-text-muted hover:text-white"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#050505]/95 backdrop-blur-xl flex flex-col md:hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image loader={imageKitLoader} src="/logo.svg" alt="Logo" fill className="object-contain" />
              </div>
              <span className="font-bold text-lg text-white">BloxdForge</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="p-2 text-text-muted hover:text-white bg-white/5 rounded-full">
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold text-text-subtle uppercase tracking-wider pl-1">Studio Tools</p>
              <Link href="/studio/workshop" onClick={() => { handleStudioLinkClick(); setMobileMenuOpen(false); }} className="text-xl font-bold text-white flex items-center gap-4 p-4 bg-white/5 rounded-2xl active:scale-95 transition-transform">
                <Globe className="text-blue-400" /> Workshop
              </Link>
              <Link href="/studio/creator" onClick={() => { handleStudioLinkClick(); setMobileMenuOpen(false); }} className="text-xl font-bold text-white flex items-center gap-4 p-4 bg-white/5 rounded-2xl active:scale-95 transition-transform">
                <Hammer className="text-primary" /> Texture Creator
              </Link>
              <Link href="/studio/world-tools" onClick={() => { handleStudioLinkClick(); setMobileMenuOpen(false); }} className="text-xl font-bold text-white flex items-center gap-4 p-4 bg-white/5 rounded-2xl active:scale-95 transition-transform">
                <Code2 className="text-green-400" /> Script AI
              </Link>
              <Link href="/studio/remix" onClick={() => { handleStudioLinkClick(); setMobileMenuOpen(false); }} className="text-xl font-bold text-white flex items-center gap-4 p-4 bg-white/5 rounded-2xl active:scale-95 transition-transform">
                <Layers className="text-pink-400" /> Remix Studio
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold text-text-subtle uppercase tracking-wider pl-1">Resources</p>
              <Link href="/studio/wiki" onClick={() => { handleStudioLinkClick(); setMobileMenuOpen(false); }} className="text-lg font-bold text-gray-300 flex items-center gap-4 p-4 bg-white/5 rounded-2xl active:scale-95 transition-transform">
                <BookOpen className="text-yellow-400" /> Blogs &amp; Guides
              </Link>
              <Link href="/studio/play" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-gray-300 flex items-center gap-4 p-4 bg-white/5 rounded-2xl active:scale-95 transition-transform">
                <Play className="text-emerald-400" /> Play Game
              </Link>
            </div>
          </div>
          <div className="p-6 pb-[env(safe-area-inset-bottom,1.5rem)] mt-auto border-t border-white/5 bg-[#0a0a0a]">
            <Link
              href="/studio"
              onClick={() => { handleStudioLinkClick(); setMobileMenuOpen(false); }}
              className="w-full py-4 bg-primary text-white font-bold rounded-lg flex justify-center items-center gap-2 shadow-[0_0_30px_-5px_rgba(255,107,57,0.5)] active:scale-95 transition-all text-lg"
            >
              Launch Studio <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      )}
      <main className="relative z-10">
        <section className="pt-32 pb-16 px-4 md:px-6 md:pt-40 md:pb-20 lg:pt-52 lg:pb-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-6 md:mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-100">
              Redefine Your <br />
              <span className="text-transparent bg-clip-text bg-linear-to-b from-white via-white to-gray-500">
                Bloxd Reality.
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-200">
              The professional utility suite for serious builders and developers.
              Create pixel-perfect textures, generate complex scripts with AI, and access a vast library of community assets.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-300">
              <Link
                href="/studio"
                onClick={handleStudioLinkClick}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white border border-white/10 font-bold rounded-lg hover:bg-primary-hover hover:border-white/20 transition-all flex items-center justify-center gap-2 group active:scale-95"
              >
                Launch Studio
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/studio/workshop"
                onClick={handleStudioLinkClick}
                className="w-full sm:w-auto px-8 py-4 bg-white/5 text-gray-300 border border-white/10 font-bold rounded-lg hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 backdrop-blur-sm active:scale-95"
              >
                <Globe className="w-4 h-4" />
                Browse Workshop
              </Link>
            </div>
            <div
              className="mt-16 md:mt-20 md:pt-10 md:border-t md:border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500"
              data-bf-section="metrics"
            >
              <StatItem label="Schematics" value={schematicsCount.toLocaleString()} />
              <StatItem label="Texture Packs" value={texturesCount.toLocaleString()} />
              <StatItem label="Scripts" value={scriptsCount.toLocaleString()} />
              <StatItem label="Monthly Visits" value="20k+" />
            </div>
          </div>
        </section>
        <section ref={workshopRef} className="py-16 md:py-24 px-4 md:px-6 bg-[#0a0a0a]" data-bf-section="workshop">
          <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="w-full order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem] blur-2xl opacity-50" />
              <WorkshopMarquee rows={workshopRows} isPaused={!workshopInView} />
            </div>
            <div className="w-full order-1 lg:order-2 text-left">
              <div className="inline-flex items-center gap-2 text-blue-400 font-bold mb-4 md:mb-6 tracking-wider uppercase text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Community Workshop
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
                Thousands of Assets <br className="hidden sm:block" />
                <span className="text-text-subtle">Ready to Deploy.</span>
              </h2>
              <p className="text-base md:text-lg text-text-muted mb-6 md:mb-8 leading-relaxed">
                Don&apos;t build alone. Access a vast library of community-created schematics, texture packs, and scripts. One-click downloads to enhance your world instantly.
              </p>
              <ul className="space-y-3 md:space-y-4 mb-8 text-sm md:text-base inline-block lg:block text-left">
                <FeaturePoint text="Download massive builds as schematics" />
                <FeaturePoint text="Find high-resolution texture packs" />
                <FeaturePoint text="Copy-paste ready scripts for minigames" />
                <FeaturePoint text="Verified safe and virus-free" />
              </ul>
              <div className="block">
                <Link href="/studio/workshop" onClick={handleStudioLinkClick} className="text-white border-b border-blue-400 pb-0.5 hover:text-blue-400 transition-colors inline-flex items-center gap-2 font-medium text-sm md:text-base">
                  Browse the Workshop <MoveRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section ref={textureRef} className="py-16 md:py-24 px-4 md:px-6 bg-[#050505]" data-bf-section="creator">
          <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="w-full order-2 lg:order-2 relative">
              <div className="absolute -inset-4 bg-linear-to-r from-primary/20 to-orange-500/20 rounded-[2rem] blur-2xl opacity-50" />
              <TexturePainter isPaused={!textureInView} />
            </div>
            <div className="w-full order-1 lg:order-1 text-left">
              <div className="inline-flex items-center gap-2 text-primary font-bold mb-4 md:mb-6 tracking-wider uppercase text-xs">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Texture Creator
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
                Pixel-Perfect Control <br className="hidden sm:block" />
                <span className="text-text-subtle">For Your Vision.</span>
              </h2>
              <p className="text-base md:text-lg text-text-muted mb-6 md:mb-8 leading-relaxed">
                Stop struggling with generic image editors. Our dedicated Texture Studio understands Bloxd.io&apos;s file structure natively and handles all the zip compression for you.
              </p>
              <ul className="space-y-3 md:space-y-4 mb-8 text-sm md:text-base inline-block lg:block text-left">
                <FeaturePoint text="Multi-resolution support (16x, 32x, 64x)" />
                <FeaturePoint text="Live 3D model preview for GLB files" />
                <FeaturePoint text="Folder-based project management" />
                <FeaturePoint text="One-click .zip export for immediate use" />
              </ul>
              <div className="block">
                <Link href="/studio/creator" onClick={handleStudioLinkClick} className="text-white border-b border-primary pb-0.5 hover:text-primary transition-colors inline-flex items-center gap-2 font-medium text-sm md:text-base">
                  Open Texture Studio <MoveRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section ref={toolsRef} className="py-16 md:py-24 px-4 md:px-6 bg-linear-to-b from-[#050505] to-[#0a0a0a]" data-bf-section="tools">
          <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="w-full order-1 lg:order-2 text-left">
              <div className="inline-flex items-center gap-2 text-green-400 font-bold mb-4 md:mb-6 tracking-wider uppercase text-xs">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                World Tools
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
                Code Without <br className="hidden sm:block" />
                <span className="text-text-subtle">The Complexity.</span>
              </h2>
              <p className="text-base md:text-lg text-text-muted mb-6 md:mb-8 leading-relaxed">
                Our assistant reads the official Bloxd API documentation, analyzes your script in real-time, and helps you debug, so you can focus on creating, not fighting syntax errors.
              </p>
              <ul className="space-y-3 md:space-y-4 mb-8 text-sm md:text-base inline-block lg:block text-left">
                <FeaturePoint text="Real-time error checking (Linting)" />
                <FeaturePoint text="AI assistant that reads game docs" />
                <FeaturePoint text="Generate, debug, and refactor code instantly" />
                <FeaturePoint text="Context-aware suggestions for your specific script" />
              </ul>
              <div className="block">
                <Link href="/studio/world-tools" onClick={handleStudioLinkClick} className="text-white border-b border-green-400 pb-0.5 hover:text-green-400 transition-colors inline-flex items-center gap-2 font-medium text-sm md:text-base">
                  Start Scripting <MoveRight size={16} />
                </Link>
              </div>
            </div>
            <div className="w-full order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-linear-to-l from-green-500/20 to-cyan-500/20 rounded-[2rem] blur-2xl opacity-50" />
              <AiCodeAnimation isPaused={!toolsInView} />
            </div>
          </div>
        </section>
        <section className="py-16 md:py-24 px-4 md:px-6 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Complete Ecosystem</h2>
              <p className="text-text-muted">Everything you need to master the game.</p>
            </div>
            <div className="flex md:grid flex-nowrap md:grid-cols-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-4 md:gap-6 pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="snap-center shrink-0 w-[85vw] md:w-auto md:col-span-2 bg-background border border-surface-border rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:border-white/20 transition-all flex flex-col">
                <div className="relative z-10 flex-1">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-400 mb-5 md:mb-6">
                    <Star size={24} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Blogs &amp; Guides</h3>
                  <p className="text-sm md:text-base text-text-muted max-w-md">Master Bedwars strategies, learn World Edit commands, and understand every block in the game with our comprehensive resources.</p>
                </div>
                <div className="absolute right-0 bottom-0 w-1/2 h-full bg-linear-to-l from-yellow-500/5 to-transparent pointer-events-none" />
              </div>
              <div className="snap-center shrink-0 w-[85vw] md:w-auto bg-background border border-surface-border rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:border-white/20 transition-all flex flex-col">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 mb-5 md:mb-6">
                  <Zap size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">FPS Boost</h3>
                <p className="text-xs md:text-sm text-text-muted flex-1">Built-in performance tools to optimize rendering and reduce lag on any device.</p>
              </div>
              <div className="snap-center shrink-0 w-[85vw] md:w-auto bg-background border border-surface-border rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:border-white/20 transition-all flex flex-col">
                <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-400 mb-5 md:mb-6">
                  <Layers size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Remix Studio</h3>
                <p className="text-xs md:text-sm text-text-muted flex-1">Combine multiple packs into one. Mix and match assets to create your ultimate loadout.</p>
              </div>
              <div className="snap-center shrink-0 w-[85vw] md:w-auto md:col-span-2 bg-background border border-surface-border rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:border-white/20 transition-all flex flex-col justify-between">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 h-full">
                  <div>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-5 md:mb-6">
                      <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Safety First</h3>
                    <p className="text-sm md:text-base text-text-muted max-w-sm">
                      Runs in your browser. No downloads, no account theft, no ToS violations. Community assets are encrypted and token-protected.
                    </p>
                  </div>
                  <div className="flex flex-wrap md:flex-nowrap gap-3 mt-auto md:mt-0">
                    <TechBadge icon={<Code2 size={16} />} label="Open Source" />
                    <TechBadge icon={<Box size={16} />} label="Sandboxed" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 md:py-24 px-4 md:px-6 bg-[#0a0a0a] border-t border-white/5" data-bf-section="faq">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <FAQItem
                question="Is BloxdForge safe to use?"
                answer="Yes. BloxdForge operates entirely within your web browser. We do not require you to download any executable files, ensuring your computer stays safe from malware. All texture packs and scripts are processed locally on your device."
              />
              <FAQItem
                question="How do I install texture packs in Bloxd.io?"
                answer="BloxdForge makes it easy. Create or download a pack in our Studio, export it as a .zip file, and then simply drag and drop that file into the Bloxd.io texture pack settings menu."
              />
              <FAQItem
                question="Does this work on mobile?"
                answer="Absolutely. BloxdForge is fully responsive and works on mobile browsers. However, for the best experience with the detailed Texture Editor, we recommend using a tablet or desktop."
              />
              <FAQItem
                question="Can I get banned for using this?"
                answer="No. BloxdForge provides utility tools like texture creation and local performance optimizations. We do not offer cheats, hacks, or competitive advantages that violate the Bloxd.io Terms of Service."
              />
              <FAQItem
                question="Is BloxdForge looking for help?"
                answer="Yes! We are currently looking for passionate individuals to join our team, including Software Engineers and a Community & Socials Manager. Check out the Careers page in the footer for more details."
              />
            </div>
          </div>
        </section>
        <section className="py-32 px-6 bg-[#050505] relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 blur-[100px] pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight leading-tight">
              Build Better. <br />
              <span className="text-primary">Play Smarter.</span>
            </h2>
            <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of creators enhancing their Bloxd.io experience today. No account required to start.
            </p>
            <Link
              href="/studio"
              onClick={handleStudioLinkClick}
              className="inline-flex items-center px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
            >
              Open Studio Now
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/5 bg-[#050505] pt-16 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="relative w-6 h-6 opacity-70 grayscale">
                  <Image loader={imageKitLoader} src="/logo.svg" alt="Logo" fill className="object-contain" />
                </div>
                <span className="font-bold text-white">BloxdForge</span>
              </div>
              <p className="text-xs text-text-subtle leading-relaxed max-w-[200px]">
                The #1 utility platform for Bloxd.io. Built by the community, for the community.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm md:text-base">Tools</h4>
              <ul className="space-y-2 text-sm text-text-subtle">
                <li><Link href="/studio/creator" onClick={handleStudioLinkClick} className="hover:text-primary transition-colors">Texture Creator</Link></li>
                <li><Link href="/studio/world-tools" onClick={handleStudioLinkClick} className="hover:text-primary transition-colors">Script AI</Link></li>
                <li><Link href="/studio/workshop" onClick={handleStudioLinkClick} className="hover:text-primary transition-colors">Workshop</Link></li>
                <li><Link href="/studio/remix" onClick={handleStudioLinkClick} className="hover:text-primary transition-colors">Remix Studio</Link></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-2">
              <h4 className="font-bold text-white mb-4 text-sm md:text-base">Resources</h4>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-text-subtle">
                <li><Link href="/studio/wiki" onClick={handleStudioLinkClick} className="hover:text-primary transition-colors">Blogs &amp; Guides</Link></li>
                <li><Link href="/studio/wiki/game-wiki" onClick={handleStudioLinkClick} className="hover:text-primary transition-colors">Game Wiki</Link></li>
                <li><Link href="/studio/wiki/api-docs" onClick={handleStudioLinkClick} className="hover:text-primary transition-colors">API Docs</Link></li>
                <li><Link href="/studio/settings?tab=support" className="hover:text-primary transition-colors">Changelog</Link></li>
                <li><a href="https://bloxdforge.canny.io/user-feedback" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Feedback &amp; Support</a></li>
                <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm md:text-base">Social</h4>
              <ul className="space-y-2 text-sm text-text-subtle">
                <li><a href="https://x.com/khrotubutms" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">X (Twitter)</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <span className="text-xs text-text-subtle">© 2026 BloxdForge. Not affiliated with Bloxd.io.</span>
          </div>
        </div>
      </footer>
      <div className={`md:hidden fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] left-0 right-0 px-4 z-40 flex justify-center pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${showBottomBar ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="w-full max-w-[340px] pointer-events-auto">
          <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/40 p-2">
            <Link
              href="/studio"
              onClick={handleStudioLinkClick}
              className="w-full py-4 bg-primary text-white text-base font-bold rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              Launch Studio <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}