import { TASK_DEFINITIONS } from "../types";
import type { TaskKey, RecordMap } from "../types";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  dateKey: string;
  records: RecordMap;
  onToggle: (dateKey: string, task: TaskKey) => void;
}

const formatDayLabel = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) return dateKey;
  return `${year}年${month}月${day}日`;
};

export function TaskList({ dateKey, records, onToggle }: TaskListProps) {
  const record = records[dateKey] ?? {};

  return (
    <section className="card mt-4 p-4">
      <div className="flex items-center justify-between pb-3">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">当天记录</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {formatDayLabel(dateKey)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {TASK_DEFINITIONS.map((task) => (
          <TaskItem
            key={task.key}
            task={task}
            active={Boolean(record[task.key])}
            onToggle={() => onToggle(dateKey, task.key)}
          />
        ))}
      </div>
    </section>
  );
}
