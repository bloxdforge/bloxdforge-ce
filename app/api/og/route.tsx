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

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
export const runtime = 'edge';
let cachedFont: ArrayBuffer | null = null;
async function getFontData(): Promise<ArrayBuffer> {
  if (cachedFont) return cachedFont;
  const res = await fetch(
    new URL('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff')
  );
  cachedFont = await res.arrayBuffer();
  return cachedFont!;
}
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'BloxdForge Workshop';
  const author = searchParams.get('author') || 'Community';
  const type = searchParams.get('type') || 'Asset';
  const description = searchParams.get('desc') || 'Download this custom asset for Bloxd.io';
  const fontData = await getFontData();
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#0a0a0a',
          padding: '60px',
          fontFamily: 'Inter',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            background: '#ff6b39',
            opacity: '0.15',
            filter: 'blur(100px)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: '500px',
            height: '500px',
            background: '#1d4ed8',
            opacity: '0.1',
            filter: 'blur(120px)',
            borderRadius: '50%',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              background: '#ff6b39',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>BloxdForge</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255,255,255,0.1)',
              padding: '8px 16px',
              borderRadius: '50px',
              width: 'fit-content',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <span style={{ color: '#ff6b39', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{type}</span>
          </div>
          <h1
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: '-0.03em',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              maxWidth: '900px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: 28, color: '#a3a3a3', margin: 0, maxWidth: '800px', lineHeight: 1.4 }}>
            {description}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '30px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 16, color: '#525252', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Created By</span>
            <span style={{ fontSize: 24, color: '#fff', fontWeight: 600 }}>{author}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: 20, color: '#737373' }}>Available on bloxdforge.com</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'CDN-Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    },
  );
}
