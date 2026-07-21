import type { NextRequest, NextResponse } from "next/server";

export const ANON_COOKIE = "rmo_anon_id";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function getOrCreateAnonId(req: NextRequest): { anonId: string; isNew: boolean } {
  const existing = req.cookies.get(ANON_COOKIE)?.value;
  if (existing) return { anonId: existing, isNew: false };
  return { anonId: crypto.randomUUID(), isNew: true };
}

export function setAnonCookie(res: NextResponse, anonId: string): void {
  res.cookies.set(ANON_COOKIE, anonId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
  });
}
