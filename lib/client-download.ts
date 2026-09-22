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

import toast from "react-hot-toast";
import { sanitizeFileName } from "./filename-utils";
import { useSettingsStore } from "@/stores/useSettingsStore";
/*! SIMPLIFIED START */
export async function generateProxyUrl(targetUrl: string, filename?: string): Promise<string> {
  let absoluteUrl = targetUrl;
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    absoluteUrl = new URL(targetUrl, window.location.origin).toString();
  }
  if (filename) {
    const { wasSanitized } = sanitizeFileName(filename.split('.')[0]);
    if (wasSanitized && !useSettingsStore.getState().hasSeenSanitizationWarning) {
      window.dispatchEvent(new CustomEvent('bf-show-sanitization-warning'));
      useSettingsStore.getState().setHasSeenSanitizationWarning(true);
    }
  }
  return absoluteUrl;
}
export async function fetchThroughProxy(targetUrl: string, filename?: string): Promise<Response> {
  void filename;
  return fetch(targetUrl);
}
export async function secureDownload(targetUrl: string, filename?: string) {
  try {
    const url = await generateProxyUrl(targetUrl, filename);
    const link = document.createElement('a');
    link.href = url;
    if (filename) {
        link.download = filename;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Download failed. Please try again.");
  }
}
/*! SIMPLIFIED END */
