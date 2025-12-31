import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "../../lib/auth";
import { readRecords, writeRecords } from "../../lib/blob";
import type { DayRecord, RecordMap, TaskKey } from "../../types";

export const runtime = "nodejs";

const ALLOWED_TASKS: TaskKey[] = ["earlyWake", "earlySleep", "takeout", "eatOut"];

const unauthorized = () =>
  NextResponse.json({ error: "未登录或验证失效" }, { status: 401 });

// Validate that a DayRecord only contains allowed tasks with boolean values
const isValidDayRecord = (day: unknown): day is DayRecord => {
  if (typeof day !== "object" || day === null) return false;
  for (const [key, value] of Object.entries(day)) {
    if (!ALLOWED_TASKS.includes(key as TaskKey)) return false;
    if (typeof value !== "boolean") return false;
  }
  return true;
};

// Validate that a RecordMap has valid date keys and DayRecords
const isValidRecordMap = (records: unknown): records is RecordMap => {
  if (typeof records !== "object" || records === null) return false;
  for (const [dateKey, dayRecord] of Object.entries(records)) {
    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return false;
    if (!isValidDayRecord(dayRecord)) return false;
  }
  return true;
};

export async function GET() {
  if (!(await isAuthed())) return unauthorized();
  try {
    const records = await readRecords();
    return NextResponse.json({ records });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "读取失败" },
      { status: 500 },
    );
  }
}

// POST: Toggle a single task (legacy, still supported)
export async function POST(request: NextRequest) {
  if (!(await isAuthed())) return unauthorized();

  const body = await request.json().catch(() => null);
  const date = body?.date as string | undefined;
  const task = body?.task as TaskKey | undefined;
  const value = body?.value as boolean | undefined;

  if (!date || !task) {
    return NextResponse.json({ error: "缺少日期或任务" }, { status: 400 });
  }

  if (!ALLOWED_TASKS.includes(task)) {
    return NextResponse.json({ error: "任务类型无效" }, { status: 400 });
  }

  try {
    const records = await readRecords();
    const currentDay = records[date] ?? {};
    const nextValue = typeof value === "boolean" ? value : !currentDay[task];
    const updatedDay = { ...currentDay, [task]: nextValue };
    const nextRecords: RecordMap = { ...records, [date]: updatedDay };
    await writeRecords(nextRecords);

    return NextResponse.json({ record: updatedDay, records: nextRecords });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "写入失败" },
      { status: 500 },
    );
  }
}

// PUT: Batch sync entire records (debounced from frontend)
export async function PUT(request: NextRequest) {
  if (!(await isAuthed())) return unauthorized();

  const body = await request.json().catch(() => null);
  const records = body?.records;

  if (!records) {
    return NextResponse.json({ error: "缺少 records 数据" }, { status: 400 });
  }

  if (!isValidRecordMap(records)) {
    return NextResponse.json({ error: "records 格式无效" }, { status: 400 });
  }

  try {
    await writeRecords(records);
    return NextResponse.json({ success: true, records });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "写入失败" },
      { status: 500 },
    );
  }
}
