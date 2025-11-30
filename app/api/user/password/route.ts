import { NextResponse } from "next/server";
import { getAuthCookie, verifyToken, hashPassword, verifyPassword } from "@/lib/auth";
import { query } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const token = getAuthCookie(req);
    const user = token ? await verifyToken(token) : null;
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const uid = Number(user.sub);
    const body = await req.json();
    const current = String(body.currentPassword || "");
    const next = String(body.newPassword || "");
    if (!current || !next) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    const rows = await query<{ password_hash: string }[]>("SELECT password_hash FROM users WHERE id = ?", [uid]);
    const ok = rows[0]?.password_hash ? await verifyPassword(current, rows[0].password_hash) : false;
    if (!ok) return NextResponse.json({ message: "Invalid current password" }, { status: 400 });
    const hash = await hashPassword(next);
    await query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, uid]);
    return NextResponse.json({ message: "Password updated" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}