import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = getAuthCookie(req);
    const user = token ? await verifyToken(token) : null;
    if (!user || user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const id = Number.parseInt(String(params.id ?? "").trim(), 10);
    if (!Number.isFinite(id) || !Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({} as { is_active?: boolean }));
    const nextActive = body.is_active === true ? 1 : 0;
    await query("UPDATE polls SET is_active = ? WHERE id = ?", [nextActive, id]);
    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}