import { cookies } from "next/headers";

export const AUTH_COOKIE = "tutudaka_auth";

const getPassword = () => {
  const pwd = process.env.PASSWORD;
  if (!pwd) {
    throw new Error("PASSWORD is not configured.");
  }
  return pwd;
};

export const verifyPassword = (input: string) => {
  const expected = getPassword();
  return input === expected;
};

export const setAuthCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
};

export const clearAuthCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "", { path: "/", maxAge: 0, httpOnly: true });
};

export const isAuthed = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value === "1";
};
