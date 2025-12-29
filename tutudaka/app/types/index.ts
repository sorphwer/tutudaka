import { Sun, Moon, ShoppingBag, Utensils, type LucideIcon } from "lucide-react";

export type TaskKey = "earlyWake" | "earlySleep" | "takeout" | "eatOut";

export type TaskCategory = "positive" | "negative";

export interface TaskDefinition {
  key: TaskKey;
  label: string;
  icon: LucideIcon;
  category: TaskCategory;
  color: string;
  corner: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}

export type DayRecord = Partial<Record<TaskKey, boolean>>;

export type RecordMap = Record<string, DayRecord>;

export interface CalendarMonth {
  year: number;
  month: number; // 0-11
}

export const TASK_DEFINITIONS: TaskDefinition[] = [
  {
    key: "earlyWake",
    label: "早起",
    icon: Sun,
    category: "positive",
    color: "#6BCB77",
    corner: "topLeft",
  },
  {
    key: "earlySleep",
    label: "早睡",
    icon: Moon,
    category: "positive",
    color: "#6BCB77",
    corner: "topRight",
  },
  {
    key: "takeout",
    label: "点外卖",
    icon: ShoppingBag,
    category: "negative",
    color: "#FF6B6B",
    corner: "bottomLeft",
  },
  {
    key: "eatOut",
    label: "出去吃",
    icon: Utensils,
    category: "negative",
    color: "#FF6B6B",
    corner: "bottomRight",
  },
];
