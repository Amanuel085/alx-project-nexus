import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const token = getAuthCookie(req);
  const user = token ? await verifyToken(token) : null;
  if (!user || user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const id = Number(params.id);
  const body = await req.json();
  const active = body?.is_active === true ? 1 : 0;
  await query("UPDATE users SET is_active = ? WHERE id = ?", [active, id]);
  return NextResponse.json({ message: "Updated" });
}