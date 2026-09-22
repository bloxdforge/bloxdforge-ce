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

export function SkeletonCard() {
  return (
    <div className="bg-background border border-surface-border rounded-2xl overflow-hidden animate-pulse min-h-[360px]">
      <div className="aspect-video bg-surface-hover" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-surface-hover rounded w-3/4" />
        <div className="h-3 bg-surface-hover rounded w-1/2" />
        <div className="flex gap-1.5">
          <div className="h-5 bg-surface-hover rounded-full w-14" />
          <div className="h-5 bg-surface-hover rounded-full w-16" />
          <div className="h-5 bg-surface-hover rounded-full w-12" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-9 bg-surface-hover rounded-lg flex-1" />
          <div className="h-9 bg-surface-hover rounded-lg flex-1" />
        </div>
      </div>
    </div>
  );
}
export function WorkshopSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
export function TextureSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
export function ScriptSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
