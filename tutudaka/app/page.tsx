"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "./components/Calendar";
import { Header } from "./components/Header";
import { PasswordModal } from "./components/PasswordModal";
import { TaskList } from "./components/TaskList";
import { ThemeToggle } from "./components/ThemeToggle";
import { useRecords } from "./hooks/useRecords";
import { toDateKey } from "./lib/date";
import type { TaskKey } from "./types";

export default function Home() {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<string>(() => toDateKey(today));

  const [authed, setAuthed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string>();

  // useRecords now automatically initializes from localStorage cache
  const { records, loading, error, needsAuth, toggleTask, refresh, setNeedsAuth } = useRecords({
    enabled: authed,
  });

  useEffect(() => {
    const checkAuth = async () => {
      setCheckingAuth(true);
      try {
        const res = await fetch("/api/auth/check");
        if (res.ok) {
          setAuthed(true);
          setAuthOpen(false);
        } else {
          setAuthed(false);
          setAuthOpen(true);
        }
      } catch {
        setAuthed(false);
        setAuthOpen(true);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (authed) {
      refresh();
    }
  }, [authed, refresh]);

  useEffect(() => {
    if (needsAuth) {
      setAuthed(false);
      setAuthOpen(true);
    }
  }, [needsAuth]);

  const handleMonthChange = (delta: number) => {
    const next = new Date(currentMonth);
    next.setMonth(currentMonth.getMonth() + delta, 1);
    setCurrentMonth(next);
    setSelectedDate(toDateKey(next));
  };

  const handleToggleTask = (dateKey: string, task: TaskKey) => {
    if (!authed) {
      setNeedsAuth(true);
      return;
    }
    toggleTask(dateKey, task);
  };

  const handleAuthSubmit = async (password: string) => {
    setAuthLoading(true);
    setAuthError(undefined);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setAuthError(res.status === 401 ? "密码错误，再试试吧" : "验证失败，请稍后再试");
        return;
      }
      setAuthed(true);
      setNeedsAuth(false);
      setAuthOpen(false);
      refresh();
    } catch {
      setAuthError("网络错误，请稍后再试");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <main className="app-shell relative">
      {/* Theme toggle button - top right */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          图图&77打卡日历
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          早睡早起、好好吃饭，记录每天的小习惯。
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <Header
          month={currentMonth}
          onPrev={() => handleMonthChange(-1)}
          onNext={() => handleMonthChange(1)}
        />
        <Calendar
          month={currentMonth}
          records={records}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />
        <TaskList dateKey={selectedDate} records={records} onToggle={handleToggleTask} />
      </div>

      <PasswordModal
        open={authOpen}
        loading={authLoading}
        error={authError}
        onSubmit={handleAuthSubmit}
      />
    </main>
  );
}
