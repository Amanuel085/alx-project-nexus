import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET() {
  const rows = await query<{ id: number; name: string; slug: string }[]>("SELECT id, name, slug FROM categories ORDER BY name ASC");
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const token = getAuthCookie();
  const payload = token ? await verifyToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  const { name, slug } = await req.json();
  if (!name || !slug) return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  await query("INSERT INTO categories (name, slug) VALUES (?, ?)", [name, slug]);
  return NextResponse.json({ message: "Created" }, { status: 201 });
}