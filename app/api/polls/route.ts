import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import type { ResultSetHeader } from "mysql2/promise";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const q = url.searchParams.get("q");

  let sql = `SELECT p.id, p.question, p.description, p.created_at, p.total_votes, c.name as category, u.name as created_by
             FROM polls p
             LEFT JOIN categories c ON c.id = p.category_id
             LEFT JOIN users u ON u.id = p.created_by
             WHERE p.is_active = 1`;
  const params: (string | number)[] = [];
  if (category && category !== "all") { sql += " AND c.slug = ?"; params.push(category); }
  if (q) { sql += " AND p.question LIKE ?"; params.push(`%${q}%`); }
  sql += " ORDER BY p.created_at DESC";
  const rows = await query<{ id: number; question: string; description: string | null; created_at: string; total_votes: number; category: string | null; created_by: string }[]>(sql, params);
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  try {
    const token = getAuthCookie(req);
    const user = token ? await verifyToken(token) : null;
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { question, description, category, options } = await req.json();
    if (!question || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const cats = await query<{ id: number }[]>("SELECT id FROM categories WHERE slug = ?", [category]);
    const categoryId = cats[0]?.id || null;
    const res = await query<ResultSetHeader>(
      "INSERT INTO polls (question, description, category_id, created_by) VALUES (?, ?, ?, ?)",
      [question, description || null, categoryId, Number(user.sub)]
    );
    const insertId = (res as ResultSetHeader).insertId;
    for (const opt of options) {
      const text = typeof opt === "string" ? opt : (opt?.text ?? "");
      if (!text) continue;
      await query<ResultSetHeader>("INSERT INTO poll_options (poll_id, text) VALUES (?, ?)", [insertId, text]);
    }

    const poll = await query<{
      id: number; question: string; description: string | null; created_at: string; total_votes: number; created_by: number; category: string | null
    }[]>(
      `SELECT p.id, p.question, p.description, p.created_at, p.total_votes, p.created_by,
              c.name as category
       FROM polls p LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = ?`,
      [insertId]
    );
    const optionsRows = await query<{ id: number; text: string; votes_count: number }[]>("SELECT id, text, votes_count FROM poll_options WHERE poll_id = ?", [insertId]);
    const payload = poll[0] ? {
      id: String(poll[0].id),
      question: poll[0].question,
      options: optionsRows.map(o => ({ id: String(o.id), text: o.text, votes: o.votes_count })),
      category: poll[0].category || (category || "other"),
      createdAt: poll[0].created_at,
      createdBy: String(poll[0].created_by),
      isActive: true,
      totalVotes: poll[0].total_votes,
    } : { id: String(insertId), question, options: [], category: category || "other", createdAt: new Date().toISOString(), createdBy: String(user.sub), isActive: true, totalVotes: 0 };
    return NextResponse.json(payload, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}