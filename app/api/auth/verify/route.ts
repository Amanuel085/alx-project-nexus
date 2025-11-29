import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) return NextResponse.json({ message: "Missing token" }, { status: 400 });

  const rows = await query<{ user_id: number; expires_at: string; used_at: string | null }[]>("SELECT user_id, expires_at, used_at FROM email_verifications WHERE token = ?", [token]);
  if (!rows.length) return NextResponse.json({ message: "Invalid token" }, { status: 400 });
  const row = rows[0];
  if (row.used_at) return NextResponse.json({ message: "Token already used" }, { status: 400 });
  if (new Date(row.expires_at).getTime() < Date.now()) return NextResponse.json({ message: "Token expired" }, { status: 400 });

  await query("UPDATE users SET is_email_verified = 1 WHERE id = ?", [row.user_id]);
  await query("UPDATE email_verifications SET used_at = NOW() WHERE token = ?", [token]);

  return NextResponse.json({ message: "Email verified" });
}