import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const poll = await query<{
    id: number; question: string; description: string | null; image_path: string | null; created_at: string; total_votes: number; created_by: number; category: string | null
  }[]>(
    `SELECT p.id, p.question, p.description, p.image_path, p.created_at, p.total_votes, p.created_by,
            c.name as category
     FROM polls p LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = ?`,
    [id]
  );
  if (!poll.length) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const options = await query<{ id: number; text: string; votes_count: number }[]>("SELECT id, text, votes_count FROM poll_options WHERE poll_id = ?", [id]);
  return NextResponse.json({ ...poll[0], options });
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