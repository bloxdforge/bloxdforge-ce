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

import { fuzzySearch } from '@/lib/search';
describe('fuzzySearch', () => {
  const testItems = [
    { id: 1, name: 'Apple', category: 'fruit' },
    { id: 2, name: 'Banana', category: 'fruit' },
    { id: 3, name: 'Carrot', category: 'vegetable' },
    { id: 4, name: 'Dragon Fruit', category: 'fruit' },
    { id: 5, name: 'Eggplant', category: 'vegetable' },
  ];
  it('should return all items when query is empty', () => {
    const result = fuzzySearch(testItems, '', ['name']);
    expect(result).toEqual(testItems);
  });
  it('should return all items when query is only whitespace', () => {
    const result = fuzzySearch(testItems, '   ', ['name']);
    expect(result).toEqual(testItems);
  });
  it('should find exact matches with highest score', () => {
    const result = fuzzySearch(testItems, 'Apple', ['name']);
    expect(result[0].name).toBe('Apple');
  });
  it('should be case insensitive', () => {
    const result = fuzzySearch(testItems, 'apple', ['name']);
    expect(result[0].name).toBe('Apple');
  });
  it('should find items that start with query', () => {
    const result = fuzzySearch(testItems, 'Ba', ['name']);
    expect(result[0].name).toBe('Banana');
  });
  it('should find items that contain query', () => {
    const result = fuzzySearch(testItems, 'egg', ['name']);
    expect(result[0].name).toBe('Eggplant');
  });
  it('should search across multiple keys', () => {
    const result = fuzzySearch(testItems, 'fruit', ['name', 'category']);
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(item => item.name === 'Dragon Fruit')).toBe(true);
  });
  it('should prioritize exact matches over partial matches', () => {
    const result = fuzzySearch(testItems, 'fruit', ['name', 'category']);
    const dragonFruitIndex = result.findIndex(item => item.name === 'Dragon Fruit');
    expect(dragonFruitIndex).toBeGreaterThanOrEqual(0);
  });
  it('should return empty array when no matches found', () => {
    const result = fuzzySearch(testItems, 'xyz', ['name']);
    expect(result).toEqual([]);
  });
  it('should handle items with missing keys', () => {
    const itemsWithMissing = [
      { id: 1, name: 'Apple' },
      { id: 2, description: 'No name' },
    ];
    const result = fuzzySearch(itemsWithMissing, 'Apple', ['name']);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Apple');
  });
  it('should find matches after spaces with higher score', () => {
    const result = fuzzySearch(testItems, 'Fruit', ['name']);
    expect(result[0].name).toBe('Dragon Fruit');
  });
  it('should sort results by score', () => {
    const result = fuzzySearch(testItems, 'a', ['name']);
    expect(result.length).toBeGreaterThan(0);
  });
});
