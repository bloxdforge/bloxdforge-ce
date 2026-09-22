import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
export const dynamic = 'force-static';
export const revalidate = false;
interface ScriptItem {
  hash: string;
  title: string;
  type: string;
  code: string;
  img?: string;
  description?: string;
  author: string;
  tags: string[];
}
let cachedScripts: ScriptItem[] | null = null;
async function getScripts(): Promise<ScriptItem[]> {
  if (!cachedScripts) {
    const scriptsPath = path.join(process.cwd(), 'data/scripts.json');
    const scriptsFile = await fs.readFile(scriptsPath, 'utf-8');
    cachedScripts = JSON.parse(scriptsFile);
  }
  return cachedScripts!;
}
export async function generateStaticParams() {
  try {
    const scripts = await getScripts();
    return scripts.map(s => ({ hash: s.hash }));
  } catch {
    return [];
  }
}
export async function GET(
  request: Request,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params;
  try {
    const scripts = await getScripts();
    const script = scripts.find(s => s.hash === hash);
    if (script) {
      return NextResponse.json(script, {
        headers: {
          'Cache-Control': 'public, max-age=604800, stale-while-revalidate=2592000',
          'CDN-Cache-Control': 'public, max-age=604800, stale-while-revalidate=2592000'
        }
      });
    } else {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('API Error in /api/scripts/[hash]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}