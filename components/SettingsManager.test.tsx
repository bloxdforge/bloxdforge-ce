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

import { render } from '@testing-library/react';
import SettingsManager from '@/components/SettingsManager';
import { useSettingsStore } from '@/stores/useSettingsStore';
jest.mock('@/stores/useSettingsStore');
describe('SettingsManager', () => {
  const mockUseSettingsStore = useSettingsStore as jest.MockedFunction<typeof useSettingsStore>;
  beforeEach(() => {
    document.documentElement.removeAttribute('data-animations');
    document.documentElement.removeAttribute('data-simple-ui');
  });
  it('should not set attributes when settings are disabled', () => {
    mockUseSettingsStore.mockReturnValue({
      disableAnimations: false,
      simpleUI: false,
    } as ReturnType<typeof useSettingsStore>);
    render(<SettingsManager />);
    expect(document.documentElement.hasAttribute('data-animations')).toBe(false);
    expect(document.documentElement.hasAttribute('data-simple-ui')).toBe(false);
  });
  it('should set data-animations attribute when animations are disabled', () => {
    mockUseSettingsStore.mockReturnValue({
      disableAnimations: true,
      simpleUI: false,
    } as ReturnType<typeof useSettingsStore>);
    render(<SettingsManager />);
    expect(document.documentElement.getAttribute('data-animations')).toBe('off');
  });
  it('should set data-simple-ui attribute when simple UI is enabled', () => {
    mockUseSettingsStore.mockReturnValue({
      disableAnimations: false,
      simpleUI: true,
    } as ReturnType<typeof useSettingsStore>);
    render(<SettingsManager />);
    expect(document.documentElement.getAttribute('data-simple-ui')).toBe('on');
  });
  it('should set both attributes when both settings are enabled', () => {
    mockUseSettingsStore.mockReturnValue({
      disableAnimations: true,
      simpleUI: true,
    } as ReturnType<typeof useSettingsStore>);
    render(<SettingsManager />);
    expect(document.documentElement.getAttribute('data-animations')).toBe('off');
    expect(document.documentElement.getAttribute('data-simple-ui')).toBe('on');
  });
  it('should update attributes when settings change', () => {
    const { rerender } = render(<SettingsManager />);
    mockUseSettingsStore.mockReturnValue({
      disableAnimations: false,
      simpleUI: false,
    } as ReturnType<typeof useSettingsStore>);
    rerender(<SettingsManager />);
    expect(document.documentElement.hasAttribute('data-animations')).toBe(false);
    mockUseSettingsStore.mockReturnValue({
      disableAnimations: true,
      simpleUI: false,
    } as ReturnType<typeof useSettingsStore>);
    rerender(<SettingsManager />);
    expect(document.documentElement.getAttribute('data-animations')).toBe('off');
  });
  it('should remove attributes when settings are toggled off', () => {
    const { rerender } = render(<SettingsManager />);
    mockUseSettingsStore.mockReturnValue({
      disableAnimations: true,
      simpleUI: true,
    } as ReturnType<typeof useSettingsStore>);
    rerender(<SettingsManager />);
    expect(document.documentElement.hasAttribute('data-animations')).toBe(true);
    expect(document.documentElement.hasAttribute('data-simple-ui')).toBe(true);
    mockUseSettingsStore.mockReturnValue({
      disableAnimations: false,
      simpleUI: false,
    } as ReturnType<typeof useSettingsStore>);
    rerender(<SettingsManager />);
    expect(document.documentElement.hasAttribute('data-animations')).toBe(false);
    expect(document.documentElement.hasAttribute('data-simple-ui')).toBe(false);
  });
  it('should render nothing (null)', () => {
    mockUseSettingsStore.mockReturnValue({
      disableAnimations: false,
      simpleUI: false,
    } as ReturnType<typeof useSettingsStore>);
    const { container } = render(<SettingsManager />);
    expect(container.firstChild).toBeNull();
  });
});
