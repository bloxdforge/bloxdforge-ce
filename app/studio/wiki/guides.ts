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

export interface Guide {
  id: string;
  title: string;
  description: string;
  dateShort: string;
  dateFull: string;
  targetKeyword: string;
  type: "guide" | "blog";
}
export const GUIDES: Guide[] = [
  { id: "why-choose-bloxdforge", title: "Why Choose BloxdForge? A Feature Comparison", description: "Compare BloxdForge with similar tools to find the best Bloxd.io toolset for your needs.", dateShort: "Feb 2026", dateFull: "Feb 12, 2026", targetKeyword: "bloxdforge vs bloxdhub vs bloxdium", type: "blog" },
  { id: "bloxdforge-versions", title: "The Evolution of BloxdForge: Understanding the Versions", description: "A comprehensive history of BloxdForge from the original PyInstaller app to the modern Next.js platform.", dateShort: "Feb 2026", dateFull: "Feb 11, 2026", targetKeyword: "bloxdforge versions history", type: "blog" },
  { id: "starter-guide", title: "How to Play Bloxd.io: Basic Controls", description: "Learn the basics of BloxdForge, from navigation to using the core tools.", dateShort: "Jan 2026", dateFull: "Jan 20, 2026", targetKeyword: "how to play bloxd.io controls", type: "guide" },
  { id: "bedwars-strategies", title: "Bloxd.io Bedwars Strategies", description: "Specific tactics and tips for succeeding in Bedwars mode.", dateShort: "Feb 2026", dateFull: "Feb 17, 2026", targetKeyword: "bloxd.io bedwars strategies", type: "guide" },
  { id: "texture-guide", title: "Texture Pack Creation Guide", description: "A complete guide to naming conventions and using the Creator studio.", dateShort: "Dec 2025", dateFull: "Dec 15, 2025", targetKeyword: "how to make bloxd texture pack", type: "guide" },
  { id: "game-modes-guide", title: "Guide to Bloxd.io Game Modes", description: "Overview of different game modes and their unique attributes.", dateShort: "Dec 2025", dateFull: "Dec 10, 2025", targetKeyword: "bloxd.io game modes guide", type: "guide" },
  { id: "modeling-guide", title: "3D Modeling (GLB) for Bloxd.io", description: "How to create 3D models for Bloxd using Blockbench.", dateShort: "Feb 2026", dateFull: "Feb 17, 2026", targetKeyword: "bloxd.io 3d models", type: "guide" },
  { id: "optimization-guide", title: "Performance & FPS Optimization", description: "Squeeze every frame out of your browser for the smoothest experience.", dateShort: "Nov 2025", dateFull: "Nov 19, 2025", targetKeyword: "bloxd.io fps boost", type: "guide" },
  { id: "combat-pvp-strategies", title: "Combat and PvP Strategies", description: "Detailed guide on combat techniques and PvP strategies.", dateShort: "Feb 2026", dateFull: "Feb 17, 2026", targetKeyword: "bloxd.io combat strategies", type: "guide" },
  { id: "sky-wars-strategies", title: "Bloxd.io Sky Wars Strategies", description: "Guide on strategies for Sky Wars mode.", dateShort: "Nov 2025", dateFull: "Nov 12, 2025", targetKeyword: "bloxd.io sky wars strategies", type: "guide" },
  { id: "coding-guide", title: "Scripting Basics with Code Blocks API", description: "Learn how to use the Code Blocks API to make interactive worlds.", dateShort: "Feb 2026", dateFull: "Feb 17, 2026", targetKeyword: "bloxd.io scripts for beginners", type: "guide" },
  { id: "survival-mode-strategies", title: "Advanced Survival Mode Strategies", description: "Detailed tactics for surviving and thriving in survival mode.", dateShort: "Oct 2025", dateFull: "Oct 18, 2025", targetKeyword: "bloxd.io survival mode strategies", type: "guide" },
  { id: "resource-gathering", title: "Resource Gathering and Crafting Guide", description: "Tips on efficient resource gathering and crafting.", dateShort: "Feb 2026", dateFull: "Feb 17, 2026", targetKeyword: "bloxd.io resource gathering", type: "guide" },
  { id: "infection-mode-strategies", title: "Bloxd.io Infection Mode Strategies", description: "Importance of teamwork and specific tactics for Infection mode.", dateShort: "Feb 2026", dateFull: "Feb 17, 2026", targetKeyword: "bloxd.io infection mode strategies", type: "guide" },
  { id: "building-techniques", title: "Building and Construction Techniques", description: "Guide on building structures, bases, and other constructions.", dateShort: "Feb 2026", dateFull: "Feb 17, 2026", targetKeyword: "bloxd.io building techniques", type: "guide" },
  { id: "bloxd-hop-strategies", title: "Bloxd Hop and Evil Tower Strategies", description: "Tips for mastering parkour challenges and Evil Tower mode.", dateShort: "Sep 2025", dateFull: "Sep 20, 2025", targetKeyword: "bloxd.io bloxd hop strategies", type: "guide" },
];