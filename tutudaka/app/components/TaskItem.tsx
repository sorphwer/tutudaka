import { Check } from "lucide-react";
import confetti from "canvas-confetti";
import { useRef, useCallback } from "react";
import type { TaskDefinition } from "../types";

interface TaskItemProps {
  task: TaskDefinition;
  active: boolean;
  onToggle: () => void;
}

export function TaskItem({ task, active, onToggle }: TaskItemProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const triggerConfetti = useCallback(() => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // Fire confetti from the button position
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x, y },
      colors: ["#6BCB77", "#4ECDC4", "#FFE66D", "#FF6B9D", "#C44569", "#45B7D1"],
      startVelocity: 25,
      gravity: 0.8,
      scalar: 0.9,
      ticks: 60,
    });

    // Second burst with different settings for more dramatic effect
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { x, y },
        colors: ["#F8B500", "#FF6B6B", "#4ECDC4", "#A855F7", "#3B82F6"],
        startVelocity: 20,
        gravity: 1,
        scalar: 0.7,
        ticks: 50,
      });
    }, 100);
  }, []);

  const handleClick = useCallback(() => {
    // Trigger confetti only when completing a positive task (not active -> active)
    if (!active && task.category === "positive") {
      triggerConfetti();
    }
    onToggle();
  }, [active, task.category, onToggle, triggerConfetti]);

  const statusText = active 
    ? (task.category === "positive" ? "已完成" : "已记录")
    : (task.category === "positive" ? "未完成" : "未记录");

  const Icon = task.icon;

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      className={`relative flex flex-col items-start gap-2 rounded-2xl border px-4 py-3 text-left shadow-sm transition active:scale-[0.98] ${
        active
          ? "border-transparent bg-gradient-to-br from-white to-sky-50 ring-2 ring-sky-200 dark:from-gray-900 dark:to-gray-800 dark:ring-sky-500/50"
          : "border-gray-200 bg-white hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60"
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <Icon 
          className={`h-8 w-8 ${!active ? "text-gray-400 dark:text-gray-500" : ""}`}
          style={{ color: active ? task.color : undefined }}
        />
        {active && (
          <div 
            className="flex h-6 w-6 items-center justify-center rounded-full shadow-sm"
            style={{ backgroundColor: task.color }}
          >
            <Check className="h-4 w-4 text-white" strokeWidth={3} />
          </div>
        )}
      </div>
      <div className="mt-1">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-50">{task.label}</div>
        <div className={`text-xs font-medium ${active ? "text-gray-600 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"}`}>
          {statusText}
        </div>
      </div>
    </button>
  );
}
