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

import { useState, useCallback } from 'react';
export function useDownloadAnimation() {
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const startDownload = useCallback((id: string) => {
    setDownloadingIds(prev => new Set(prev).add(id));
  }, []);
  const endDownload = useCallback((id: string) => {
    setDownloadingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);
  const isDownloading = useCallback((id: string) => {
    return downloadingIds.has(id);
  }, [downloadingIds]);
  return { startDownload, endDownload, isDownloading };
}
