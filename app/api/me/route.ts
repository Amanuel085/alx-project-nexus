import { NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const token = getAuthCookie(req);
    if (!token) return NextResponse.json({ user: null }, { status: 200 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ user: null }, { status: 200 });

    const rows = await query<{
      id: number; name: string; email: string; role: "admin" | "user";
    }[]>("SELECT id, name, email, role FROM users WHERE id = ?", [Number(payload.sub)]);
    const user = rows[0] || null;
    if (!user) return NextResponse.json({ user: null }, { status: 200 });
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}