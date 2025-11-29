import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    type UserRow = {
      id: number; name: string; email: string; password_hash: string; role: "admin" | "user"; is_email_verified: number; is_active?: number;
    };
    let rows: UserRow[] = [];
    try {
      rows = await query<UserRow[]>(
        "SELECT id, name, email, password_hash, role, is_email_verified, is_active FROM users WHERE email = ?",
        [email]
      );
    } catch {
      rows = await query<UserRow[]>(
        "SELECT id, name, email, password_hash, role, is_email_verified FROM users WHERE email = ?",
        [email]
      );
    }
    if (!rows.length) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    const user = rows[0];
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    if (!user.is_email_verified && user.role !== "admin") {
      return NextResponse.json({ message: "Email not verified" }, { status: 403 });
    }
    const isActive = user.is_active ?? 1;
    if (user.role !== "admin" && isActive === 0) {
      return NextResponse.json({ message: "Account deactivated. Contact admin." }, { status: 403 });
    }

    const token = await signToken({ sub: String(user.id), role: user.role, email: user.email });
    const res = NextResponse.json({ id: user.id, name: user.name, role: user.role });
    res.cookies.set("pollify_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}