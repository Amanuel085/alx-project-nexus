import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) return NextResponse.json({ message: "Missing token" }, { status: 400 });
    await query("CREATE TABLE IF NOT EXISTS password_change_requests (token VARCHAR(255) PRIMARY KEY, user_id INT NOT NULL, new_hash VARCHAR(255) NOT NULL, expires_at DATETIME NOT NULL, used_at DATETIME NULL)");
    const rows = await query<{ user_id: number; new_hash: string; expires_at: string; used_at: string | null }[]>("SELECT user_id, new_hash, expires_at, used_at FROM password_change_requests WHERE token = ?", [token]);
    if (!rows.length) return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    const row = rows[0];
    if (row.used_at) return NextResponse.json({ message: "Token already used" }, { status: 400 });
    if (new Date(row.expires_at).getTime() < Date.now()) return NextResponse.json({ message: "Token expired" }, { status: 400 });
    await query("UPDATE users SET password_hash = ? WHERE id = ?", [row.new_hash, row.user_id]);
    await query("UPDATE password_change_requests SET used_at = NOW() WHERE token = ?", [token]);
    return NextResponse.json({ message: "Password updated" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}