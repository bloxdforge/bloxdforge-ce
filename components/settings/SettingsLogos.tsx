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

export function ForgeRenderLogo({ className = '', size = 24 }: { className?: string, size?: number | string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 2.5L3 7.5L12 12.5L21 7.5L12 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M3 11.5L12 16.5L21 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeOpacity="0.6"/>
      <path d="M3 15.5L12 20.5L21 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeOpacity="0.3"/>
    </svg>
  );
}
export function AIAgentLogo({ className = '', size = 24 }: { className?: string, size?: number | string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M20 14 C20 15.65 18.65 17 17 17 L9 17 L4 21 L4 7 C4 5.35 5.35 4 7 4 L17 4 C18.65 4 20 5.35 20 7 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 7 C12 9.5 13.5 11 16 11 C13.5 11 12 12.5 12 15 C12 12.5 10.5 11 8 11 C10.5 11 12 9.5 12 7 Z" fill="currentColor"/>
    </svg>
  );
}
