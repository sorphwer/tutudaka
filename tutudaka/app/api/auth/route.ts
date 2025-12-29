import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie, verifyPassword } from "../../lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const password = body?.password as string | undefined;

  if (!password) {
    return NextResponse.json({ error: "缺少密码" }, { status: 400 });
  }

  try {
    const ok = verifyPassword(password);
    if (!ok) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }
    await setAuthCookie();
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "验证失败" },
      { status: 500 },
    );
  }
}
