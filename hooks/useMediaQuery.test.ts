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
import { useMediaQuery } from '@/hooks/useMediaQuery';
describe('useMediaQuery', () => {
  let matchMediaMock: jest.Mock;
  beforeEach(() => {
    matchMediaMock = jest.fn();
    window.matchMedia = matchMediaMock;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return false initially', () => {
    const addEventListener = jest.fn();
    const removeEventListener = jest.fn();
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    });
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });
  it('should return true when media query matches', () => {
    const addEventListener = jest.fn();
    const removeEventListener = jest.fn();
    matchMediaMock.mockReturnValue({
      matches: true,
      addEventListener,
      removeEventListener,
    });
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });
  it('should update when media query changes', () => {
    const listeners: Array<() => void> = [];
    const addEventListener = jest.fn((event, listener) => {
      listeners.push(listener);
    });
    const removeEventListener = jest.fn();
    const mockMedia = {
      matches: false,
      addEventListener,
      removeEventListener,
    };
    matchMediaMock.mockReturnValue(mockMedia);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
    act(() => {
      mockMedia.matches = true;
      listeners.forEach(listener => listener());
    });
    expect(result.current).toBe(true);
  });
  it('should clean up event listener on unmount', () => {
    const addEventListener = jest.fn();
    const removeEventListener = jest.fn();
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    });
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    unmount();
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
  it('should update event listener when query changes', () => {
    const addEventListener = jest.fn();
    const removeEventListener = jest.fn();
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    });
    const { rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: '(min-width: 768px)' } }
    );
    expect(addEventListener).toHaveBeenCalledTimes(1);
    rerender({ query: '(min-width: 1024px)' });
    expect(removeEventListener).toHaveBeenCalled();
    expect(addEventListener).toHaveBeenCalledTimes(2);
  });
});
