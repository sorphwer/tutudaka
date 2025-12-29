"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial: Theme = prefersDark ? "dark" : "light";
      setTheme(initial);
      applyTheme(initial);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);
  };

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  const iconClass = "h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform duration-200";
  const label = theme === "light" ? "浅色模式" : "深色模式";

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 ring-1 ring-gray-200 backdrop-blur transition hover:shadow-md active:scale-95 dark:bg-gray-800/80 dark:ring-gray-700"
        aria-label="切换主题"
      >
        <Sun className={iconClass} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 ring-1 ring-gray-200 backdrop-blur transition hover:shadow-md active:scale-95 dark:bg-gray-800/80 dark:ring-gray-700"
      aria-label={`当前: ${label}，点击切换`}
      title={label}
    >
      {theme === "light" ? <Sun className={iconClass} /> : <Moon className={iconClass} />}
    </button>
  );
}

