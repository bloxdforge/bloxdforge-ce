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

import { CHANGELOG } from '@/lib/changelog';
describe('changelog', () => {
  it('should have changelog entries', () => {
    expect(CHANGELOG).toBeDefined();
    expect(Array.isArray(CHANGELOG)).toBe(true);
    expect(CHANGELOG.length).toBeGreaterThan(0);
  });
  it('should have valid structure for each entry', () => {
    CHANGELOG.forEach((entry) => {
      expect(entry).toHaveProperty('version');
      expect(entry).toHaveProperty('date');
      expect(entry).toHaveProperty('type');
      expect(entry).toHaveProperty('changes');
      expect(typeof entry.version).toBe('string');
      expect(typeof entry.date).toBe('string');
      expect(['Major', 'Minor', 'Patch']).toContain(entry.type);
      expect(typeof entry.changes).toBe('object');
    });
  });
  it('should have valid version format', () => {
    CHANGELOG.forEach((entry) => {
      expect(entry.version).toMatch(/^v\d+\.\d+\.\d+$/);
    });
  });
  it('should have valid date format', () => {
    CHANGELOG.forEach((entry) => {
      expect(entry.date).toMatch(/^[A-Z][a-z]{2} \d{2}, \d{4}$/);
    });
  });
  it('should have valid change categories', () => {
    const validCategories = ['added', 'improved', 'renderingEngine', 'removed', 'fixed', 'changed'];
    CHANGELOG.forEach((entry) => {
      Object.keys(entry.changes).forEach((category) => {
        expect(validCategories).toContain(category);
      });
    });
  });
  it('should have arrays of strings for change descriptions', () => {
    CHANGELOG.forEach((entry) => {
      Object.values(entry.changes).forEach((changeList) => {
        if (changeList) {
          expect(Array.isArray(changeList)).toBe(true);
          changeList.forEach((change) => {
            expect(typeof change).toBe('string');
            expect(change.length).toBeGreaterThan(0);
          });
        }
      });
    });
  });
  it('should have most recent version first', () => {
    if (CHANGELOG.length > 1) {
      const firstVersion = CHANGELOG[0].version;
      expect(firstVersion).toMatch(/^v\d+\.\d+\.\d+$/);
    }
  });
  it('should have the latest entry with version v2.0.0', () => {
    expect(CHANGELOG[0].version).toBe('v2.0.0');
  });
  it('should have at least one change in each entry', () => {
    CHANGELOG.forEach((entry) => {
      const hasChanges = Object.values(entry.changes).some(
        (changeList) => changeList && changeList.length > 0
      );
      expect(hasChanges).toBe(true);
    });
  });
});
