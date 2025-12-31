import type { RecordMap } from "../types";

const CACHE_KEY = "tutudaka_records_cache";
const CACHE_VERSION = 1;

interface CacheData {
  version: number;
  records: RecordMap;
  timestamp: number;
}

/**
 * Get cached records from localStorage
 * Returns null if no cache exists or cache is invalid
 */
export const getCachedRecords = (): RecordMap | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw) as CacheData;

    // Check version compatibility
    if (data.version !== CACHE_VERSION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data.records;
  } catch {
    // Invalid cache, remove it
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

/**
 * Save records to localStorage cache
 */
export const setCachedRecords = (records: RecordMap): void => {
  if (typeof window === "undefined") return;

  try {
    const data: CacheData = {
      version: CACHE_VERSION,
      records,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Storage quota exceeded or other error, silently fail
    console.warn("Failed to cache records to localStorage");
  }
};

/**
 * Clear the records cache
 */
export const clearCachedRecords = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CACHE_KEY);
};

