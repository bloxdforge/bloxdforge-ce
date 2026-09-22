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

import { openDB, DBSchema, IDBPDatabase } from 'idb';
interface PersistedFile {
  name: string;
  type: string;
  path: string;
  content: string;
}
interface BloxdForgeDB extends DBSchema {
  texture_packs: {
    key: string;
    value: PersistedFile[];
  };
  keyval: {
    key: string;
    value: unknown;
  }
}
let dbPromise: Promise<IDBPDatabase<BloxdForgeDB>> | null = null;
const getDb = () => {
  if (typeof window === 'undefined') {
    throw new Error('idb.getDb() called in SSR context (this is a bug)');
  }
  if (!dbPromise) {
    dbPromise = openDB<BloxdForgeDB>('bloxdforge-creator-db', 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
            db.createObjectStore('texture_packs');
        }
        if (oldVersion < 2) {
            db.createObjectStore('keyval');
        }
      },
    });
  }
  return dbPromise;
};
export const idb = {
  get: async (key: string): Promise<PersistedFile[] | undefined> => {
    if (typeof window === 'undefined') return undefined;
    return (await getDb()).get('texture_packs', key);
  },
  set: async (key: string, val: PersistedFile[]) => {
    if (typeof window === 'undefined') return;
    return (await getDb()).put('texture_packs', val, key);
  },
  del: async (key: string) => {
    if (typeof window === 'undefined') return;
    return (await getDb()).delete('texture_packs', key);
  },
};
export const idbKeyval = {
    get: async <T>(key: string): Promise<T | undefined> => {
        if (typeof window === 'undefined') return undefined;
        return (await getDb()).get('keyval', key) as T | undefined;
    },
    set: async (key: string, val: unknown) => {
        if (typeof window === 'undefined') return;
        return (await getDb()).put('keyval', val, key);
    },
    del: async (key: string) => {
        if (typeof window === 'undefined') return;
        return (await getDb()).delete('keyval', key);
    },
};