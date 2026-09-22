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

export interface ChangelogEntry {
  version: string;
  date: string;
  type: 'Major' | 'Minor' | 'Patch';
  changes: {
    added?: string[];
    improved?: string[];
    renderingEngine?: string[];
    removed?: string[];
    fixed?: string[];
    changed?: string[];
  };
}
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "v2.0.0",
    date: "Sep 21, 2026",
    type: "Major",
    changes: {
      added: [
        "You can now add up to 50 custom models from the OpenRouter catalog when using your own OpenRouter key in AI Settings. The catalog shows only chat-capable models, and you can search and sort by intelligence, latency, throughput, context length, and name.",
        "You can now rename script tabs with the pencil button on each tab in World Tools. Thanks to @Figure 8 for the suggestion.",
        "Chat history entries in World Tools now save your script tabs and code. Switching history restores the code you had open, and the history list shows how many tabs each entry holds. Thanks to @Figure 8 for the suggestion."
      ],
      improved: [
        "Large now uses Nex-N2.5-Pro with vision support. Base now uses Qwen3.8 27B with vision support. Small now uses Nex-N2.5-Mini with vision support.",
        "The AI Assistant and API Docs now use the official Bloxd docs at bloxd.io/docs. Thanks to @Figure 8 for the suggestion.",
        "The AI Assistant now validates code for balanced braces and syntax errors before applying it, repairs malformed tool arguments instead of dropping them, and matches small edits even when whitespace differs."
      ],
      renderingEngine: [
        "ForgeRender now loads schematics faster with capped pixel ratio and frozen static model instances, renders previously missing blocks like pods, paintings, and explosives, and fills unrecognized blocks with inferred neighbor textures instead of leaving invisible holes."
      ],
      fixed: [
        "Fixed an issue where the first two landing page sections showed their content on the same side instead of alternating.",
        "Fixed an issue where the AI Assistant could apply code with missing braces when a tool call arrived malformed. Thanks to @Figure 8 for reporting."
      ],
      changed: [
        "The Privacy Policy and Terms now describe the current AI models, including log retention for the Small model provider.",
        "Updated to Next.js 15.5.25, which includes security fixes"
      ]
    }
  },
  {
    version: "v1.19.1",
    date: "Aug 19, 2026",
    type: "Patch",
    changes: {
      improved: [
        "Large now uses dots3-note Preview with 512K context and vision support. It replaces GLM 5.2 and handles image attachments, so the separate Vision model has been removed.",
        "Improved the system prompt and renamed AI tools for clarity.",
        "In World Tools chat, image attachments and Try Again now require a vision-capable model. You can now paste with Ctrl+V or drag and drop files anywhere in chat, and creating multiple script tabs is more reliable.",
        "The AI route now sends ephemeral cache control and session IDs to improve prompt caching."
      ],
      fixed: [
        "Fixed an issue where retry controls appeared during generation or after a tool call."
      ]
    }
  },
  {
    version: "v1.19.0",
    date: "Aug 19, 2026",
    type: "Minor",
    changes: {
      added: [
        "You can now use the Vision AI model in the AI Assistant. You can attach up to 4 images per message, view them as thumbnails in the composer and chat history, and select a thumbnail to preview it full screen.",
        "You can now draw triangles in Texture Studio with the new Triangle tool.",
        "You can now save up to 500 colors to a persistent palette in Texture Studio. Saved colors remain available across sessions, and BloxdForge restores them from an automatic backup if a save fails."
      ],
      improved: [
        "World Tools chat now supports multiple script tabs. You can create, rename by double-clicking, and close tabs, and the AI can list, read, and edit code in any open tab.",
        "Large now uses GLM 5.2. Small now uses Laguna XS 2.1 for improved responses.",
        "You can now enter an exact brush size from 1 to 256 in Texture Studio instead of using only the slider.",
        "The Remix Studio AdBlock module now hides ads more reliably with expanded selectors and stronger hiding rules.",
        "The Remix Studio Button Theme now also styles inner borders and body elements for complete coverage.",
        "You can now set AI runtime limits for maximum recursion depth and repeated tool calls to 0 for no limit."
      ],
      fixed: [
        "Fixed an issue where your message was lost when re-verifying a CAPTCHA in the AI Assistant.",
        "Updated to Next.js 15.5.21 with security updates for postcss and sharp."
      ],
      changed: [
        "Fonts are now self-hosted instead of loaded from Google Fonts for faster loading and improved privacy.",
        "Updated the sitemap to include additional routes with adjusted priorities.",
        "Updated the Privacy Policy."
      ],
      removed: [
        "Removed Nemotron 3 Ultra as a Large AI model option."
      ]
    }
  },
  {
    version: "v1.18.16",
    date: "Jun 09, 2026",
    type: "Patch",
    changes: {
      added: [
        "Workshop texture pack previews now include a 3D skybox background. BloxdForge uses the pack skybox faces (px, nx, py, ny, pz, nz) when available and shows a default skybox otherwise.",
        "Workshop texture pack previews now show coal, iron, gold, diamond, emerald, lapis, and moonstone ores in the island stone layer so you can review ore textures directly."
      ]
    }
  },
  {
    version: "v1.18.15",
    date: "Jun 09, 2026",
    type: "Patch",
    changes: {
      added: [
        "You can now save manually with the Save Pack button in Texture Studio. A confirmation appears after each save.",
        "You can now turn on Beginner Mode in Voxel Builder Preferences to hide advanced panels for a simpler workspace.",
        "Voxel Builder toolbar buttons, screen controls, and mode tabs now show tooltips for easier discovery."
      ],
      improved: [
        "Voxel Builder now supports DRACO-compressed GLB files for faster loading.",
        "Voxelizer now preserves texture colors from textured GLB models during voxelization.",
        "On touch devices, Texture Studio file tree action buttons now remain visible at 50% opacity instead of being hidden."
      ],
      changed: [
        "The Save Texture button in Texture Studio is now named Export Texture with an updated icon.",
        "The maximum brush size in Texture Studio increased from 10 to 64.",
        "The Model Info link in the Chat tab now opens in a new tab."
      ]
    }
  },
  {
    version: "v1.18.14",
    date: "May 21, 2026",
    type: "Patch",
    changes: {
      improved: [
        "The Workshop and Studio home pages now load faster. BloxdForge loads only script metadata first and loads full script details when you open a script.",
        "Download links now resolve faster using edge infrastructure closer to your location.",
        "Workshop data is now cached for 7 days instead of 1 hour for faster repeat visits and reduced server load.",
        "You can now use pinch-to-zoom on mobile devices.",
        "All icon-only buttons in modals, toolbars, and navigation now include screen reader labels."
      ],
      fixed: [
        "Fixed an issue where importing a texture pack from Remix Studio could lose files under certain timing conditions.",
        "Fixed an issue where importing very large ZIP files could crash the browser tab on low-memory devices.",
        "Fixed an issue where chat history stopped saving when browser storage was full. BloxdForge now automatically removes older sessions to free space.",
        "Fixed an issue where the Download ZIP button could leave extra elements on the page if generation failed.",
        "Fixed an issue where IndexedDB calls during server-side rendering could cause the page to hang."
      ],
      changed: [
        "Strengthened security for authentication, request validation, and content sanitization.",
        "Content Security Policy is now set per page. Editor pages include the permissions they require, and other pages use a stricter policy.",
        "Replaced deprecated security headers with current standards, including HSTS and Cross-Origin protections.",
        "Workshop browsing history is now capped in size to prevent slowdowns during long-term use."
      ]
    }
  },
  {
    version: "v1.18.13",
    date: "May 20, 2026",
    type: "Patch",
    changes: {
      improved: [
        "Improved the API Docs interface with minor visual updates."
      ],
      changed: [
        "Separated the three Wiki and Docs pages into individual pages for clearer navigation."
      ]
    }
  },
  {
    version: "v1.18.12",
    date: "May 13, 2026",
    type: "Patch",
    changes: {
      added: [
        "You can now use the built-in voxel editor in Texture Studio. Model loading is supported. Importing baked colors is not yet supported. Thanks to @Heavenly for the suggestion and @nimadez for the open-source software.",
        "You can now select, copy, and paste exact pixel regions with the marquee selection tool. Thanks to @Ian for the suggestion.",
        "You can now open the Recorder in a standalone popup window from the Studio launcher. Thanks to @Forgotten999 for the suggestion."
      ],
      improved: [
        "You can now adjust intensity for the Darken and Lighten tools with a slider. Thanks to @Ian for the suggestion.",
        "You can now delete folders in the file tree. Thanks to @Ian for the suggestion.",
        "Texture downloads are now more reliable with binary blob downloads. Thanks to @Ian for the suggestion.",
        "Saved colors in Texture Studio are now persistent across sessions with no 16-color limit. If a save fails, BloxdForge restores from a backup instead of clearing the palette. Thanks to @Ian for the suggestion.",
        "On Firefox, the color picker eyedropper now activates the canvas picker tool instead of showing a hex code prompt."
      ],
      removed: [
        "Removed the Blockbench iframe from Texture Studio."
      ]
    }
  },
  {
    version: "v1.18.11",
    date: "Apr 27, 2026",
    type: "Patch",
    changes: {
      added: [
        "You can now adjust brush size with a slider for the Pencil, Eraser, Lighten, and Darken tools. Thanks to @Ian Okorie for the suggestion.",
        "You can now use Unfill mode with the Fill tool to erase areas instead of filling them. Thanks to @Ian Okorie and @ENtheDude for the suggestion.",
        "You can now select multiple files in the file tree to move them in bulk.",
        "You can now create folders with the New Folder button in the file tree."
      ],
      improved: [
        "Improved file tree scrolling and animation performance."
      ],
      fixed: [
        "Fixed an issue where auto-save caused the canvas to freeze briefly."
      ]
    }
  },
  {
    version: "v1.18.10",
    date: "Apr 22, 2026",
    type: "Patch",
    changes: {
      added: [
        "You can now rename folders in Texture Studio. Thanks to @ENtheDude for the suggestion.",
        "Feedback collection now uses Canny instead of Tally so users can reply to feedback."
      ],
      improved: [
        "Updated the linter and autocomplete to match the latest Bloxd API documentation."
      ]
    }
  },
  {
    version: "v1.18.9",
    date: "Apr 19, 2026",
    type: "Patch",
    changes: {
      improved: [
        "Improved the Workshop design with faster tab switching, an updated search bar, and uniform card sizes.",
        "Improved Workshop pagination with clearer page numbers and pagination dots on mobile.",
        "Improved the loading reliability of texture previews."
      ],
      removed: [
        "Removed the ForgeRender section from the landing page."
      ],
      changed: [
        "Updated the Workshop page title.",
        "The Wiki page now uses infinite scroll with an updated layout for easier browsing.",
        "The AI Assistant can now search multiple topics and read multiple files at once for faster responses."
      ]
    }
  },
  {
    version: "v1.18.8",
    date: "Mar 31, 2026",
    type: "Patch",
    changes: {
      added: [
        "You can now open the changelog from the footer. Thanks to @c_cll for the suggestion.",
        "You can now open the script editor in a floating window from the Play menu. Thanks to @c_cll for the suggestion."
      ],
      fixed: [
        "Fixed an issue where searching in the Workshop did not reset the page number. Thanks to @ENtheDude for reporting."
      ]
    }
  },
  {
    version: "v1.18.7",
    date: "Mar 27, 2026",
    type: "Patch",
    changes: {
      added: [
        "You can now fill areas with the new Fill tool in Texture Studio. Thanks to @ENtheDude for the suggestion."
      ],
      improved: [
        "Updated the linter and autocomplete to match the latest Bloxd API documentation. Thanks to @c_cll for the suggestion."
      ],
      fixed: [
        "Updated the resource gathering guide for improved accuracy. Thanks to @ENtheDude for reporting.",
        "Added missing API documentation."
      ]
    }
  },
  {
    version: "v1.18.6",
    date: "Mar 24, 2026",
    type: "Patch",
    changes: {
      added: [
        "You can now draw rectangles and circles in Texture Studio with the new Rectangle and Circle tools. Thanks to @ENtheDude for the suggestion.",
        "You can now duplicate files and move them to different folders. Thanks to @ENtheDude for the suggestion."
      ],
      improved: [
        "Improved color picker accuracy in Texture Studio. You can now zoom out further.",
        "The built-in texture pack can only be updated after Bloxd updates its public texture pack repository, because BloxdForge uses the same community-available resources."
      ],
      fixed: [
        "Fixed lag and improved performance in Texture Studio. Thanks to @ENtheDude for reporting."
      ]
    }
  },
  {
    version: "v1.18.5",
    date: "Mar 18, 2026",
    type: "Patch",
    changes: {
      added: [
        "Remix Studio now includes additional styling modules. Thanks to @hardcoreapplecore for the suggestion."
      ],
      improved: [
        "Remix Studio now shows Asset Management and Style Selection in separate views for a clearer workflow."
      ]
    }
  },
  {
    version: "v1.18.4",
    date: "Mar 15, 2026",
    type: "Patch",
    changes: {
      added: [
        "You can now change the font family in the Script Editor. Thanks to @Forgotten9 for the suggestion."
      ]
    }
  },
  {
    version: "v1.18.3",
    date: "Mar 13, 2026",
    type: "Patch",
    changes: {
      improved: [
        "Improved Markdown rendering and updated the AI Assistant interface."
      ],
      fixed: [
        "Fixed issues with retrying, retrying with a different model, and editing messages in the AI Assistant."
      ],
    }
  },
  {
    version: "v1.18.2",
    date: "Mar 06, 2026",
    type: "Patch",
    changes: {
      renderingEngine: [
        "Schematics now load faster in ForgeRender.",
        "ForgeRender now supports potion table and enchanting table models.",
        "Fixed tall grass rendering and updated cross-mapping in ForgeRender."
      ]
    }
  },
  {
    version: "v1.18.1",
    date: "Mar 06, 2026",
    type: "Patch",
    changes: {
      improved: [
        "Schematic preview metadata and settings now use a shared ForgeRender information source."
      ],
      fixed: [
        "Fixed an issue where Workshop schematic pages could change order after refreshing on later pages. Thanks to @hardcoreapplecore for reporting."
      ],
      renderingEngine: [
        "In schematic preview, Space and Arrow keys no longer scroll background content while the modal is open.",
        "ForgeRender now supports trapdoor, ladder, and board models."
      ]
    }
  },
  {
    version: "v1.18.0",
    date: "Mar 05, 2026",
    type: "Minor",
    changes: {
      improved: [
        "Updated the AI Assistant chat with a redesigned interface, updated models, and improved reliability.",
        "Updated the Bloxd linter for improved script validation to match the latest Bloxd API changes."
      ],
      renderingEngine: [
        "ForgeRender now supports bed and door models."
      ]
    }
  },
  {
    version: "v1.17.6",
    date: "Mar 04, 2026",
    type: "Patch",
    changes: {
      renderingEngine: [
        "Now supports rendering much larger schematics at better frames. I also decided to dub it \"ForgeRender\"."
      ]
    }
  },
  {
    version: "v1.17.5",
    date: "Mar 03, 2026",
    type: "Patch",
    changes: {
      added: [
        "Added a new Careers page."
      ],
      improved: [
        "Refined wording of the Privacy Policy and Terms of Service pages."
      ]
    }
  },
  {
    version: "v1.17.4",
    date: "Mar 02, 2026",
    type: "Patch",
    changes: {
      added: [
        "Added account saving notice in Play menu. Thank you for providing feedback.",
        "Shun creations that use AI to misrepresent work."
      ],
      improved: [
        "New oldest-to-newest sort option in the Workshop. Thank you @hardcoreapplecore for providing feedback.",
        "Added model uploading notice in the Texture Studio. Thank you for providing feedback."
      ]
    }
  },
  {
    version: "v1.17.3",
    date: "Feb 22, 2026",
    type: "Patch",
    changes: {
      improved: [
        "Minor Workshop UI updates.",
        "Better mobile landing page UI."
      ]
    }
  },
  {
    version: "v1.17.2",
    date: "Feb 21, 2026",
    type: "Patch",
    changes: {
      added: [
        "New file comparison UI in Remix Studio."
      ],
      improved: [
        "Minor Workshop UI updates."
      ]
    }
  },
  {
    version: "v1.17.1",
    date: "Feb 13, 2026",
    type: "Patch",
    changes: {
      improved: [
        "Refined the CSP policies. Please tell us if anything doesn't load or doesn't look right!"
      ]
    }
  },
  {
    version: "v1.17.0",
    date: "Feb 12, 2026",
    type: "Major",
    changes: {
      added: [
        "Two new blog posts about BloxdForge.",
        "Enhanced secure download mechanism with improved token validation and encryption."
      ],
      improved: [
        "Completely revamped guide UI with a modern, interactive design for better readability and navigation.",
        "Guide pages now load faster with optimized resource bundling and lazy loading.",
        "Improved visual hierarchy and typography throughout the guides section."
      ]
    }
  },
  {
    version: "v1.16.7",
    date: "Feb 11, 2026",
    type: "Patch",
    changes: {
      added: [
        "New rate limit screen in the schematic preview with a countdown timer, so you know exactly when you can try again."
      ],
      improved: [
        "Better abuse prevention to keep the service running smoothly for everyone."
      ]
    }
  },
  {
    version: "v1.16.6",
    date: "Feb 09, 2026",
    type: "Patch",
    changes: {
      renderingEngine: [
        "Schematic rendering engine now correctly renders block faces behind glass.",
        "Use cross-mapping for flowers and other floral items in schematic rendering to ensure correct orientation and visuals."
      ]
    }
  },
  {
    version: "v1.16.5",
    date: "Feb 09, 2026",
    type: "Patch",
    changes: {
      added: [
        "New changelog modal on the landing page",
        "Skeleton loaders in the workshop for a smoother loading experience.",
        "Custom color picker in the texture studio for precise color selection.",
        "Keyboard shortcut hints in the preview modal.",
        "Personalized recommendation algorithm in the workshop that learns from your viewing habits, searches, and downloads."
      ],
      improved: [
        "Mobile navigation now uses 'Assets' label with a new icon, safe area support, and proper 44x44px touch targets.",
        "External links in the collapsed sidebar are now neatly tucked into a popover to save space.",
        "Script modal is now fullscreen on mobile for better editing.",
        "Workshop images now load faster with improved caching and priority loading.",
        "Accessibility improvements with ARIA labels and keyboard navigation (Esc to close dropdowns)."
      ],
      removed: [
        "Removed the /studio/toolbox page. If you missed it then too bad."
      ]
    }
  },
  {
    version: "v1.16.4",
    date: "Feb 08, 2026",
    type: "Patch",
    changes: {
      improved: [
        "Improved LCP across the website."
      ]
    }
  },
  {
    version: "v1.16.3",
    date: "Feb 01, 2026",
    type: "Patch",
    changes: {
      fixed: [
        "Resolved an issue where enabling \"Eco Mode\" in settings would break UI components that rely on animations for visibility, such as the Game Tools sidebar.",
        "Ensured that loading spinners and feedback animations remain active even when Eco mode is on."
      ]
    }
  },
  {
    version: "v1.16.2",
    date: "Jan 28, 2026",
    type: "Patch",
    changes: {
      added: [
        "The workshop marquee on the landing page is now fully interactive. You can hover to pause scrolling, click cards to view details, or use the new direct download button."
      ],
      improved: [
        "Share buttons in the Preview, Schematic, and Script modals now provide immediate visual feedback on the button itself instead of using popup notifications.",
      ]
    }
  },
  {
    version: "v1.16.1",
    date: "Jan 26, 2026",
    type: "Patch",
    changes: {
      added: [
        "Added quick access links for Discord, Feedback, and GitHub to the studio sidebar.",
      ],
      improved: [
        "Font consistency has been improved across the entire site.",
        "The version badge on the homepage now links directly to the changelog.",
      ]
    }
  },
  {
    version: "v1.16.0",
    date: "Jan 20, 2026",
    type: "Major",
    changes: {
      added: [
        "Shareable links for Workshop assets (Schematics, Textures, Scripts).",
      ]
    }
  },
  {
    version: "v1.15.2",
    date: "Jan 19, 2026",
    type: "Minor",
    changes: {
      improved: [
        "Completely redesigned the landing page.",
      ],
      removed: [
        "Removed the standalone /contact page in favour of a direct 'Feedback & Support' link in the footer."
      ]
    }
  },
  {
    version: "v1.15.1",
    date: "Jan 17, 2026",
    type: "Patch",
    changes: {
      added: [
        "A new \"Render Scale\" slider in Settings > Performance allows for granular control over game resolution (25%, 50%, 75%, 100%) for FPS boosts.",
        "A \"Back to Studio\" button has been added to the game client page for easier navigation.",
      ],
      fixed: [
        "Resolved a critical bug causing the mouse cursor to spin uncontrollably or jerk around when the game resolution was scaled down. Thank you @agesofanger on Discord for catching it!",
      ]
    }
  },
  {
    version: "v1.15.0",
    date: "Jan 15, 2026",
    type: "Major",
    changes: {
      added: [
        "Remix Studio: A new tool for combining community assets and applying custom styles to create unique texture packs.",
      ],
      improved: [
        "Texture Studio Overhaul: Replaced the single-pack editor with a multi-pack management system, allowing users to create, load, and switch between multiple projects.",
        "CSS Editing: The Texture Studio now supports creating and editing `.css` files for advanced in-game interface customisation.",
        "Workshop UI: Minor user interface adjustments for a cleaner browsing experience.",
      ],
      fixed: [
        "Various miscellaneous bug fixes and performance enhancements across the platform."
      ]
    }
  },
  {
    version: "v1.14.2",
    date: "Jan 07, 2026",
    type: "Patch",
    changes: {
      improved: [
        "The AI Assistant chat now only auto-scrolls if you're already at the bottom, making it easier to review previous messages.",
        "The AI Assistant is now powered by the newer `deepseek-v3.1-terminus` model for better responses.",
      ],
      fixed: [
        "Resolved a critical bug where the AI Assistant would fail with a `CAPTCHA verification failed` error after using a tool.",
        "Fixed an issue where deleting the last chat session would result in a blank state instead of creating a new chat.",
      ]
    }
  },
  {
    version: "v1.14.1",
    date: "Jan 07, 2026",
    type: "Patch",
    changes: {
      added: [
        "Integrated Cloudflare Turnstile for enhanced AI Assistant security.",
        "Added a button to the Schematic Preview to re-display the beta feature information.",
      ],
      improved: [
        "Refactored the Settings page into modular components for better maintainability.",
        "The AI Assistant's security check now appears as a modal overlay, improving user experience.",
      ],
      changed: [
        "Replaced Vercel Speed Insights with Cloudflare Web Analytics for privacy-focused metrics."
      ],
      fixed: [
        "Fixed a layout bug where action buttons in the Script Modal could be pushed off-screen by long lines of code.",
        "Adjusted the position of the 'Show Feature Tour' button in the Texture Studio."
      ]
    }
  },
  {
    version: "v1.14.0",
    date: "Jan 06, 2026",
    type: "Minor",
    changes: {
      improved: [
        "Redesigned Studio UI: The Texture Creator, World Tools, and Settings pages now use a modern, edge-to-edge layout for better immersion and space utilisation.",
        "Settings Organisation: Schematic preview settings have been moved to the General tab under a new section."
      ],
      fixed: [
        "AI Assistant: Fixed a bug where the AI Assistant panel would fail to open or animate incorrectly."
      ]
    }
  },
  {
    version: "v1.13.2",
    date: "Dec 30, 2025",
    type: "Patch",
    changes: {
      added: [
        "Added three new sources of data aggregation for the Workshop, expanding the asset library significantly."
      ]
    }
  },
  {
    version: "v1.13.1",
    date: "Dec 30, 2025",
    type: "Patch",
    changes: {
      fixed: [
        "Fixed a visual glitch in the Workshop's 3D schematic preview that caused visible seams or gaps between blocks."
      ]
    }
  },
  {
    version: "v1.13.0",
    date: "Dec 30, 2025",
    type: "Minor",
    changes: {
      improved: [
        "Schematic Previews: The 3D schematic previewer has been significantly upgraded with a massively expanded block texture library for better accuracy."
      ],
      fixed: [
        "Schematic Rendering: Fixed a major bug that caused imported schematics to appear mirrored or inverted along the X-axis."
      ]
    }
  },
  {
    version: "v1.12.0",
    date: "Dec 29, 2025",
    type: "Minor",
    changes: {
      added: [
        "Installable App (PWA): You can now install BloxdForge as a desktop app via your browser."
      ],
      improved: [
        "Play Mode Persistence: Your Game Launcher workspace (Coordinates, Clipboard) is now saved between visits.",
        "Gameplay Guides Overhaul: Updated all guides with the latest 2025 meta strategies.",
        "Workshop Discovery: Added a banner linking to guides in the Workshop."
      ]
    }
  },
  {
    version: "v1.11.0",
    date: "Dec 29, 2025",
    type: "Minor",
    changes: {
      added: [
        "Performance Settings: New 'Eco Mode' kill-switch for low-end devices.",
        "Low Resolution Mode: Render the game at 50% scale.",
        "Simple UI: Option to disable gradients/shadows.",
        "Disable Animations: Global toggle to remove all UI transitions."
      ],
      improved: [
        "Window Dragging: Fixed input lag when moving floating windows.",
        "Settings Page: Reorganised layout and added descriptions."
      ],
      removed: [
        "Dark Mode Toggle: Removed non-functional switch."
      ]
    }
  }
];
