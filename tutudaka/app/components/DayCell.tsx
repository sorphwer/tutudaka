import type { DayRecord, TaskDefinition } from "../types";

interface DayCellProps {
  date: Date;
  dateKey: string;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  record?: DayRecord;
  tasks: TaskDefinition[];
  onSelect: (key: string) => void;
}

const cornerPosition: Record<TaskDefinition["corner"], string> = {
  topLeft: "top-1 left-1",
  topRight: "top-1 right-1",
  bottomLeft: "bottom-1 left-1",
  bottomRight: "bottom-1 right-1",
};

export function DayCell({
  date,
  dateKey,
  inCurrentMonth,
  isToday,
  isSelected,
  record,
  tasks,
  onSelect,
}: DayCellProps) {
  const day = date.getDate();
  const subdued = !inCurrentMonth;

  return (
    <button
      type="button"
      onClick={() => onSelect(dateKey)}
      className={`relative flex aspect-square min-h-11 flex-col items-center justify-center rounded-xl transition focus:outline-none ${
        isSelected
          ? "bg-blue-50 ring-2 ring-blue-300 shadow-sm dark:bg-gray-800/70 dark:ring-blue-500"
          : "bg-white/80 ring-1 ring-gray-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-900/60 dark:ring-gray-800"
      }`}
    >
      <span
        className={`text-sm font-medium flex items-center justify-center ${
          isToday
            ? "h-6 w-6 rounded-full bg-red-500 text-white"
            : subdued
              ? "text-gray-400 dark:text-gray-500"
              : "text-gray-900 dark:text-gray-50"
        }`}
      >
        {day}
      </span>

      {tasks.map((task) => {
        if (!record?.[task.key]) return null;
        const Icon = task.icon;
        return (
          <Icon
            key={task.key}
            className={`absolute ${cornerPosition[task.corner]}`}
            style={{ color: task.color }}
            strokeWidth={2.5}
            size={12}
            aria-label={task.label}
          />
        );
      })}
    </button>
  );
}
