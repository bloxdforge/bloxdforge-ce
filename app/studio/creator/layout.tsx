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
  title: 'Design & Share Bloxd.io Assets - Free Creator Tool',
  description: 'Use the BloxdForge Asset Creator to design and share your custom creations for Bloxd.io. The best free creator tool for the community.',
};
export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}