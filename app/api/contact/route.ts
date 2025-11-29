import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import type { ResultSetHeader } from "mysql2/promise";

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json();
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }
  await query<ResultSetHeader>(
    "INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)",
    [name, email, subject, message]
  );
  return NextResponse.json({ message: "Submitted" }, { status: 201 });
}

export async function GET(req: Request) {
  try {
    const token = getAuthCookie(req);
    const user = token ? await verifyToken(token) : null;
    if (!user || user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    const rows = await query<{ id: number; name: string; email: string; subject: string; message: string; created_at: string }[]>(
      "SELECT id, name, email, subject, message, created_at FROM contacts ORDER BY created_at DESC"
    );
    return NextResponse.json(rows);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}