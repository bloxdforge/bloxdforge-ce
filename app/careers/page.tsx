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
import { ArrowLeft, MapPin, Briefcase } from "lucide-react";
import imageKitLoader from "@/lib/image-loader";
export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground selection:bg-primary/30 selection:text-white">
      <nav className="w-full border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="relative w-6 h-6">
                <Image
                  loader={imageKitLoader}
                  src="/logo.svg"
                  alt="BloxdForge Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-semibold text-sm text-white">BloxdForge</span>
            </Link>
            <span className="text-white/10 text-sm">/</span>
            <span className="text-sm text-white/50">Careers</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6">
        <section className="pt-20 pb-16 md:pt-28 md:pb-20 border-b border-white/[0.06]">
          <p className="text-sm text-primary font-medium mb-4">We&apos;re hiring</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight leading-[1.15]">
            Build tools that 15,000+
            <br className="hidden md:block" /> players rely on every month.
          </h1>
          <p className="text-base md:text-lg text-white/45 leading-relaxed max-w-2xl">
            BloxdForge is the #1 utility platform for the Bloxd.io community.
            We&apos;re looking for people who care about craft and want to ship
            work that gets used.
          </p>
          <p className="text-sm text-white/35 leading-relaxed max-w-2xl mt-4">
            BloxdForge is a community-driven open-source project. These are
            volunteer contributor roles &mdash; no salary, but genuine impact,
            real users, and work you can point to.
          </p>
        </section>
        <section className="py-14 border-b border-white/[0.06]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1.5">
                Remote-first
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Work from anywhere. We care about output, not timezones or hours
                logged.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1.5">
                Modern stack
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Next.js 15, React 19, Tailwind, Three.js, and WebGPU. No legacy
                code.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1.5">
                Ship to thousands
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Your work goes live to real users immediately. No six-month
                release cycles.
              </p>
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-lg font-semibold text-white">
              Open positions
            </h2>
            <span className="text-sm text-white/25">2 roles</span>
          </div>
          <div className="space-y-3">
            <div className="group border border-white/[0.08] hover:border-white/[0.15] rounded-xl p-6 md:p-8 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-white/45">
                      <Briefcase size={12} /> Engineering
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-white/45">
                      <MapPin size={12} /> Remote
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Full-Stack Software Engineer
                  </h3>
                  <p className="text-sm text-white/40 mb-5 leading-relaxed max-w-2xl">
                    Own and ship features across our entire product &mdash; from
                    real-time 3D rendering and an in-browser code editor to an
                    AI coding assistant and file conversion pipelines used daily
                    by the community.
                  </p>
                  <div>
                    <h4 className="text-xs font-semibold text-white/50 mb-2.5 uppercase tracking-wider">
                      What we&apos;re looking for
                    </h4>
                    <ul className="space-y-1.5 text-sm text-white/40">
                      <li className="flex items-start gap-2">
                        <span className="text-white/15 mt-0.5 shrink-0">
                          &mdash;
                        </span>
                        Strong TypeScript and React &mdash; you write clean,
                        typed code by default
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-white/15 mt-0.5 shrink-0">
                          &mdash;
                        </span>
                        Solid Next.js experience &mdash; App Router, Server
                        Components, and API routes
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-white/15 mt-0.5 shrink-0">
                          &mdash;
                        </span>
                        Comfortable owning features end-to-end, from design
                        to deployment
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-white/15 mt-0.5 shrink-0">
                          &mdash;
                        </span>
                        Experience with 3D graphics or WebGL, even hobbyist
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-white/10 mt-0.5 shrink-0">
                          &mdash;
                        </span>
                        <span className="text-white/30">
                          Bonus: client-side performance work, binary data
                          processing, or integrating AI / LLM APIs
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="group border border-white/[0.08] hover:border-white/[0.15] rounded-xl p-6 md:p-8 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-white/45">
                      <Briefcase size={12} /> Community
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-white/45">
                      <MapPin size={12} /> Remote
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Community &amp; Socials Manager
                  </h3>
                  <p className="text-sm text-white/40 mb-5 leading-relaxed max-w-2xl">
                    We get 15&ndash;20k visitors monthly but our Discord has
                    under 100 members. Help us turn traffic into a real community
                    and lead our presence across platforms.
                  </p>
                  <div>
                    <h4 className="text-xs font-semibold text-white/50 mb-2.5 uppercase tracking-wider">
                      What we&apos;re looking for
                    </h4>
                    <ul className="space-y-1.5 text-sm text-white/40">
                      <li className="flex items-start gap-2">
                        <span className="text-white/15 mt-0.5 shrink-0">
                          &mdash;
                        </span>
                        Proven track record growing Discord communities
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-white/15 mt-0.5 shrink-0">
                          &mdash;
                        </span>
                        Strong social media strategy (X, TikTok, YouTube)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-white/15 mt-0.5 shrink-0">
                          &mdash;
                        </span>
                        Can organize events, contests, and creator spotlights
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-white/15 mt-0.5 shrink-0">
                          &mdash;
                        </span>
                        Excellent writing and moderation skills
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-white/10 mt-0.5 shrink-0">
                          &mdash;
                        </span>
                        <span className="text-white/30">
                          Bonus: Familiar with Minecraft or Bloxd.io communities
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}