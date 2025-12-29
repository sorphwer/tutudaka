import { NextResponse } from "next/server";
import { isAuthed } from "../../../lib/auth";

export async function GET() {
  const authed = await isAuthed();
  if (!authed) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
