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
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  LayoutGrid,
  Paintbrush,
  ShoppingBag,
  BookOpen,
  Settings,
  Code2,
  ChevronLeft,
  ChevronRight,
  Layers,
  MoreHorizontal,
  MessageCircle,
  GraduationCap,
  FileText,
} from "lucide-react";
import { clsx } from "clsx";
import StudioMobileNav from "@/components/studio/StudioMobileNav";
import imageKitLoader from "@/lib/image-loader";
import useStudioEvents from "@/components/events/useStudioEvents";
import { STUDIO_EVENTS } from "@/components/events/studioEvents";
const GitHubIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
    <title>GitHub</title>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    activeEvents,
    openEvent,
    openEventRequiresDelay,
    openEventById,
    closeEvent,
  } = useStudioEvents(STUDIO_EVENTS);
  const ActiveEventModal = openEvent?.modal ?? null;
  return (
    <div className="flex h-screen w-screen bg-[#0a0a0a] overflow-hidden">
      <aside className={clsx(
        "hidden md:flex flex-col flex-shrink-0 bg-background border-r border-surface-border transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className={clsx("p-6 transition-all", !isSidebarOpen && "px-3")}>
          <Link href="/studio" className={clsx("flex items-center gap-3", !isSidebarOpen && "justify-center")}>
            <div className="w-8 h-8 relative shrink-0">
              <Image
                src="/logo.svg"
                alt="BloxdForge Logo"
                fill
                className="object-contain"
                loader={imageKitLoader}
              />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-lg tracking-tight text-white">
                BloxdForge
              </span>
            )}
          </Link>
        </div>
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          <NavSection title="Studio Hub" isSidebarOpen={isSidebarOpen}>
            <NavItem href="/studio" icon={<LayoutGrid size={18} />} label="Launcher" isSidebarOpen={isSidebarOpen} />
            <NavItem href="/studio/workshop" icon={<ShoppingBag size={18} />} label="Workshop" isSidebarOpen={isSidebarOpen} />
          </NavSection>
          {!isSidebarOpen && <hr className="mx-3 my-2 border-surface-border/50" />}
          <NavSection title="Editor Suite" isSidebarOpen={isSidebarOpen}>
            <NavItem href="/studio/creator" icon={<Paintbrush size={18} />} label="Texture Studio" isSidebarOpen={isSidebarOpen} />
            <NavItem href="/studio/remix" icon={<Layers size={18} />} label="Remix Studio" isSidebarOpen={isSidebarOpen} />
            <NavItem href="/studio/world-tools" icon={<Code2 size={18} />} label="World Tools" isSidebarOpen={isSidebarOpen} />
          </NavSection>
          {!isSidebarOpen && <hr className="mx-3 my-2 border-surface-border/50" />}
          <NavSection title="Resources" isSidebarOpen={isSidebarOpen}>
            <NavItem href="/studio/wiki" icon={<GraduationCap size={18} />} label="Blogs & Guides" isSidebarOpen={isSidebarOpen} excludePaths={['/studio/wiki/game-wiki', '/studio/wiki/api-docs']} />
            <NavItem href="/studio/wiki/game-wiki" icon={<BookOpen size={18} />} label="Game Wiki" isSidebarOpen={isSidebarOpen} />
            <NavItem href="/studio/wiki/api-docs" icon={<FileText size={18} />} label="API Docs" isSidebarOpen={isSidebarOpen} />
          </NavSection>
          {activeEvents.length > 0 && (
            <>
              {!isSidebarOpen && <hr className="mx-3 my-2 border-surface-border/50" />}
              <NavSection title="Events" isSidebarOpen={isSidebarOpen}>
                {activeEvents.map((event) => (
                  <NavButton
                    key={event.id}
                    onClick={() => openEventById(event.id)}
                    icon={event.icon}
                    label={event.sidebarLabel}
                    isSidebarOpen={isSidebarOpen}
                  />
                ))}
              </NavSection>
            </>
          )}
        </div>
        <div className="p-3 mt-auto">
            <ExternalIconsPopover isSidebarOpen={isSidebarOpen} />
            <hr className="border-surface-border my-2" />
            <div className="flex items-center justify-center space-x-1">
                <NavItem
                    href="/studio/settings"
                    icon={<Settings size={16} />}
                    label="Settings"
                    isSidebarOpen={isSidebarOpen}
                    className={isSidebarOpen ? "flex-grow" : ""}
                />
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-text-muted hover:text-white rounded-lg hover:bg-surface"
                    title={isSidebarOpen ? "Collapse" : "Expand"}
                >
                    {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
            </div>
        </div>
      </aside>
      <main className="flex-1 overflow-hidden relative flex flex-col h-full">
        {children}
      </main>
      <StudioMobileNav />
      {ActiveEventModal && openEvent && (
        <ActiveEventModal
          isOpen
          onClose={closeEvent}
          requireReadDelay={openEventRequiresDelay}
          eventId={openEvent.id}
        />
      )}
    </div>
  );
}
function NavSection({ title, children, isSidebarOpen }: { title: string, children: React.ReactNode, isSidebarOpen: boolean }) {
  return (
    <div className="mb-1">
      {isSidebarOpen && (
        <h3 className="px-3 mb-2 mt-3 text-xs font-semibold text-text-subtle uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}
function NavItem({ href, icon, label, isSidebarOpen, className, excludePaths }: { href: string, icon: React.ReactNode, label: string, isSidebarOpen: boolean, className?: string, excludePaths?: string[] }) {
  const pathname = usePathname();
  let isActive = pathname === href || (href !== "/studio" && pathname.startsWith(href));
  if (excludePaths && excludePaths.some(p => pathname.startsWith(p))) {
    isActive = false;
  }
  return (
    <Link
      href={href}
      title={!isSidebarOpen ? label : undefined}
      className={clsx(
        "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden",
        !isSidebarOpen && "justify-center",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-text-muted hover:text-gray-100 hover:bg-surface",
        className
      )}
    >
      <span className={clsx(
        "transition-colors duration-200",
        isActive ? "text-primary" : "text-text-subtle group-hover:text-white"
      )}>
        {icon}
      </span>
      {isSidebarOpen && label}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
      )}
    </Link>
  );
}
function NavButton({ onClick, icon, label, isSidebarOpen }: { onClick: () => void, icon: React.ReactNode, label: string, isSidebarOpen: boolean }) {
  return (
    <button
      onClick={onClick}
      title={!isSidebarOpen ? label : undefined}
      className={clsx(
        "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden",
        !isSidebarOpen && "justify-center",
        "text-text-muted hover:text-gray-100 hover:bg-surface"
      )}
    >
      <span className="text-text-subtle group-hover:text-white transition-colors duration-200">
        {icon}
      </span>
      {isSidebarOpen && label}
    </button>
  );
}
function ExternalIcon({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      aria-label={label}
      className="p-1.5 text-text-subtle hover:text-white hover:bg-surface rounded-lg transition-colors flex items-center justify-center"
    >
      {icon}
    </a>
  );
}
function ExternalIconsPopover({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);
  const externalLinks = [
    { href: "https://bloxdforge.canny.io/user-feedback", icon: <MessageCircle size={16} />, label: "Feedback" },
    { href: "https://khrotu.org", icon: <GitHubIcon />, label: "GitHub Profile" },
  ];
  if (isSidebarOpen) {
    return (
      <div className={clsx(
        "flex gap-1",
        "justify-start px-1 mb-2"
      )}>
        {externalLinks.map((link) => (
          <ExternalIcon key={link.href} {...link} />
        ))}
      </div>
    );
  }
  return (
    <div className="relative flex justify-center mb-2" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-text-subtle hover:text-white hover:bg-surface rounded-lg transition-colors flex items-center justify-center"
        aria-label="External links"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <MoreHorizontal size={18} />
      </button>
      {isOpen && (
        <div 
          className="absolute bottom-full left-0 mb-2 bg-surface border border-surface-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 origin-bottom-left"
          role="menu"
        >
          <div className="flex gap-1">
            {externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                role="menuitem"
                title={link.label}
                aria-label={link.label}
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}