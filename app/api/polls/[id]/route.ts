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
      id: number; question: string; description: string | null; image_path: string | null; created_at: string; total_votes: number; created_by: number; category_id: number | null
    }[]>(
      "SELECT id, question, description, image_path, created_at, total_votes, created_by, category_id FROM polls WHERE id = ? LIMIT 1",
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
  const id = Number(params.id);
  const body = await req.json();
  await query("UPDATE polls SET question = ?, description = ? WHERE id = ? AND created_by = ?", [body.question, body.description || null, id, Number(user.sub)]);
  return NextResponse.json({ message: "Updated" });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const token = getAuthCookie(req);
  const user = token ? await verifyToken(token) : null;
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = Number(params.id);
  await query("DELETE FROM polls WHERE id = ? AND (created_by = ? OR ? = 'admin')", [id, Number(user.sub), user.role]);
  return NextResponse.json({ message: "Deleted" });
}