import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = getAuthCookie(req);
    const user = token ? await verifyToken(token) : null;
    if (!user || user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    const id = Number(params.id);
    await query("DELETE FROM categories WHERE id = ?", [id]);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = getAuthCookie(req);
    const user = token ? await verifyToken(token) : null;
    if (!user || user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    const id = Number(params.id);
    const body = await req.json();
    const name = String(body.name || "").trim();
    const slug = String(body.slug || "").trim();
    if (!name || !slug) return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    await query("UPDATE categories SET name = ?, slug = ? WHERE id = ?", [name, slug, id]);
    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}