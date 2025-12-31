import { useCallback, useRef, useState } from "react";
import { getCachedRecords, setCachedRecords } from "../lib/cache";
import type { RecordMap, TaskKey } from "../types";

interface UseRecordsOptions {
  initial?: RecordMap;
  enabled?: boolean;
}

const SYNC_DELAY_MS = 3000;

// Helper to get initial records (from cache or provided initial)
const getInitialRecords = (initial: RecordMap): RecordMap => {
  const cached = getCachedRecords();
  return cached ?? initial;
};

export const useRecords = ({ initial = {}, enabled = true }: UseRecordsOptions = {}) => {
  // Initialize from cache if available, otherwise use initial
  const [records, setRecords] = useState<RecordMap>(() => getInitialRecords(initial));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Refs for debounce logic
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRecordsRef = useRef<RecordMap | null>(null);
  // Note: We initialize with the same logic as state, but useRef evaluates immediately
  const initialRecordsValue = getInitialRecords(initial);
  const lastSyncedRef = useRef<RecordMap>(initialRecordsValue);

  // Sync records to server
  const syncToServer = useCallback(async (recordsToSync: RecordMap) => {
    setSyncing(true);
    try {
      const res = await fetch("/api/records", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: recordsToSync }),
      });

      if (res.status === 401) {
        setNeedsAuth(true);
        // Revert to last synced state on auth failure
        setRecords(lastSyncedRef.current);
        return false;
      }

      if (!res.ok) {
        setError("同步失败");
        // Revert to last synced state on error
        setRecords(lastSyncedRef.current);
        return false;
      }

      // Update last synced reference and cache
      lastSyncedRef.current = recordsToSync;
      setCachedRecords(recordsToSync);
      return true;
    } catch {
      setError("网络错误");
      setRecords(lastSyncedRef.current);
      return false;
    } finally {
      setSyncing(false);
      pendingRecordsRef.current = null;
    }
  }, []);

  // Schedule a debounced sync
  const scheduleSyncDebounced = useCallback((nextRecords: RecordMap) => {
    // Store pending records
    pendingRecordsRef.current = nextRecords;

    // Clear existing timer
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }

    // Set new timer
    syncTimerRef.current = setTimeout(() => {
      if (pendingRecordsRef.current) {
        syncToServer(pendingRecordsRef.current);
      }
      syncTimerRef.current = null;
    }, SYNC_DELAY_MS);
  }, [syncToServer]);

  const fetchRecords = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    setNeedsAuth(false);

    const res = await fetch("/api/records");
    if (res.status === 401) {
      setNeedsAuth(true);
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setError("获取记录失败");
      setLoading(false);
      return;
    }

    const data = await res.json();
    const fetchedRecords = data.records ?? {};
    setRecords(fetchedRecords);
    lastSyncedRef.current = fetchedRecords;
    // Update cache with fresh data from server
    setCachedRecords(fetchedRecords);
    setLoading(false);
  }, [enabled]);

  const toggleTask = useCallback(
    (dateKey: string, task: TaskKey) => {
      if (!enabled) {
        setNeedsAuth(true);
        return;
      }

      // Optimistic update - immediately update local state
      const nextRecords: RecordMap = {
        ...records,
        [dateKey]: { ...(records[dateKey] ?? {}), [task]: !records[dateKey]?.[task] },
      };
      setRecords(nextRecords);

      // Schedule debounced sync
      scheduleSyncDebounced(nextRecords);
    },
    [enabled, records, scheduleSyncDebounced],
  );

  return {
    records,
    loading,
    error,
    syncing,
    needsAuth,
    refresh: fetchRecords,
    toggleTask,
    setNeedsAuth,
  };
};
