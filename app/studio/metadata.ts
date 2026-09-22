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

import { Metadata } from 'next'
export const studioMetadata: Metadata = {
  title: 'Studio',
  description: 'BloxdForge Studio - Your central hub for Bloxd.io tools. Access the Workshop, Texture Creator, Remix Studio, World Tools, and Resources all in one place.',
  alternates: {
    canonical: 'https://www.bloxdforge.com/studio',
  },
  openGraph: {
    title: 'BloxdForge Studio - Your Bloxd.io Command Center',
    description: 'Access all BloxdForge tools in one place: Workshop, Texture Creator, World Tools, and comprehensive guides.',
    url: 'https://www.bloxdforge.com/studio',
    type: 'website',
  },
}
export const workshopMetadata: Metadata = {
  title: 'Workshop - Community Mods & Assets',
  description: 'Browse and download community-created texture packs, schematics, and scripts for Bloxd.io. Free mods, FPS boost packs, and building tools.',
  keywords: [
    'bloxd.io workshop',
    'bloxd texture packs download',
    'bloxd schematics',
    'bloxd scripts free',
    'bloxd mods community',
    'bloxd fps boost pack',
    'bloxd resource packs',
  ],
  alternates: {
    canonical: 'https://www.bloxdforge.com/studio/workshop',
  },
  openGraph: {
    title: 'Workshop - Bloxd.io Community Mods & Assets',
    description: 'Download free texture packs, schematics, and scripts created by the Bloxd.io community.',
    url: 'https://www.bloxdforge.com/studio/workshop',
    type: 'website',
  },
}
export const creatorMetadata: Metadata = {
  title: 'Texture Creator - Make Custom Texture Packs',
  description: 'Create custom texture packs for Bloxd.io with our free online editor. Edit individual textures, preview changes in real-time, and export ready-to-use packs.',
  keywords: [
    'bloxd texture creator',
    'bloxd texture editor',
    'how to make bloxd texture pack',
    'bloxd custom textures',
    'bloxd pack maker',
    'edit bloxd textures online',
  ],
  alternates: {
    canonical: 'https://www.bloxdforge.com/studio/creator',
  },
  openGraph: {
    title: 'Texture Creator - Make Custom Bloxd.io Texture Packs',
    description: 'Free online texture editor for Bloxd.io. Create custom texture packs with real-time preview.',
    url: 'https://www.bloxdforge.com/studio/creator',
    type: 'website',
  },
}
export const remixMetadata: Metadata = {
  title: 'Remix Studio - Customize Texture Packs',
  description: 'Remix and customize existing Bloxd.io texture packs. Change colors, modify textures, and create unique variations of community packs.',
  keywords: [
    'bloxd remix textures',
    'customize bloxd packs',
    'bloxd texture editor',
    'modify bloxd resource pack',
    'bloxd pack customizer',
  ],
  alternates: {
    canonical: 'https://www.bloxdforge.com/studio/remix',
  },
  openGraph: {
    title: 'Remix Studio - Customize Bloxd.io Texture Packs',
    description: 'Remix and customize texture packs for Bloxd.io. Create unique variations easily.',
    url: 'https://www.bloxdforge.com/studio/remix',
    type: 'website',
  },
}
export const worldToolsMetadata: Metadata = {
  title: 'World Tools - Scripts & Commands',
  description: 'World edit commands, scripts, and utilities for Bloxd.io. AI-powered script assistant, coordinate manager, and building tools.',
  keywords: [
    'bloxd world edit',
    'bloxd commands',
    'bloxd scripts',
    'bloxd world tools',
    'bloxd coordinate manager',
    'bloxd building commands',
  ],
  alternates: {
    canonical: 'https://www.bloxdforge.com/studio/world-tools',
  },
  openGraph: {
    title: 'World Tools - Bloxd.io Scripts & Commands',
    description: 'World edit commands and scripts for Bloxd.io. AI-powered tools for builders.',
    url: 'https://www.bloxdforge.com/studio/world-tools',
    type: 'website',
  },
}
export const wikiMetadata: Metadata = {
  title: 'Blogs & Guides - Learn Bloxd.io',
  description: 'Comprehensive guides and tutorials for Bloxd.io. Learn building techniques, PVP strategies, survival tips, and how to use BloxdForge tools.',
  keywords: [
    'bloxd.io wiki',
    'bloxd guide',
    'bloxd tutorial',
    'bloxd building tips',
    'bloxd pvp guide',
    'bloxd survival guide',
    'how to play bloxd',
  ],
  alternates: {
    canonical: 'https://www.bloxdforge.com/studio/wiki',
  },
  openGraph: {
    title: 'Blogs & Guides - Learn Bloxd.io Strategies',
    description: 'Comprehensive guides for Bloxd.io: building techniques, PVP strategies, survival tips, and tool tutorials.',
    url: 'https://www.bloxdforge.com/studio/wiki',
    type: 'website',
  },
}
export const gameWikiMetadata: Metadata = {
  title: 'Game Wiki - Bloxd.io Items & Mechanics Reference',
  description: 'Complete Bloxd.io game wiki. Browse items, blocks, crafting recipes, and game mechanics. Searchable reference for all Bloxd.io content.',
  keywords: [
    'bloxd.io wiki',
    'bloxd.io items',
    'bloxd.io blocks',
    'bloxd.io crafting',
    'bloxd.io game mechanics',
    'bloxd.io reference',
  ],
  alternates: {
    canonical: 'https://www.bloxdforge.com/studio/wiki/game-wiki',
  },
  openGraph: {
    title: 'Game Wiki - Bloxd.io Items & Mechanics Reference',
    description: 'Complete Bloxd.io game wiki with searchable items, blocks, crafting recipes, and game mechanics.',
    url: 'https://www.bloxdforge.com/studio/wiki/game-wiki',
    type: 'website',
  },
}
export const apiDocsMetadata: Metadata = {
  title: 'API Docs - Bloxd.io Code Blocks Reference',
  description: 'Official Bloxd.io Code Blocks API documentation. Functions, events, parameters, and examples for scripting in Bloxd.io worlds.',
  keywords: [
    'bloxd.io api',
    'bloxd.io code blocks',
    'bloxd.io api documentation',
    'bloxd.io scripting reference',
    'bloxd.io functions',
    'bloxd.io api reference',
  ],
  alternates: {
    canonical: 'https://www.bloxdforge.com/studio/wiki/api-docs',
  },
  openGraph: {
    title: 'API Docs - Bloxd.io Code Blocks Reference',
    description: 'Official Bloxd.io Code Blocks API documentation with functions, events, and examples.',
    url: 'https://www.bloxdforge.com/studio/wiki/api-docs',
    type: 'website',
  },
}
export const recorderMetadata: Metadata = {
  title: 'Screen Recorder - Record Bloxd.io Gameplay',
  description: 'Free browser-based screen recorder for capturing Bloxd.io gameplay clips. No downloads required. Record and save as .webm directly from your browser.',
  keywords: [
    'bloxd.io recorder',
    'bloxd gameplay recording',
    'screen recorder browser',
    'record bloxd.io',
  ],
  alternates: {
    canonical: 'https://www.bloxdforge.com/recorder',
  },
  openGraph: {
    title: 'Screen Recorder - Record Bloxd.io Gameplay',
    description: 'Free browser-based screen recorder for Bloxd.io. No downloads, record directly in your browser.',
    url: 'https://www.bloxdforge.com/recorder',
    type: 'website',
  },
}
export const guideMetadata: Record<string, Metadata> = {
  'starter-guide': {
    title: 'How to Play Bloxd.io - Complete Beginner Guide 2026',
    description: 'Master Bloxd.io controls and gameplay with our complete beginner guide. Learn basic controls, movement, building, combat, and essential tips for new players. Start your Bloxd.io journey today!',
    keywords: [
      'how to play bloxd.io',
      'bloxd.io controls',
      'bloxd.io beginner guide',
      'bloxd.io tutorial',
      'bloxd.io tips for beginners',
      'learn bloxd.io',
      'bloxd.io game guide',
      'bloxd.io how to start',
    ],
    alternates: {
      canonical: 'https://www.bloxdforge.com/studio/wiki/guides/starter-guide',
    },
  },
  'bloxdforge-versions': {
    title: 'BloxdForge Version History - Evolution from Desktop to Web',
    description: 'Complete history of BloxdForge evolution: v1 PyInstaller desktop app, v2 Electron, v3 web platform, to the modern Next.js PWA. Learn about features, improvements, and migration.',
    keywords: [
      'bloxdforge versions',
      'bloxdforge history',
      'bloxdforge evolution',
      'bloxdforge v1 v2 v3',
      'bloxdforge desktop app',
      'bloxdforge pwa',
      'bloxdforge changelog',
    ],
    alternates: {
      canonical: 'https://www.bloxdforge.com/studio/wiki/guides/bloxdforge-versions',
    },
  },
  'why-choose-bloxdforge': {
    title: 'BloxdForge vs Bloxdhub vs Bloxdium - Which is Best? 2026',
    description: 'Comprehensive comparison: BloxdForge vs Bloxdhub vs Bloxdium. Compare features, texture creators, workshops, script editors, performance, and pricing. Find the best Bloxd.io tool for you.',
    keywords: [
      'bloxdforge vs bloxdhub',
      'bloxdforge vs bloxdium',
      'bloxdhub vs bloxdium',
      'best bloxd.io tool',
      'bloxd.io editor comparison',
      'bloxd texture pack maker comparison',
      'bloxdforge features',
    ],
    alternates: {
      canonical: 'https://www.bloxdforge.com/studio/wiki/guides/why-choose-bloxdforge',
    },
  },
  'texture-guide': {
    title: 'How to Make Bloxd.io Texture Packs - Complete Tutorial 2026',
    description: 'Step-by-step guide to create custom texture packs for Bloxd.io. Learn texture naming conventions, file formats, the Creator tool, editing textures, and exporting packs. Free online editor included.',
    keywords: [
      'how to make bloxd texture pack',
      'bloxd.io texture pack tutorial',
      'create bloxd textures',
      'bloxd texture creator guide',
      'custom bloxd textures',
      'bloxd pack naming conventions',
      'bloxd texture format',
    ],
    alternates: {
      canonical: 'https://www.bloxdforge.com/studio/wiki/guides/texture-guide',
    },
  },
  'modeling-guide': {
    title: 'Bloxd.io 3D Modeling Guide - Create Custom GLB Models',
    description: 'Create custom 3D models (GLB format) for Bloxd.io using Blockbench. Learn modeling basics, texturing, animations, and importing models into Bloxd. Complete Blockbench tutorial.',
    keywords: [
      'bloxd.io 3d models',
      'bloxd glb models',
      'blockbench bloxd tutorial',
      'create bloxd models',
      'bloxd.io modeling guide',
      'custom bloxd models',
      'bloxd 3d modeling',
    ],
    alternates: {
      canonical: 'https://www.bloxdforge.com/studio/wiki/guides/modeling-guide',
    },
  },
  'optimization-guide': {
    title: 'Bloxd.io FPS Boost - Optimize Performance & Reduce Lag 2026',
    description: 'Boost FPS and reduce lag in Bloxd.io with our optimization guide. FPS boost texture packs, browser settings, hardware acceleration, graphics options, and performance tweaks.',
    keywords: [
      'bloxd.io fps boost',
      'bloxd performance optimization',
      'bloxd reduce lag',
      'bloxd fps pack',
      'increase bloxd fps',
      'bloxd.io lag fix',
      'optimize bloxd performance',
    ],
    alternates: {
      canonical: 'https://www.bloxdforge.com/studio/wiki/guides/optimization-guide',
    },
  },
  'coding-guide': {
    title: 'Bloxd.io Scripts for Beginners - Code Blocks API Tutorial',
    description: 'Learn Bloxd.io scripting with Code Blocks. JavaScript basics, API reference, functions, events, player interactions, and AI-assisted coding. Complete beginner-friendly scripting guide.',
    keywords: [
      'bloxd.io scripts for beginners',
      'bloxd code blocks tutorial',
      'bloxd.io api reference',
      'bloxd scripting guide',
      'bloxd javascript tutorial',
      'code blocks bloxd',
      'bloxd.io coding',
    ],
    alternates: {
      canonical: 'https://www.bloxdforge.com/studio/wiki/guides/coding-guide',
    },
  },
  'survival-mode-strategies': {
    title: 'Bloxd.io Survival Mode Guide - Tips & Strategies 2026',
    description: 'Master Bloxd.io survival mode with advanced strategies. Base building, resource gathering, mob defense, raiding, protectors, and progression tips. Dominate survival sandbox.',
    keywords: [
      'bloxd.io survival mode',
      'bloxd survival strategies',
      'bloxd.io survival guide',
      'bloxd survival tips',
      'bloxd base building',
      'bloxd.io sandbox mode',
      'bloxd survival tips',
    ],
    alternates: {
      canonical: 'https://www.bloxdforge.com/studio/wiki/guides/survival-mode-strategies',
    },
  },
  'resource-gathering': {
    title: 'Bloxd.io Resource Gathering - Mining & Farming Guide',
    description: 'Efficient resource gathering in Bloxd.io. Best mining techniques, farming strategies, ore locations, resource management, tool upgrades, and automated farming systems.',
    keywords: [
      'bloxd.io resource gathering',
      'bloxd mining guide',
      'bloxd.io farming tips',
      'bloxd ore locations',
      'efficient mining bloxd',
      'bloxd resource management',
      'bloxd.io crafting materials',
    ],
    alternates: {
      canonical: 'https://www.bloxdforge.com/studio/wiki/guides/resource-gathering',
    },
  },
  'building-techniques': {
    title: 'Bloxd.io Building Techniques - Architecture & Design Guide',
    description: 'Master advanced building techniques in Bloxd.io. Learn architectural styles, terraforming, interior design, redstone-like mechanics, decorative building, and creative construction tips.',
    keywords: [
      'bloxd.io building techniques',
      'bloxd building guide',
      'bloxd.io architecture',
      'bloxd building tips',
      'bloxd construction guide',
      'bloxd.io creative building',
      'bloxd building ideas',
    ],
    alternates: {
      canonical: 'https://www.bloxdforge.com/studio/wiki/guides/building-techniques',
    },
  },
  'combat-pvp-strategies': {
    title: 'Bloxd.io Combat Guide - PVP Strategies & Fighting Tips',
    description: 'Master PVP combat in Bloxd.io. Learn fighting techniques, weapon strategies, combos, movement tactics, aim improvement, and tips to dominate every battle. Advanced PVP guide.',
    keywords: [
      'bloxd.io combat strategies',
      'bloxd pvp guide',
      'bloxd.io fighting tips',
      'bloxd combat techniques',
      'bloxd pvp strategies',
      'bloxd.io weapon guide',
      'bloxd combat tips',
    ],
    alternates: {
      canonical: 'https://www.bloxdforge.com/studio/wiki/guides/combat-pvp-strategies',
    },
  },
  'game-modes-guide': {
    title: 'Bloxd.io Game Modes - Complete Guide to All Modes 2026',
    description: 'Complete guide to all Bloxd.io game modes. Survival, Bedwars, Sky Wars, Infection, Cube Warfare, Lucky Blocks, 99 Nights, One Block, and more. Rules, strategies, and tips.',
    keywords: [
      'bloxd.io game modes',
      'bloxd.io modes list',
      'all bloxd game modes',
      'bloxd.io game types',
      'bloxd modes guide',
      'bloxd.io gameplay modes',
      'bloxd game mode tips',
    ],
    alternates: {
      canonical: 'https://www.bloxdforge.com/studio/wiki/guides/game-modes-guide',
    },
  },
  'bedwars-strategies': {
    title: 'Bloxd.io Bedwars Guide - Win Every Game with These Tips',
    description: 'Master Bedwars in Bloxd.io. Bed defense strategies, rush tactics, resource management, generator upgrades, team coordination, and winning strategies. Complete 2026 meta guide.',
    keywords: [
      'bloxd.io bedwars strategies',
      'bloxd bedwars guide',
      'bloxd.io bedwars tips',
      'bedwars bloxd tutorial',
      'bloxd bedwars defense',
      'bloxd.io bedwars rush',
      'win bedwars bloxd',
    ],
    alternates: {
      canonical: 'https://www.bloxdforge.com/studio/wiki/guides/bedwars-strategies',
    },
  },
  'sky-wars-strategies': {
    title: 'Bloxd.io Sky Wars Guide - Strategies & Tips to Win',
    description: 'Dominate Sky Wars in Bloxd.io. Island strategies, loot routes, bridge techniques, combat tactics, map control, and winning strategies. Complete Sky Wars guide.',
    keywords: [
      'bloxd.io sky wars strategies',
      'bloxd sky wars guide',
      'bloxd.io sky wars tips',
      'sky wars bloxd tutorial',
      'bloxd sky wars map',
      'bloxd.io sky wars tactics',
      'win sky wars bloxd',
    ],
    alternates: {
      canonical: 'https://www.bloxdforge.com/studio/wiki/guides/sky-wars-strategies',
    },
  },
  'infection-mode-strategies': {
    title: 'Bloxd.io Infection Mode - Survival & Zombie Strategies',
    description: 'Master Infection mode in Bloxd.io. Survival strategies for humans, zombie tactics, team coordination, map control, hiding spots, and winning strategies for both sides.',
    keywords: [
      'bloxd.io infection mode',
      'bloxd infection strategies',
      'bloxd.io infection tips',
      'infection mode bloxd guide',
      'bloxd zombie strategies',
      'bloxd.io infection survival',
      'bloxd infection tactics',
    ],
    alternates: {
      canonical: 'https://www.bloxdforge.com/studio/wiki/guides/infection-mode-strategies',
    },
  },
  'bloxd-hop-strategies': {
    title: 'Bloxd Hop Guide - Parkour Tips & Evil Tower Strategies',
    description: 'Master Bloxd Hop parkour and Evil Tower mode. Jump techniques, precision timing, level walkthroughs, checkpoint strategies, and advanced parkour tips. Complete movement guide.',
    keywords: [
      'bloxd hop strategies',
      'bloxd.io parkour guide',
      'bloxd hop tips',
      'bloxd evil tower guide',
      'bloxd.io bloxd hop',
      'bloxd parkour tutorial',
      'bloxd hop tricks',
    ],
    alternates: {
      canonical: 'https://www.bloxdforge.com/studio/wiki/guides/bloxd-hop-strategies',
    },
  },
}
