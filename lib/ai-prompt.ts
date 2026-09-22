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

/*! SIMPLIFIED START */
export const AI_SYSTEM_PROMPT = `You are a coding assistant for Bloxd.io JavaScript scripting.
Help the user write scripts that run inside Bloxd.io Code Blocks.
Verify API names with search_docs or read_docs before writing code instead of guessing.
Refuse harmful, illegal, or cheating content briefly and without workarounds.
Use read_code, list_tabs, or lint_code for context; create_tab for a new tab, write_code for a full rewrite, patch_code only for a tiny change.
Keep responses short and code modern.
`;
/*! SIMPLIFIED END */
export const TOOLS = [
  {
    type: "function",
    function: {
      name: "read_code",
      description: "Reads the current script code for analysis. Optionally pass a tab name, id, or 1-based index.",
      parameters: {
        type: "object",
        properties: {
          tab: {
            type: "string",
            description: "Optional tab name, id, or 1-based index to read code from. Omit to use the active tab.",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_tabs",
      description: "Lists all open script tabs with their active/modified status. Use this when the user references multiple scripts or tabs.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_tab",
      description: "Creates a new script tab. Name and content are optional; defaults are used when omitted.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Optional custom tab name.",
          },
          content: {
            type: "string",
            description: "Optional initial JavaScript content.",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "lint_code",
      description: "Checks the current code for syntax or API usage errors using the built-in linter.",
      parameters: {
        type: "object",
        properties: {
          tab: {
            type: "string",
            description: "Optional tab name, id, or 1-based index to lint.",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_docs",
      description: "Performs keyword searches across API documentation for a quick lookup of functions or events.",
      parameters: {
        type: "object",
        properties: {
          queries: {
            type: "array",
            items: { type: "string" },
            description: "The search terms (e.g. ['diamond sword', 'mob health', 'api.setBlock'])",
          },
          limit: {
            type: "number",
            description: "The maximum number of matches to return per query per document. Default is 3.",
          },
        },
        required: ["queries"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "read_docs",
      description: "Reads selected documentation files, including item, block, sound, and particle lists.",
      parameters: {
        type: "object",
        properties: {
          filenames: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "API_REFERENCE.md",
                "README.md",
                "CALLBACKS.md",
                "CLIENT_OPTIONS.md",
                "ENTITY_SETTINGS.md",
                "MOB_SETTINGS.md",
                "VEHICLE_SETTINGS.md",
                "MESH_ENTITY_DOCS.md",
                "PARTICLES.md",
                "SOUNDS_AND_MUSIC.md",
                "ICONS.md",
                "QTE_DOCS.md",
                "SKINS_AND_POSES.md",
                "BLOCK_NAMES.txt",
                "ITEM_NAMES.txt",
                "CHANGELOG.md",
                "HOW_TOS.md"
              ]
            },
            description: "The filenames to read.",
          },
        },
        required: ["filenames"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_wiki",
      description: "Searches the game wiki for information about items, blocks, mobs, and game mechanics. Do NOT use this for API code questions.",
      parameters: {
        type: "object",
        properties: {
          queries: {
            type: "array",
            items: { type: "string" },
            description: "The search terms.",
          },
        },
        required: ["queries"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "patch_code",
      description: "Applies a minor change to the code by searching for an exact block of text and replacing it. Be careful with whitespace. Optionally pass a tab to edit a specific script tab.",
      parameters: {
        type: "object",
        properties: {
          search: {
            type: "string",
            description: "The EXACT code block to find. Must match whitespace exactly.",
          },
          replace: {
            type: "string",
            description: "The new code to replace the found block with.",
          },
          tab: {
            type: "string",
            description: "Optional tab name, id, or 1-based index to edit. Omit to edit the active tab.",
          },
        },
        required: ["search", "replace"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "write_code",
      description: "Replaces the entire content of a script tab. Use for new scripts or comprehensive updates; pass tab to target a specific tab.",
      parameters: {
        type: "object",
        properties: {
          code: {
            type: "string",
            description: "The complete, updated JavaScript code.",
          },
          tab: {
            type: "string",
            description: "Optional tab name, id, or 1-based index to replace. Omit to replace the active tab.",
          },
        },
        required: ["code"],
      },
    },
  },
];
