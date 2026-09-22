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

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
export const revalidate = false;
export function generateStaticParams() {
  return [
    { resource: 'builds' },
    { resource: 'textures' },
    { resource: 'textures.txt' },
    { resource: 'scripts-list' },
    { resource: 'wiki' }
  ];
}
/*! SIMPLIFIED START */
export async function GET(req: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const safeResource = resource.replace(/[^a-zA-Z0-9._-]/g, '');
  try {
    const extensions = ['.json', '.txt', ''];
    let fileBytes: Uint8Array<ArrayBuffer> | null = null;
    let contentType = 'application/octet-stream';
    for (const ext of extensions) {
      const testPath = path.join(process.cwd(), 'data', `${safeResource}${ext}`);
      try {
        const raw = await fs.readFile(testPath);
        const ab = new ArrayBuffer(raw.byteLength);
        new Uint8Array(ab).set(raw);
        fileBytes = new Uint8Array(ab);
        contentType = ext === '.json' ? 'application/json; charset=utf-8' : ext === '.txt' ? 'text/plain; charset=utf-8' : 'application/octet-stream';
        break;
      } catch {
        continue;
      }
    }
    if (!fileBytes) {
      return new NextResponse('Not found', { status: 404 });
    }
    return new NextResponse(fileBytes, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=2592000',
        'CDN-Cache-Control': 'public, max-age=604800, stale-while-revalidate=2592000'
      }
    });
  } catch {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
/*! SIMPLIFIED END */
