import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const token = getAuthCookie(req);
  const user = token ? await verifyToken(token) : null;
  const { optionId } = await req.json();
  const pollId = Number(params.id);
  if (!optionId) return NextResponse.json({ message: "Missing optionId" }, { status: 400 });

  const voterId = user ? Number(user.sub) : null;
  const existing = await query<{ id: number }[]>("SELECT id FROM votes WHERE poll_id = ? AND user_id = ?", [pollId, voterId]);
  if (existing.length) return NextResponse.json({ message: "Already voted" }, { status: 409 });

  await query("INSERT INTO votes (poll_id, option_id, user_id) VALUES (?, ?, ?)", [pollId, Number(optionId), voterId]);
  await query("UPDATE poll_options SET votes_count = votes_count + 1 WHERE id = ?", [Number(optionId)]);
  await query("UPDATE polls SET total_votes = total_votes + 1 WHERE id = ?", [pollId]);

  return NextResponse.json({ message: "Vote recorded" }, { status: 201 });
}