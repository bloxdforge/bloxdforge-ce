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

export const FAQ_SCHEMAS: Record<string, object> = {
  'bedwars-strategies': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "How do you defend your bed in Bloxd Bedwars?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Defend your bed in Bloxd Bedwars by layering defenses. Start with a cheap material like Wool on the outside, then Wood, and finally upgrade the core to blast-resistant End Stone or Obsidian as soon as you have the resources."
      }
    },{
      "@type": "Question",
      "name": "What is a good rushing strategy in Bedwars?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A good rushing strategy is to either 'speed rush' by bridging to a neighboring island immediately to catch them off guard, or to focus on controlling the Diamond Generators to purchase powerful team-wide upgrades like Sharpness."
      }
    }]
  },
  'bloxd-hop-strategies': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "How do you jump farther in Bloxd Hop?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can jump farther in Bloxd Hop by holding the Sprint key to build momentum and by 'bunny hopping' (jumping the instant you land on a block) to maintain your forward speed across platforms."
      }
    },{
      "@type": "Question",
      "name": "What are the most important parkour skills in Bloxd.io?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most important parkour skills include sprint management for momentum, braking on small platforms by releasing movement keys, performing precise corner jumps to navigate turns, and using ladder jumps to climb faster."
      }
    }]
  },
  'building-techniques': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "What are the best building techniques in Bloxd.io?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The best building techniques involve creating depth by adding pillars or recessed windows instead of building flat walls, and texturing by mixing similar block types like Stone, Cobblestone, and Andesite for a more realistic and weathered appearance."
      }
    },{
      "@type": "Question",
      "name": "How do you build a secure base in Bloxd.io?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To build a secure base, use strong foundational materials like stone, add an overhang or 'lip' to your roof to prevent players and spiders from climbing over, and ensure the entire area is well-lit with torches to stop hostile mobs from spawning inside or on top."
      }
    }]
  },
  'coding-guide': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "How do you use scripts in Bloxd.io?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can use scripts by placing a 'Code Block' in your world and writing JavaScript inside it. The code runs when a player interacts with the block, using the global 'api' object to modify the game world, such as teleporting players or giving items."
      }
    },{
      "@type": "Question",
      "name": "What are some basic scripting commands in Bloxd.io?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Some of the most common scripting commands are `api.teleport(myId, x, y, z)` to move a player, `api.giveItem(myId, 'diamond', 1)` to grant items, and `api.setVelocity(myId, 0, 15, 0)` to launch a player into the air."
      }
    }]
  },
  'combat-pvp-strategies': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "How do you win PvP fights in Bloxd.io?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To win PvP fights, you should strafe left and right to make yourself a harder target, perform critical hits by jumping and attacking as you fall, and keep an organized hotbar to quickly switch between your sword, blocks, and food."
      }
    },{
      "@type": "Question",
      "name": "When should you eat during Bloxd.io PvP?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You should eat before your hunger bar is empty to ensure you are always regenerating health. For tough fights, eat a Golden Apple beforehand to gain temporary 'absorption' hearts that act as an extra shield."
      }
    }]
  },
  'game-modes-guide': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "What are the main game modes in Bloxd.io?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The main game modes in Bloxd.io include Survival, Creative, Bedwars, Sky Wars, Bloxd Hop, and Infection. Each mode offers a unique objective, ranging from open-world building and survival to fast-paced, competitive PvP."
      }
    },{
      "@type": "Question",
      "name": "What is the objective of Bedwars in Bloxd.io?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In Bedwars, the objective is to protect your team's bed while destroying the beds of opposing teams. A team's bed is their respawn point; once it's destroyed, players on that team will not respawn when they die."
      }
    }]
  },
  'infection-mode-strategies': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "How do you win as a human in Bloxd Infection?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To win as a human, you must work with your team. Stick together to combine firepower, hold high ground that is difficult for zombies to reach, and conserve your ammunition by tap-firing instead of spraying."
      }
    },{
      "@type": "Question",
      "name": "How do you win as a zombie in Bloxd Infection?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To win as a zombie, use swarm tactics by waiting for other zombies and attacking in a large group. Use special abilities like Acid Spit to flush out camping humans and try to cut off their escape routes to the extraction points."
      }
    }]
  },
  'modeling-guide': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "How do you make 3D models for Bloxd.io?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The recommended way to make 3D models for Bloxd.io is by using a free tool like Blockbench. You can create a 'Generic Model,' build your shape using cubes, paint it directly in the application, and then export it as a Binary glTF (.glb) file."
      }
    },{
      "@type": "Question",
      "name": "What is the file format for Bloxd.io 3D models?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The required file format for custom 3D models in Bloxd.io is GLB (.glb), which is the binary version of the glTF 2.0 format."
      }
    }]
  },
  'optimization-guide': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "How can I boost FPS in Bloxd.io?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can boost your FPS in Bloxd.io by enabling 'Hardware Acceleration' in your browser's settings and lowering in-game graphics options. The most impactful settings to lower are 'Horizontal Chunk Load Distance' and 'Pixel Scale'."
      }
    },{
      "@type": "Question",
      "name": "What settings should I turn off for better performance in Bloxd.io?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For a significant performance increase, you should turn off (uncheck) graphics-intensive settings like 'Show Fog' and 'Anti-Aliasing'. Additionally, closing all other unused browser tabs will free up system resources and improve game performance."
      }
    }]
  },
  'resource-gathering': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "At what level does Moonstone spawn in Bloxd.io?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Moonstone spawns exclusively at Y-level -85 in Survival and Sandbox modes. It is hard-locked to this single vertical layer."
      }
    },{
      "@type": "Question",
      "name": "How do I get water for my farm in Bloxd.io?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can obtain water by using a bucket on natural water sources or by right-clicking a Fat Cactus, which acts as a renewable water source."
      }
    },{
      "@type": "Question",
      "name": "What food gives a speed boost in Bloxd.io?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Eating a Cracked Coconut provides an 8-second speed boost. Coconuts can be found by breaking Fruity Palm Leaves in Jungle biomes."
      }
    }]
  },
  'sky-wars-strategies': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "How do you win in Bloxd Sky Wars?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To win in Sky Wars, you must act quickly. Loot your starting island's chests, then immediately decide whether to rush a nearby opponent or bridge to the center island to secure better loot. Use projectiles like snowballs and eggs to knock other players into the void."
      }
    },{
      "@type": "Question",
      "name": "What is the best starting strategy for a Sky Wars game?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The best starting strategy is to loot your chests as fast as possible using shift-click. If you get building blocks, immediately bridge to the middle island to control the best gear. If you don't get blocks, use any projectiles you found to defend your island from incoming players."
      }
    }]
  },
  'starter-guide': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "What is BloxdForge?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BloxdForge is an all-in-one utility and resource website for the game Bloxd.io. It provides a suite of tools that allow players to create texture packs, download community-made assets from the Workshop, and write and debug game scripts with an AI assistant."
      }
    },{
      "@type": "Question",
      "name": "How do I save coordinates in Bloxd.io using BloxdForge?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can save coordinates by launching the game through the BloxdForge 'Launcher' page. This will open the game with an integrated sidebar that includes a 'Coordinates Manager' tool, allowing you to save, name, and manage important in-game locations."
      }
    }]
  },
  'survival-mode-strategies': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "What should you do on the first day in Bloxd.io Survival?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "On your first day in Bloxd.io Survival, your main priorities are to gather at least 16 wood logs, craft a workbench, make basic wooden tools (a pickaxe and an axe), and build a small, well-lit shelter before nightfall to protect yourself from hostile mobs."
      }
    },{
      "@type": "Question",
      "name": "How do you make torches if you can't find coal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If you cannot find coal, you can make Charcoal to craft torches. First, create a furnace. Then, place wood logs in both the top (input) and bottom (fuel) slots of the furnace. The resulting Charcoal can be combined with sticks to make torches."
      }
    }]
  },
  'texture-guide': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "How do you make a texture pack for Bloxd.io?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can make a texture pack by using the BloxdForge 'Texture Creator' tool. This tool allows you to upload existing images or create new blank textures, edit them with pixel-art tools, and then download them. It is important to follow the correct file naming conventions."
      }
    },{
      "@type": "Question",
      "name": "What are the correct file names for Bloxd.io textures?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The game relies on specific file names to apply textures correctly. Key file names include `stone.png`, `dirt.png`, `grass_top.png` for the top of grass blocks, `grass_side.png` for the sides, and `log_maple.png` for maple tree logs."
      }
    }]
  }
};
export const HOWTO_SCHEMAS: Record<string, object> = {
  'texture-guide': {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Make a Bloxd.io Texture Pack",
    "description": "Step-by-step guide to create custom texture packs for Bloxd.io using BloxdForge's texture creator.",
    "image": "https://www.bloxdforge.com/og-image.png",
    "totalTime": "PT30M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "tool": [{
      "@type": "HowToTool",
      "name": "BloxdForge Texture Creator"
    }],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Open the Texture Creator",
        "text": "Navigate to the BloxdForge Studio and click on the Texture Creator tool."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Select Textures to Edit",
        "text": "Browse the texture list and click on the textures you want to customize. You can search for specific blocks."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Edit Your Textures",
        "text": "Use the pixel art editor to modify colors, draw patterns, or upload custom images. Use the color picker and drawing tools."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Preview Your Changes",
        "text": "Click the preview button to see how your textures look in 3D before exporting."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Export Your Pack",
        "text": "Click the Export button to download your texture pack as a ZIP file. You can then apply it in Bloxd.io."
      }
    ]
  },
  'coding-guide': {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Write Scripts in Bloxd.io",
    "description": "Learn to write JavaScript scripts using Code Blocks in Bloxd.io with the BloxdForge AI assistant.",
    "image": "https://www.bloxdforge.com/og-image.png",
    "totalTime": "PT1H",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Create a World",
        "text": "Start by creating or joining a world where you have building permissions."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Place a Code Block",
        "text": "Open your inventory, find the Code Block item, and place it in your world where you want the script to run."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Open the Code Editor",
        "text": "Right-click the Code Block to open the in-game editor, or use BloxdForge's World Tools for a better editing experience."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Write Your Script",
        "text": "Write JavaScript code using the Bloxd.io API. Use functions like api.teleport(), api.giveItem(), and api.setBlock() to interact with the game."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Test Your Script",
        "text": "Click the Code Block in-game to trigger your script and see if it works as expected. Debug any errors using console.log()."
      }
    ]
  },
  'optimization-guide': {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Boost FPS in Bloxd.io",
    "description": "Optimize Bloxd.io performance and reduce lag with these FPS boost tips.",
    "image": "https://www.bloxdforge.com/og-image.png",
    "totalTime": "PT15M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Enable Hardware Acceleration",
        "text": "Go to your browser settings (Chrome/Edge), search for 'Hardware Acceleration' and make sure it's enabled."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Lower Graphics Settings",
        "text": "In Bloxd.io game settings, reduce 'Horizontal Chunk Load Distance' and lower 'Pixel Scale' to boost FPS."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Disable Graphics Effects",
        "text": "Turn off 'Show Fog' and 'Anti-Aliasing' in the graphics menu for better performance."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Use an FPS Boost Texture Pack",
        "text": "Download an FPS boost texture pack from the BloxdForge Workshop to reduce visual complexity."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Close Other Tabs",
        "text": "Close unused browser tabs and applications to free up system resources for the game."
      }
    ]
  },
  'modeling-guide': {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Create 3D Models for Bloxd.io",
    "description": "Create custom 3D GLB models for Bloxd.io using Blockbench.",
    "image": "https://www.bloxdforge.com/og-image.png",
    "totalTime": "PT1H30M",
    "tool": [{
      "@type": "HowToTool",
      "name": "Blockbench"
    }],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Download Blockbench",
        "text": "Download and install Blockbench, a free 3D modeling tool, from blockbench.net."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Create a New Project",
        "text": "Open Blockbench and select 'Generic Model' to start a new 3D model project."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Build Your Model",
        "text": "Use the cube tool to create shapes. Add, resize, and position cubes to form your 3D model."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Add Textures",
        "text": "Use the Paint tab to add colors and patterns to your model. You can paint directly or import texture images."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Export as GLB",
        "text": "Go to File > Export > Export as GLB to save your model in the format required by Bloxd.io."
      }
    ]
  },
  'starter-guide': {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Play Bloxd.io - Getting Started",
    "description": "Complete beginner's guide to playing Bloxd.io, learning controls, and basic gameplay.",
    "image": "https://www.bloxdforge.com/og-image.png",
    "totalTime": "PT20M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Go to Bloxd.io",
        "text": "Open your web browser and navigate to bloxd.io or use the BloxdForge launcher."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Learn Basic Controls",
        "text": "Use WASD to move, Space to jump, Mouse to look around, and Left Click to break/attack."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Choose a Game Mode",
        "text": "Select from Survival, Creative, Bedwars, or other game modes from the main menu."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Practice Building",
        "text": "Use Right Click to place blocks. Number keys (1-9) switch between items in your hotbar."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Explore BloxdForge Tools",
        "text": "Visit BloxdForge to access texture creators, workshops, script editors, and advanced tools."
      }
    ]
  }
};
