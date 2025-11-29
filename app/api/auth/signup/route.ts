import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import type { ResultSetHeader } from "mysql2/promise";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const existing = await query<{ id: number }[]>("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const password_hash = await hashPassword(password);
    const result = await query<ResultSetHeader>(
      "INSERT INTO users (name, email, password_hash, role, is_email_verified) VALUES (?, ?, ?, 'user', 0)",
      [name, email, password_hash]
    );
    const insertId = (result as ResultSetHeader).insertId;

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await query<ResultSetHeader>(
      "INSERT INTO email_verifications (user_id, token, expires_at) VALUES (?, ?, ?)",
      [insertId, token, expires]
    );

    return NextResponse.json({ message: "Verification sent", token }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}