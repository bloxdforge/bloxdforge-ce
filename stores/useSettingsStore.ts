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

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface SettingsState {
  renderScale: number;
  setRenderScale: (scale: number) => void;
  disableAnimations: boolean;
  simpleUI: boolean;
  ecoMode: boolean;
  toggleDisableAnimations: () => void;
  toggleSimpleUI: () => void;
  toggleEcoMode: () => void;
  schematicAntiAlias: boolean;
  schematicShadows: boolean;
  toggleSchematicAntiAlias: () => void;
  toggleSchematicShadows: () => void;
  confirmTextureDeletion: boolean;
  setConfirmTextureDeletion: (value: boolean) => void;
  confirmPackDeletion: boolean;
  setConfirmPackDeletion: (value: boolean) => void;
  studioVisitCount: number;
  incrementStudioVisitCount: () => void;
  autoRedirectToStudio: boolean;
  setAutoRedirectToStudio: (value: boolean) => void;
  setStudioVisitCount: (value: number) => void;
  hasSeenSanitizationWarning: boolean;
  setHasSeenSanitizationWarning: (value: boolean) => void;
  hasDismissedWikiBanner: boolean;
  setHasDismissedWikiBanner: (value: boolean) => void;
  workshopItemsPerPage: number;
  setWorkshopItemsPerPage: (value: number) => void;
  editorFontFamily: string;
  setEditorFontFamily: (font: string) => void;
}
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      renderScale: 1,
      disableAnimations: false,
      simpleUI: false,
      ecoMode: false,
      schematicAntiAlias: true,
      schematicShadows: true,
      confirmTextureDeletion: true,
      confirmPackDeletion: true,
      studioVisitCount: 0,
      autoRedirectToStudio: false,
      hasSeenSanitizationWarning: false,
      hasDismissedWikiBanner: false,
      workshopItemsPerPage: 12,
      editorFontFamily: "'Fira Code', monospace",
      setRenderScale: (scale) => set({ renderScale: scale }),
      toggleDisableAnimations: () => set((state) => ({ disableAnimations: !state.disableAnimations })),
      toggleSimpleUI: () => set((state) => ({ simpleUI: !state.simpleUI })),
      toggleEcoMode: () => {
        const newValue = !get().ecoMode;
        set({
          ecoMode: newValue,
          renderScale: newValue ? 0.5 : 1,
          disableAnimations: newValue,
          simpleUI: newValue,
          schematicAntiAlias: !newValue,
          schematicShadows: !newValue,
        });
      },
      toggleSchematicAntiAlias: () => set((state) => ({ schematicAntiAlias: !state.schematicAntiAlias })),
      toggleSchematicShadows: () => set((state) => ({ schematicShadows: !state.schematicShadows })),
      setConfirmTextureDeletion: (value) => set({ confirmTextureDeletion: value }),
      setConfirmPackDeletion: (value) => set({ confirmPackDeletion: value }),
      incrementStudioVisitCount: () => {
        if (get().autoRedirectToStudio) return;
        const currentCount = get().studioVisitCount;
        if (currentCount < 10) {
          set({ studioVisitCount: currentCount + 1 });
        }
      },
      setAutoRedirectToStudio: (value) => set({ autoRedirectToStudio: value }),
      setStudioVisitCount: (value) => set({ studioVisitCount: value }),
      setHasSeenSanitizationWarning: (value) => set({ hasSeenSanitizationWarning: value }),
      setHasDismissedWikiBanner: (value) => set({ hasDismissedWikiBanner: value }),
      setWorkshopItemsPerPage: (value) => set({ workshopItemsPerPage: value }),
      setEditorFontFamily: (font) => set({ editorFontFamily: font }),
    }),
    {
      name: 'bloxdforge_settings',
    }
  )
);
