import { useCallback, useState } from "react";
import type { RecordMap, TaskKey } from "../types";

interface UseRecordsOptions {
  initial?: RecordMap;
  enabled?: boolean;
}

export const useRecords = ({ initial = {}, enabled = true }: UseRecordsOptions = {}) => {
  const [records, setRecords] = useState<RecordMap>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);

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
    setRecords(data.records ?? {});
    setLoading(false);
  }, [enabled]);

  const toggleTask = useCallback(
    async (dateKey: string, task: TaskKey) => {
      if (!enabled) {
        setNeedsAuth(true);
        return;
      }

      const prevSnapshot = records;
      const nextRecords: RecordMap = {
        ...records,
        [dateKey]: { ...(records[dateKey] ?? {}), [task]: !records[dateKey]?.[task] },
      };
      setRecords(nextRecords);

      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateKey, task, value: nextRecords[dateKey][task] }),
      });

      if (res.status === 401) {
        setNeedsAuth(true);
        setRecords(prevSnapshot);
        return;
      }

      if (!res.ok) {
        setError("更新失败");
        setRecords(prevSnapshot);
        return;
      }

      const data = await res.json();
      setRecords(data.records ?? nextRecords);
    },
    [enabled, records],
  );

  return {
    records,
    loading,
    error,
    needsAuth,
    refresh: fetchRecords,
    toggleTask,
    setNeedsAuth,
  };
};
