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

import { renderHook } from '@testing-library/react';
import { useIsMobile } from '@/hooks/useIsMobile';
describe('useIsMobile', () => {
  const originalNavigator = window.navigator;
  afterEach(() => {
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });
  it('should return false for desktop user agent', () => {
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      writable: true,
      configurable: true,
    });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
  it('should return true for iPhone user agent', () => {
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)' },
      writable: true,
      configurable: true,
    });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
  it('should return true for Android user agent', () => {
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B)' },
      writable: true,
      configurable: true,
    });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
  it('should return true for iPad user agent', () => {
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X)' },
      writable: true,
      configurable: true,
    });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
  it('should return true for mobile Chrome user agent', () => {
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Mobile Chrome/91.0' },
      writable: true,
      configurable: true,
    });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
  it('should handle missing navigator gracefully', () => {
    Object.defineProperty(window, 'navigator', {
      value: undefined,
      writable: true,
      configurable: true,
    });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});
