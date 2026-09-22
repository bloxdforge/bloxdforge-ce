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
import { usePathname } from "next/navigation";
import { LayoutGrid, Layers, Paintbrush, Code2, Menu } from "lucide-react";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
export default function StudioMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = [
    { href: "/studio", icon: LayoutGrid, label: "Home" },
    { href: "/studio/workshop", icon: Layers, label: "Assets" },
    { href: "/studio/creator", icon: Paintbrush, label: "Create" },
    { href: "/studio/world-tools", icon: Code2, label: "Scripts" },
  ];
  const handleMenuClick = () => {
    router.push("/studio/settings");
  };
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-surface-border md:hidden" role="navigation" aria-label="Main navigation">
      <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={clsx(
                "flex flex-col items-center justify-center min-w-[44px] min-h-[44px] w-full h-full gap-1 active:scale-95 transition-transform",
                isActive ? "text-primary" : "text-text-subtle"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleMenuClick}
          aria-label="Open menu"
          className={clsx(
            "flex flex-col items-center justify-center min-w-[44px] min-h-[44px] w-full h-full gap-1 active:scale-95 transition-transform",
            pathname.startsWith("/studio/settings") || pathname.startsWith("/studio/wiki") ? "text-primary" : "text-text-subtle"
          )}
        >
          <Menu size={20} />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </div>
    </nav>
  );
}
