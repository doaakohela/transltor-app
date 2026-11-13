import { VocabularyItem } from '../types.ts';

const DB_NAME = 'VocabFlowDB';
const DB_VERSION = 1;
const STORE_NAME = 'lists';
const MAIN_KEY = 'main';
const LS_LIST_KEY = 'vocabflow_words_list';
const LS_MODE_KEY = 'vocabflow_words_storage';
const LOCAL_STORAGE_ITEM_CAP = 750;

function openVocabDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Failed to open IndexedDB'));
  });
}

export function loadVocabularyListSync(): any[] | null {
  try {
    const mode = localStorage.getItem(LS_MODE_KEY);
    if (mode === 'idb') {
      return null;
    }
    const saved = localStorage.getItem(LS_LIST_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    console.warn('Could not read localStorage word list:', err);
    return null;
  }
}

export async function loadVocabularyListAsync(): Promise<any[] | null> {
  try {
    const db = await openVocabDB();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(MAIN_KEY);
      req.onsuccess = () => {
        const res = req.result;
        resolve(Array.isArray(res) ? res : null);
      };
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('Could not read IndexedDB word list:', err);
    return null;
  }
}

export async function saveVocabularyList(items: VocabularyItem[]): Promise<void> {
  // Always try localStorage for small/medium lists for instant reload; offload large lists to IndexedDB
  if (items.length <= LOCAL_STORAGE_ITEM_CAP) {
    try {
      const serialized = JSON.stringify(items);
      localStorage.setItem(LS_LIST_KEY, serialized);
      localStorage.setItem(LS_MODE_KEY, 'local');
    } catch {
      // Fallback gracefully to IndexedDB if localStorage quota is tight on mobile
      try {
        localStorage.removeItem(LS_LIST_KEY);
        localStorage.setItem(LS_MODE_KEY, 'idb');
      } catch {
        // ignore
      }
    }
  } else {
    try {
      localStorage.removeItem(LS_LIST_KEY);
      localStorage.setItem(LS_MODE_KEY, 'idb');
    } catch {
      // ignore
    }
  }

  // Persist to IndexedDB asynchronously (handles 50,000+ words cleanly across Mobile, Tablet, Desktop)
  try {
    const db = await openVocabDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(items, MAIN_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB save fallback warning:', err);
  }
}

export async function clearVocabularyStorage(): Promise<void> {
  try {
    localStorage.removeItem(LS_LIST_KEY);
    localStorage.removeItem(LS_MODE_KEY);
  } catch {
    // ignore
  }
  try {
    const db = await openVocabDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(MAIN_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // ignore
  }
}
