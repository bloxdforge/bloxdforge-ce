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
  title: 'Careers | BloxdForge',
  description: 'Join the BloxdForge community project. Open volunteer (unpaid) roles for Software Engineering and Community Management.',
  alternates: {
    canonical: 'https://www.bloxdforge.com/careers',
  },
  openGraph: {
    title: 'Careers at BloxdForge',
    description: 'Help build BloxdForge as a community-led hobby project. Current roles are volunteer and unpaid.',
    url: 'https://www.bloxdforge.com/careers',
    type: 'website',
  },
};
export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}