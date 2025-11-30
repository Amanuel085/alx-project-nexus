import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const token = getAuthCookie(req);
    const user = token ? await verifyToken(token) : null;
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const idParam = url.searchParams.get("id");
    const pollId = Number.parseInt(String(idParam ?? "").trim(), 10);
    if (!Number.isFinite(pollId) || !Number.isInteger(pollId) || pollId <= 0) {
      return NextResponse.json({ message: "Invalid poll" }, { status: 400 });
    }
    const body = await req.json().catch(() => ({} as { optionId?: string | number }));
    const optionIdNum = Number.parseInt(String(body.optionId ?? "").trim(), 10);
    if (!Number.isFinite(optionIdNum) || !Number.isInteger(optionIdNum) || optionIdNum <= 0) {
      return NextResponse.json({ message: "Missing optionId" }, { status: 400 });
    }

    const voterId = Number(user.sub);
    try { await query("ALTER TABLE votes ADD UNIQUE KEY uq_poll_user (poll_id, user_id)"); } catch {}

    const pollExists = await query<{ id: number; is_active: number }[]>("SELECT id, is_active FROM polls WHERE id = ?", [pollId]);
    if (!pollExists.length) return NextResponse.json({ message: "Not found" }, { status: 404 });
    if (pollExists[0].is_active !== 1) return NextResponse.json({ message: "Poll closed" }, { status: 409 });
    const checkOpt = await query<{ id: number }[]>("SELECT id FROM poll_options WHERE id = ? AND poll_id = ?", [optionIdNum, pollId]);
    if (!checkOpt.length) return NextResponse.json({ message: "Invalid option" }, { status: 400 });

    const existing = await query<{ id: number }[]>("SELECT id FROM votes WHERE poll_id = ? AND user_id = ?", [pollId, voterId]);
    if (existing.length) return NextResponse.json({ message: "Already voted" }, { status: 409 });

    await query("INSERT INTO votes (poll_id, option_id, user_id) VALUES (?, ?, ?)", [pollId, optionIdNum, voterId]);
    await query("UPDATE poll_options SET votes_count = votes_count + 1 WHERE id = ?", [optionIdNum]);
    await query("UPDATE polls SET total_votes = total_votes + 1 WHERE id = ?", [pollId]);

    return NextResponse.json({ message: "Vote recorded" }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}