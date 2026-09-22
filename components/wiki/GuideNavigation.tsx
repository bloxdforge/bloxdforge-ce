"use client";

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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Guide } from "@/app/studio/wiki/guides";
interface GuideNavigationProps {
  prev?: Guide;
  next?: Guide;
}
export default function GuideNavigation({ prev, next }: GuideNavigationProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-8 border-t border-surface-border">
      {prev ? (
        <Link 
          href={`/studio/wiki/guides/${prev.id}`}
          className="group flex flex-col p-6 rounded-2xl border border-surface-border bg-background hover:bg-surface hover:border-primary/30 transition-all"
        >
          <span className="flex items-center gap-2 text-xs font-bold text-text-subtle uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">
            <ChevronLeft size={12} /> Previous {prev.type === "blog" ? "Blog" : "Guide"}
          </span>
          <span className="text-lg font-bold text-white group-hover:text-primary/90 transition-colors line-clamp-1">
            {prev.title}
          </span>
        </Link>
      ) : <div />}
      {next ? (
        <Link 
          href={`/studio/wiki/guides/${next.id}`}
          className="group flex flex-col items-end text-right p-6 rounded-2xl border border-surface-border bg-background hover:bg-surface hover:border-primary/30 transition-all"
        >
          <span className="flex items-center gap-2 text-xs font-bold text-text-subtle uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">
            Next {next.type === "blog" ? "Blog" : "Guide"} <ChevronRight size={12} />
          </span>
          <span className="text-lg font-bold text-white group-hover:text-primary/90 transition-colors line-clamp-1">
            {next.title}
          </span>
        </Link>
      ) : <div />}
    </div>
  );
}
