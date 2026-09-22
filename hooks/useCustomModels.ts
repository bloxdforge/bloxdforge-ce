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

import { useCallback, useEffect, useState } from "react";
import {
  CUSTOM_MODELS_EVENT,
  CUSTOM_MODELS_KEY,
  CustomAiModel,
  loadCustomModels,
  saveCustomModels,
} from "@/lib/ai-models";
export function useCustomModels() {
  const [customModels, setCustomModels] = useState<CustomAiModel[]>([]);
  useEffect(() => {
    setCustomModels(loadCustomModels());
    const onChange = () => setCustomModels(loadCustomModels());
    const onStorage = (e: StorageEvent) => {
      if (e.key === CUSTOM_MODELS_KEY || e.key === null) onChange();
    };
    window.addEventListener(CUSTOM_MODELS_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CUSTOM_MODELS_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  const addCustomModel = useCallback((model: CustomAiModel) => {
    setCustomModels(prev => {
      if (prev.some(m => m.id === model.id)) return prev;
      const next = [...prev, model].slice(0, 50);
      saveCustomModels(next);
      return next;
    });
  }, []);
  const removeCustomModel = useCallback((id: string) => {
    setCustomModels(prev => {
      const next = prev.filter(m => m.id !== id);
      if (next.length === prev.length) return prev;
      saveCustomModels(next);
      return next;
    });
  }, []);
  const clearCustomModels = useCallback(() => {
    setCustomModels(() => {
      saveCustomModels([]);
      return [];
    });
  }, []);
  return { customModels, addCustomModel, removeCustomModel, clearCustomModels };
}