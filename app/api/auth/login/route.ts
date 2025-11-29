import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    const rows = await query<{
      id: number; name: string; email: string; password_hash: string; role: "admin" | "user"; is_email_verified: number;
    }[]>("SELECT id, name, email, password_hash, role, is_email_verified FROM users WHERE email = ?", [email]);
    if (!rows.length) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    const user = rows[0];
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    if (!user.is_email_verified && user.role !== "admin") {
      return NextResponse.json({ message: "Email not verified" }, { status: 403 });
    }

    const token = await signToken({ sub: String(user.id), role: user.role, email: user.email });
    await setAuthCookie(token);
    return NextResponse.json({ id: user.id, name: user.name, role: user.role });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}