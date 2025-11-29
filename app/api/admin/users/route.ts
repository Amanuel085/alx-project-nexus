import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const token = getAuthCookie(req);
    const user = token ? await verifyToken(token) : null;
    if (!user || user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    type Row = { id: number; name: string; email: string; role: "admin" | "user"; is_active?: number; is_email_verified: number; created_at?: string };
    let rows: Row[] = [];
    try {
      rows = await query<Row[]>("SELECT id, name, email, role, is_active, is_email_verified, created_at FROM users ORDER BY created_at DESC");
    } catch {
      try {
        rows = await query<Row[]>("SELECT id, name, email, role, is_active, is_email_verified FROM users ORDER BY id DESC");
      } catch {
        rows = await query<Row[]>("SELECT id, name, email, role, is_email_verified FROM users ORDER BY id DESC");
        rows = rows.map(r => ({ ...r, is_active: 1 }));
      }
      rows = rows.map(r => ({ ...r, created_at: new Date().toISOString() }));
    }
    return NextResponse.json(rows);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}