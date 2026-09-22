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

import { cn, hexToRgb, rgbToHex, adjustBrightness, hexToHsv, hsvToHex } from '@/lib/pixel-utils';
describe('pixel-utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });
    it('should handle conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });
    it('should handle tailwind merge conflicts', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    });
  });
  describe('hexToRgb', () => {
    it('should convert hex to RGB', () => {
      expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]);
      expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
      expect(hexToRgb('#ff0000')).toEqual([255, 0, 0]);
      expect(hexToRgb('#00ff00')).toEqual([0, 255, 0]);
      expect(hexToRgb('#0000ff')).toEqual([0, 0, 255]);
    });
    it('should handle hex without hash', () => {
      expect(hexToRgb('ffffff')).toEqual([255, 255, 255]);
    });
    it('should return [0, 0, 0] for invalid hex', () => {
      expect(hexToRgb('invalid')).toEqual([0, 0, 0]);
      expect(hexToRgb('')).toEqual([0, 0, 0]);
    });
  });
  describe('rgbToHex', () => {
    it('should convert RGB to hex', () => {
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
    });
    it('should handle mid-range values', () => {
      expect(rgbToHex(128, 128, 128)).toBe('#808080');
      expect(rgbToHex(64, 224, 208)).toBe('#40e0d0');
    });
  });
  describe('adjustBrightness', () => {
    it('should increase brightness', () => {
      const [r, g, b] = adjustBrightness(100, 100, 100, 0.2);
      expect(r).toBeGreaterThan(100);
      expect(g).toBeGreaterThan(100);
      expect(b).toBeGreaterThan(100);
    });
    it('should decrease brightness', () => {
      const [r, g, b] = adjustBrightness(200, 200, 200, -0.2);
      expect(r).toBeLessThan(200);
      expect(g).toBeLessThan(200);
      expect(b).toBeLessThan(200);
    });
    it('should clamp values to valid RGB range', () => {
      const [r1, g1, b1] = adjustBrightness(255, 255, 255, 1);
      expect(r1).toBeLessThanOrEqual(255);
      expect(g1).toBeLessThanOrEqual(255);
      expect(b1).toBeLessThanOrEqual(255);
      const [r2, g2, b2] = adjustBrightness(0, 0, 0, -1);
      expect(r2).toBeGreaterThanOrEqual(0);
      expect(g2).toBeGreaterThanOrEqual(0);
      expect(b2).toBeGreaterThanOrEqual(0);
    });
    it('should handle pure colors', () => {
      const [r, g, b] = adjustBrightness(255, 0, 0, 0);
      expect(r).toBeDefined();
      expect(g).toBeDefined();
      expect(b).toBeDefined();
    });
  });
  describe('HSV conversions', () => {
    it('should accurately convert back and forth between hex and HSV', () => {
      const hsv = hexToHsv('#ff6b39');
      const backToHex = hsvToHex(hsv.h, hsv.s, hsv.v);
      expect(backToHex).toBe('#ff6b39');
      const whiteHsv = hexToHsv('#ffffff');
      expect(whiteHsv.v).toBe(100);
      expect(whiteHsv.s).toBe(0);
      const blackHsv = hexToHsv('#000000');
      expect(blackHsv.v).toBe(0);
    });
  });
});
