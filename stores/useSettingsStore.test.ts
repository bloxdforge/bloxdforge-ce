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

import { renderHook, act } from '@testing-library/react';
import { useSettingsStore } from '@/stores/useSettingsStore';
describe('useSettingsStore', () => {
  beforeEach(() => {
    const { setState } = useSettingsStore;
    setState({
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
    });
  });
  it('should have correct initial state', () => {
    const { result } = renderHook(() => useSettingsStore());
    expect(result.current.renderScale).toBe(1);
    expect(result.current.disableAnimations).toBe(false);
    expect(result.current.simpleUI).toBe(false);
    expect(result.current.ecoMode).toBe(false);
    expect(result.current.schematicAntiAlias).toBe(true);
    expect(result.current.schematicShadows).toBe(true);
    expect(result.current.confirmTextureDeletion).toBe(true);
    expect(result.current.confirmPackDeletion).toBe(true);
    expect(result.current.studioVisitCount).toBe(0);
    expect(result.current.autoRedirectToStudio).toBe(false);
    expect(result.current.hasDismissedWikiBanner).toBe(false);
    expect(result.current.workshopItemsPerPage).toBe(12);
    expect(result.current.editorFontFamily).toBe("'Fira Code', monospace");
  });
  describe('setRenderScale', () => {
    it('should update render scale', () => {
      const { result } = renderHook(() => useSettingsStore());
      act(() => {
        result.current.setRenderScale(0.5);
      });
      expect(result.current.renderScale).toBe(0.5);
    });
  });
  describe('toggleDisableAnimations', () => {
    it('should toggle disable animations', () => {
      const { result } = renderHook(() => useSettingsStore());
      expect(result.current.disableAnimations).toBe(false);
      act(() => {
        result.current.toggleDisableAnimations();
      });
      expect(result.current.disableAnimations).toBe(true);
      act(() => {
        result.current.toggleDisableAnimations();
      });
      expect(result.current.disableAnimations).toBe(false);
    });
  });
  describe('toggleSimpleUI', () => {
    it('should toggle simple UI', () => {
      const { result } = renderHook(() => useSettingsStore());
      expect(result.current.simpleUI).toBe(false);
      act(() => {
        result.current.toggleSimpleUI();
      });
      expect(result.current.simpleUI).toBe(true);
    });
  });
  describe('toggleEcoMode', () => {
    it('should enable eco mode and update related settings', () => {
      const { result } = renderHook(() => useSettingsStore());
      act(() => {
        result.current.toggleEcoMode();
      });
      expect(result.current.ecoMode).toBe(true);
      expect(result.current.renderScale).toBe(0.5);
      expect(result.current.disableAnimations).toBe(true);
      expect(result.current.simpleUI).toBe(true);
      expect(result.current.schematicAntiAlias).toBe(false);
      expect(result.current.schematicShadows).toBe(false);
    });
    it('should disable eco mode and restore settings', () => {
      const { result } = renderHook(() => useSettingsStore());
      act(() => {
        result.current.toggleEcoMode();
      });
      act(() => {
        result.current.toggleEcoMode();
      });
      expect(result.current.ecoMode).toBe(false);
      expect(result.current.renderScale).toBe(1);
      expect(result.current.disableAnimations).toBe(false);
      expect(result.current.simpleUI).toBe(false);
      expect(result.current.schematicAntiAlias).toBe(true);
      expect(result.current.schematicShadows).toBe(true);
    });
  });
  describe('toggleSchematicAntiAlias', () => {
    it('should toggle schematic anti-alias', () => {
      const { result } = renderHook(() => useSettingsStore());
      expect(result.current.schematicAntiAlias).toBe(true);
      act(() => {
        result.current.toggleSchematicAntiAlias();
      });
      expect(result.current.schematicAntiAlias).toBe(false);
    });
  });
  describe('toggleSchematicShadows', () => {
    it('should toggle schematic shadows', () => {
      const { result } = renderHook(() => useSettingsStore());
      expect(result.current.schematicShadows).toBe(true);
      act(() => {
        result.current.toggleSchematicShadows();
      });
      expect(result.current.schematicShadows).toBe(false);
    });
  });
  describe('setConfirmTextureDeletion', () => {
    it('should set confirm texture deletion', () => {
      const { result } = renderHook(() => useSettingsStore());
      act(() => {
        result.current.setConfirmTextureDeletion(false);
      });
      expect(result.current.confirmTextureDeletion).toBe(false);
    });
  });
  describe('setConfirmPackDeletion', () => {
    it('should set confirm pack deletion', () => {
      const { result } = renderHook(() => useSettingsStore());
      act(() => {
        result.current.setConfirmPackDeletion(false);
      });
      expect(result.current.confirmPackDeletion).toBe(false);
    });
  });
  describe('incrementStudioVisitCount', () => {
    it('should increment studio visit count', () => {
      const { result } = renderHook(() => useSettingsStore());
      act(() => {
        result.current.incrementStudioVisitCount();
      });
      expect(result.current.studioVisitCount).toBe(1);
    });
    it('should not increment beyond 10', () => {
      const { result } = renderHook(() => useSettingsStore());
      act(() => {
        result.current.setStudioVisitCount(10);
      });
      act(() => {
        result.current.incrementStudioVisitCount();
      });
      expect(result.current.studioVisitCount).toBe(10);
    });
    it('should not increment if autoRedirectToStudio is true', () => {
      const { result } = renderHook(() => useSettingsStore());
      act(() => {
        result.current.setAutoRedirectToStudio(true);
      });
      act(() => {
        result.current.incrementStudioVisitCount();
      });
      expect(result.current.studioVisitCount).toBe(0);
    });
  });
  describe('setAutoRedirectToStudio', () => {
    it('should set auto redirect to studio', () => {
      const { result } = renderHook(() => useSettingsStore());
      act(() => {
        result.current.setAutoRedirectToStudio(true);
      });
      expect(result.current.autoRedirectToStudio).toBe(true);
    });
  });
  describe('setStudioVisitCount', () => {
    it('should set studio visit count', () => {
      const { result } = renderHook(() => useSettingsStore());
      act(() => {
        result.current.setStudioVisitCount(5);
      });
      expect(result.current.studioVisitCount).toBe(5);
    });
  });
  describe('setWorkshopItemsPerPage', () => {
    it('should update items per page', () => {
      const { result } = renderHook(() => useSettingsStore());
      act(() => {
        result.current.setWorkshopItemsPerPage(24);
      });
      expect(result.current.workshopItemsPerPage).toBe(24);
    });
  });
  describe('setEditorFontFamily', () => {
    it('should update editor font family', () => {
      const { result } = renderHook(() => useSettingsStore());
      act(() => {
        result.current.setEditorFontFamily('Consolas');
      });
      expect(result.current.editorFontFamily).toBe('Consolas');
    });
  });
});