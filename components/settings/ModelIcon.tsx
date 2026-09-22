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

import { useState } from "react";
import { Globe } from "lucide-react";
import { getHuggingFaceFallbackUrl } from "@/lib/openrouter-catalog";
interface ModelIconProps {
  src?: string | null;
  fallbackSrc?: string | null;
  alt: string;
  size?: number;
}
export default function ModelIcon({ src, fallbackSrc, alt, size = 20 }: ModelIconProps) {
  const primary = src || getHuggingFaceFallbackUrl();
  const secondary = fallbackSrc || getHuggingFaceFallbackUrl();
  const [stage, setStage] = useState(0);
  if (stage >= 2) {
    return (
      <span
        aria-hidden
        className="flex items-center justify-center rounded-full bg-surface-hover text-text-muted"
        style={{ width: size, height: size }}
      >
        <Globe size={Math.max(12, Math.round(size * 0.6))} />
      </span>
    );
  }
  const current = stage === 0 ? primary : secondary;
  const handleError = () => {
    setStage(s => (s === 0 && primary === secondary ? 2 : s + 1));
  };
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={handleError}
      className="rounded-full object-cover bg-surface-hover"
      style={{ width: size, height: size }}
    />
  );
}