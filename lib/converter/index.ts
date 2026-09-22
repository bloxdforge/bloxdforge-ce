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
import type { Buffer as BufferType } from "buffer";
/*! SIMPLIFIED START */
export interface ParsedBloxdSchematic {
  name: string;
  pos: [number, number, number];
  size: [number, number, number];
  chunks: Array<{
    pos: [number, number, number];
    blocks: number[];
  }>;
  blockdatas?: Array<{
    blockX: number;
    blockY: number;
    blockZ: number;
    blockdataStr: string;
  }>;
}
export async function parseBloxdSchematic(
  bloxdschemBuffer: BufferType | ArrayBuffer | Uint8Array
): Promise<ParsedBloxdSchematic> {
  void bloxdschemBuffer;
  throw new Error("Schematic parsing is not available in the Community Edition.");
}
/*! SIMPLIFIED END */
