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

import Link from "next/link";
import { Home, AlertTriangle } from "lucide-react";
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-center p-4">
      <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-8 border border-surface-border">
        <AlertTriangle className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-6xl font-black text-white mb-2 tracking-tighter">404</h1>
      <h2 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h2>
      <p className="text-text-muted max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        href="/studio"
        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-all shadow-sm shadow-primary/10"
      >
        <Home size={18} />
        Return Home
      </Link>
    </div>
  );
}
