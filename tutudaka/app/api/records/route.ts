import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "../../lib/auth";
import { readRecords, writeRecords } from "../../lib/blob";
import type { RecordMap, TaskKey } from "../../types";

export const runtime = "nodejs";

const ALLOWED_TASKS: TaskKey[] = ["earlyWake", "earlySleep", "takeout", "eatOut"];

const unauthorized = () =>
  NextResponse.json({ error: "未登录或验证失效" }, { status: 401 });

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
