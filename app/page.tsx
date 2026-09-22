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

import fs from "fs/promises";
import path from "path";
import LandingPageClient from "./LandingPageClient";
import { WorkshopItem } from "@/components/landing/WorkshopMarquee";
export const dynamic = 'force-static';
async function getLandingPageData() {
  const defaults = {
    schematics: 1500,
    textures: 400,
    scripts: 1500,
    workshopRows: [[], [], []] as WorkshopItem[][]
  };
  try {
    const buildsPath = path.join(process.cwd(), "data/builds.json");
    const texturesPath = path.join(process.cwd(), "data/textures.json");
    const scriptsPath = path.join(process.cwd(), "data/scripts.json");
    const [buildsFile, texturesFile, scriptsFile] = await Promise.all([
      fs.readFile(buildsPath, "utf-8").catch(() => "[]"),
      fs.readFile(texturesPath, "utf-8").catch(() => "[]"),
      fs.readFile(scriptsPath, "utf-8").catch(() => "[]"),
    ]);
    const buildsData = JSON.parse(buildsFile);
    const texturesData = JSON.parse(texturesFile);
    const scriptsData = JSON.parse(scriptsFile);
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500", "bg-orange-500"];
    const sampleBuilds = buildsData.slice(0, 15);
    const sampleTextures = texturesData.slice(0, 15);
    const sampleScripts = scriptsData.slice(0, 15);
    const mappedBuilds = sampleBuilds.map((b: { name: string; author: string; url: string }) => ({
      title: b.name,
      author: b.author,
      tag: 'Schematic',
      linkUrl: `/studio/workshop?schematic=${encodeURIComponent(b.url)}`,
      downloadUrl: b.url
    }));
    const mappedTextures = sampleTextures.map((t: { name: string; author?: string; file: string }) => ({
      title: t.name,
      author: t.author || 'Unknown',
      tag: 'Texture',
      linkUrl: `/studio/workshop?texture=${encodeURIComponent(t.file)}`,
      downloadUrl: t.file
    }));
    const mappedScripts = sampleScripts.map((s: { title: string; author: string; hash?: string; code?: string }) => ({
      title: s.title,
      author: s.author,
      tag: 'Script',
      linkUrl: s.hash ? `/studio/workshop?script=${s.hash}` : '/studio/workshop',
      scriptCode: s.code
    }));
    const allItems: WorkshopItem[] = [...mappedBuilds, ...mappedTextures, ...mappedScripts]
      .map((item, i) => ({
        id: `item-${i}`,
        ...item,
        color: colors[i % colors.length]
      }));
    const chunkSize = Math.ceil(allItems.length / 3);
    const r1 = allItems.slice(0, chunkSize);
    const r2 = allItems.slice(chunkSize, chunkSize * 2);
    const r3 = allItems.slice(chunkSize * 2);
    return {
      schematics: buildsData.length > 0 ? buildsData.length : defaults.schematics,
      textures: texturesData.length > 0 ? texturesData.length : defaults.textures,
      scripts: scriptsData.length > 0 ? scriptsData.length : defaults.scripts,
      workshopRows: [r1, r2, r3]
    };
  } catch (error) {
    console.error("Failed to read workshop stats on server:", error);
    return defaults;
  }
}
export default async function LandingPage() {
  const data = await getLandingPageData();
  return (
    <LandingPageClient
      schematicsCount={data.schematics}
      texturesCount={data.textures}
      scriptsCount={data.scripts}
      initialWorkshopRows={data.workshopRows}
    />
  );
}