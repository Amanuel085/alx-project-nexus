import { NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const token = getAuthCookie(req);
    const user = token ? await verifyToken(token) : null;
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    await query("UPDATE users SET is_active = 0 WHERE id = ?", [Number(user.sub)]);
    return NextResponse.json({ message: "Account deactivated" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}