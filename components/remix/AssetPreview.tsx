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

import { useState, useEffect } from "react";
import Image from "next/image";
import { Box, FileCode, Cloud, ImageIcon } from "lucide-react";
import { RemixAsset } from "@/stores/useRemixStore";
const blobLoader = ({ src }: { src: string }) => src;
interface AssetPreviewProps {
  asset?: RemixAsset;
  blob?: Blob;
  category?: RemixAsset['category'];
  className?: string;
}
export default function AssetPreview({ asset, blob, category, className }: AssetPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const finalBlob = asset?.blob || blob;
  const finalCategory = asset?.category || category;
  useEffect(() => {
    if (!finalBlob) return;
    let objectUrl: string | null = null;
    if (finalCategory === 'texture' || finalCategory === 'skybox') {
      objectUrl = URL.createObjectURL(finalBlob);
      setPreviewUrl(objectUrl);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [finalBlob, finalCategory]);
  const renderIcon = () => {
    switch (finalCategory) {
      case 'texture':
        if (previewUrl) {
          return <Image loader={blobLoader} src={previewUrl} alt="preview" fill className="object-contain" style={{ imageRendering: 'pixelated' }} />;
        }
        return <ImageIcon className="text-text-subtle" />;
      case 'model': return <Box className="text-blue-500" />;
      case 'css': return <FileCode className="text-purple-500" />;
      case 'skybox':
        if (previewUrl) {
          return <Image loader={blobLoader} src={previewUrl} alt="preview" fill className="object-cover" />;
        }
        return <Cloud className="text-cyan-500" />;
      default: return <ImageIcon className="text-text-subtle" />;
    }
  };
  return (
    <div className={`flex items-center justify-center bg-surface border border-surface-border rounded-lg relative overflow-hidden ${className}`}>
      {renderIcon()}
    </div>
  );
}