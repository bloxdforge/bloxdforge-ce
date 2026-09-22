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
import { DOC_FILES, DOCS_VERSION } from '@/lib/docs';
export const revalidate = 86400;
const ALLOWED = new Set(DOC_FILES.map(d => d.name));
export function generateStaticParams() {
  return DOC_FILES.map(d => ({ file: d.name }));
}
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const safe = file.replace(/[^a-zA-Z0-9._-]/g, '');
  if (!ALLOWED.has(safe)) {
    return new NextResponse('Not found', { status: 404 });
  }
  try {
    const vendored = path.join(process.cwd(), 'data', 'bloxd-docs', safe);
    const buf = await fs.readFile(vendored, 'utf-8');
    return new NextResponse(buf, {
      headers: {
        'Content-Type': safe.endsWith('.txt') ? 'text/plain; charset=utf-8' : 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'X-Docs-Version': DOCS_VERSION,
        'X-Docs-Source': 'bloxd.io/docs',
      },
    });
  } catch {
    return new NextResponse('Documentation unavailable. Run node scripts/sync-bloxd-docs.cjs then rebuild. See https://bloxd.io/docs', { status: 502 });
  }
}
