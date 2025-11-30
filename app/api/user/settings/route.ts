import { NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";

async function ensurePreferencesColumn() {
  try {
    await query("ALTER TABLE users ADD COLUMN preferences JSON NULL");
  } catch {}
}

export async function GET(req: Request) {
  try {
    const token = getAuthCookie(req);
    const user = token ? await verifyToken(token) : null;
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    await ensurePreferencesColumn();
    const rows = await query<{ preferences: string | null }[]>("SELECT preferences FROM users WHERE id = ?", [Number(user.sub)]);
    const prefs = rows[0]?.preferences ? JSON.parse(String(rows[0].preferences)) : {};
    return NextResponse.json(prefs);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const token = getAuthCookie(req);
    const user = token ? await verifyToken(token) : null;
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    await ensurePreferencesColumn();
    const body = await req.json();
    const allowed = {
      emailNotif: Boolean(body.emailNotif),
      pushNotif: Boolean(body.pushNotif),
      smsNotif: Boolean(body.smsNotif),
      darkMode: Boolean(body.darkMode),
    };
    await query("UPDATE users SET preferences = ? WHERE id = ?", [JSON.stringify(allowed), Number(user.sub)]);
    return NextResponse.json({ message: "Saved" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}