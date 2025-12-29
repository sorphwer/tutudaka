import { useMemo } from "react";
import { getMonthGrid, toDateKey } from "../lib/date";
import { DayCell } from "./DayCell";
import { TASK_DEFINITIONS } from "../types";
import type { RecordMap } from "../types";

const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

interface CalendarProps {
  month: Date;
  records: RecordMap;
  selectedDate: string;
  onSelect: (dateKey: string) => void;
}

export function Calendar({ month, records, selectedDate, onSelect }: CalendarProps) {
  const todayKey = useMemo(() => toDateKey(new Date()), []);

  const cells = useMemo(() => getMonthGrid(month), [month]);

  return (
    <section className="card mt-4 overflow-hidden">
      <div className="grid grid-cols-7 border-b border-gray-100 bg-white/80 px-3 py-2 text-center text-sm font-medium text-gray-500 backdrop-blur dark:border-gray-800 dark:bg-gray-900/60">
        {weekDays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 p-3">
        {cells.map((cell) => (
          <DayCell
            key={cell.key}
            date={cell.date}
            dateKey={cell.key}
            inCurrentMonth={cell.inCurrentMonth}
            isToday={cell.key === todayKey}
            isSelected={cell.key === selectedDate}
            record={records[cell.key]}
            tasks={TASK_DEFINITIONS}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
