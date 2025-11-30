import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const idParam = url.searchParams.get("id");
    const id = Number.parseInt(String(idParam ?? "").trim(), 10);
    if (!Number.isFinite(id) || !Number.isInteger(id) || id <= 0) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const exists = await query<{ id: number }[]>("SELECT id FROM polls WHERE id = ?", [id]);
    if (!exists.length) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const totalRows = await query<{ total_votes: number }[]>("SELECT total_votes FROM polls WHERE id = ?", [id]);
    const totalVotes = totalRows[0]?.total_votes ?? 0;

    const optionVotes = await query<{ text: string; votes_count: number }[]>(
      "SELECT text, votes_count FROM poll_options WHERE poll_id = ?",
      [id]
    );

    const daily = await query<{ day: string; cnt: number }[]>(
      `SELECT DATE(v.created_at) as day, COUNT(*) as cnt
       FROM votes v
       WHERE v.poll_id = ? AND v.created_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
       GROUP BY DATE(v.created_at)
       ORDER BY day ASC`,
      [id]
    );

    const recent = await query<{ id: number; participant: string | null; option: string; created_at: string }[]>(
      `SELECT v.id, u.name as participant, po.text as option, v.created_at
       FROM votes v
       LEFT JOIN users u ON u.id = v.user_id
       LEFT JOIN poll_options po ON po.id = v.option_id
       WHERE v.poll_id = ?
       ORDER BY v.created_at DESC
       LIMIT 20`,
      [id]
    );

    return NextResponse.json({ totalVotes, optionVotes, daily, recent });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}