"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

interface PasswordModalProps {
  open: boolean;
  loading?: boolean;
  error?: string;
  onSubmit: (password: string) => void;
}

export function PasswordModal({ open, loading, error, onSubmit }: PasswordModalProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value) return;
    onSubmit(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
      >
        <div className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-50">输入密码</div>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          仅自己可用的小秘密，验证后自动记住登录状态。
        </p>
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          密码
          <input
            ref={inputRef}
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-base text-gray-900 shadow-inner outline-none ring-2 ring-transparent transition focus:border-transparent focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:ring-blue-600/30"
            placeholder="输入访问密码"
          />
        </label>
        {error && <div className="mt-2 text-xs font-medium text-red-500">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "验证中..." : "解锁"}
        </button>
      </form>
    </div>
  );
}
