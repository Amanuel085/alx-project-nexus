import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) return NextResponse.json({ message: "Missing token" }, { status: 400 });
    await query("CREATE TABLE IF NOT EXISTS account_delete_requests (token VARCHAR(255) PRIMARY KEY, user_id INT NOT NULL, expires_at DATETIME NOT NULL, used_at DATETIME NULL)");
    const rows = await query<{ user_id: number; expires_at: string; used_at: string | null }[]>("SELECT user_id, expires_at, used_at FROM account_delete_requests WHERE token = ?", [token]);
    if (!rows.length) return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    const row = rows[0];
    if (row.used_at) return NextResponse.json({ message: "Token already used" }, { status: 400 });
    if (new Date(row.expires_at).getTime() < Date.now()) return NextResponse.json({ message: "Token expired" }, { status: 400 });
    await query("DELETE FROM users WHERE id = ?", [row.user_id]);
    await query("UPDATE account_delete_requests SET used_at = NOW() WHERE token = ?", [token]);
    return NextResponse.json({ message: "Account deleted" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}