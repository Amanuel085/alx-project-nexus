import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ message: "Disabled in production" }, { status: 403 });
    }
    const email = process.env.ADMIN_EMAIL || "admin@pollify.local";
    const name = process.env.ADMIN_NAME || "Admin";
    const password = process.env.ADMIN_PASSWORD || "Admin123!";

    const existing = await query<{ id: number }[]>("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length) {
      return NextResponse.json({ message: "Admin already exists" }, { status: 200 });
    }
    const hash = await hashPassword(password);
    await query("INSERT INTO users (name, email, password_hash, role, is_email_verified) VALUES (?, ?, ?, 'admin', 1)", [name, email, hash]);
    return NextResponse.json({ message: "Admin seeded", email });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}