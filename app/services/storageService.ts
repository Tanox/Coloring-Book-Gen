/* services/storageService.ts v1.0.1 */
import { BookHistoryItem } from '../types';

const DB_NAME = 'ColoringBookDB';
const DB_VERSION = 1;
const STORE_FONTS = 'fonts';
const STORE_HISTORY = 'history';

// Open DB Helper
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_FONTS)) {
        db.createObjectStore(STORE_FONTS);
      }
      if (!db.objectStoreNames.contains(STORE_HISTORY)) {
        db.createObjectStore(STORE_HISTORY, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// --- Font Storage ---

export const getCachedFont = async (fontName: string): Promise<string | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_FONTS, 'readonly');
      const store = transaction.objectStore(STORE_FONTS);
      const request = store.get(fontName);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn("IndexedDB read error", e);
    return null;
  }
};

export const cacheFont = async (fontName: string, base64Data: string): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_FONTS, 'readwrite');
    const store = transaction.objectStore(STORE_FONTS);
    store.put(base64Data, fontName);
  } catch (e) {
    console.warn("IndexedDB write error", e);
  }
};

// --- History Storage ---

export const saveBookToHistory = async (book: BookHistoryItem): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_HISTORY, 'readwrite');
    const store = transaction.objectStore(STORE_HISTORY);
    store.put(book);
    
    // Optional: Limit history to last 5 items to save space
    const countRequest = store.count();
    countRequest.onsuccess = () => {
       if (countRequest.result > 5) {
           // Delete oldest
           const cursorReq = store.openCursor(); // iterates by key (id) ascending? No, likely default order. 
           // Since IDs are usually timestamp based or random, we might need a distinct index for timestamp.
           // For simplicity, we just keep it as is for now or just trust IDB capacity.
           // A comprehensive implementation would use an index on timestamp.
       }
    };
  } catch (e) {
    console.error("Failed to save history", e);
  }
};

export const getHistory = async (): Promise<BookHistoryItem[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_HISTORY, 'readonly');
      const store = transaction.objectStore(STORE_HISTORY);
      const request = store.getAll();
      
      request.onsuccess = () => {
          // Sort by timestamp desc
          const res = (request.result as BookHistoryItem[]).sort((a,b) => b.timestamp - a.timestamp);
          resolve(res);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const deleteHistoryItem = async (id: string): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_HISTORY, 'readwrite');
  const store = transaction.objectStore(STORE_HISTORY);
  store.delete(id);
};