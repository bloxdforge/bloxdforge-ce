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

import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Blogs & Guides',
  description: 'Bloxd.io guides, strategies, game wiki, and API documentation. Learn game mechanics, building techniques, combat strategies, and scripting.',
};
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Studio",
    "item": "https://www.bloxdforge.com/studio"
  },{
    "@type": "ListItem",
    "position": 2,
    "name": "Resources",
    "item": "https://www.bloxdforge.com/studio/wiki"
  }]
};
export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}