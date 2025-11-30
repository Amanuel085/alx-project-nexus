import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const idStr = String(params.id ?? "").trim();
    const idNum = Number.parseInt(idStr, 10);
    if (!Number.isFinite(idNum) || !Number.isInteger(idNum) || idNum <= 0) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    const base = await query<{
      id: number; question: string; description: string | null; image_path: string | null; created_at: string; total_votes: number; created_by: number; category_id: number | null; is_active: number
    }[]>(
      "SELECT id, question, description, image_path, created_at, total_votes, created_by, category_id, is_active FROM polls WHERE id = ? LIMIT 1",
      [idNum]
    );
    if (!base.length) return NextResponse.json({ message: "Not found" }, { status: 404 });
    const row = base[0];
    let category: string | null = null;
    if (row.category_id) {
      try {
        const cat = await query<{ name: string }[]>("SELECT name FROM categories WHERE id = ? LIMIT 1", [row.category_id]);
        category = cat[0]?.name ?? null;
      } catch {}
    }
    let options: { id: number; text: string; votes_count: number }[] = [];
    try {
      options = await query<{ id: number; text: string; votes_count: number }[]>("SELECT id, text, votes_count FROM poll_options WHERE poll_id = ?", [idNum]);
    } catch {}
    return NextResponse.json({
      id: row.id,
      question: row.question,
      description: row.description,
      image_path: row.image_path,
      created_at: row.created_at,
      total_votes: row.total_votes,
      created_by: row.created_by,
      is_active: row.is_active === 1,
      category,
      options,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const token = getAuthCookie(req);
  const user = token ? await verifyToken(token) : null;
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const idStr = String(params.id ?? "").trim();
  const id = Number.parseInt(idStr, 10);
  if (!Number.isFinite(id) || !Number.isInteger(id) || id <= 0) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const body = await req.json();
  const fields: string[] = [];
  const values: unknown[] = [];
  if (typeof body.question === "string") { fields.push("question = ?"); values.push(body.question); }
  if (typeof body.description === "string" || body.description === null) { fields.push("description = ?"); values.push(body.description ?? null); }
  if (typeof body.is_active === "boolean") { fields.push("is_active = ?"); values.push(body.is_active ? 1 : 0); }
  if (!fields.length) return NextResponse.json({ message: "No changes" }, { status: 400 });
  await query("UPDATE polls SET " + fields.join(", ") + " WHERE id = ? AND (created_by = ? OR ? = 'admin')", [...values, id, Number(user.sub), user.role]);
  return NextResponse.json({ message: "Updated" });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = getAuthCookie(req);
    const user = token ? await verifyToken(token) : null;
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const idStr = String(params.id ?? "").trim();
    const id = Number.parseInt(idStr, 10);
    if (!Number.isFinite(id) || !Number.isInteger(id) || id <= 0) return NextResponse.json({ message: "Not found" }, { status: 404 });
    await query("DELETE FROM polls WHERE id = ? AND (created_by = ? OR ? = 'admin')", [id, Number(user.sub), user.role]);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}