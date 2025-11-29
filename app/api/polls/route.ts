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
  const token = getAuthCookie();
  const user = token ? await verifyToken(token) : null;
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { question, description, categorySlug, options } = await req.json();
  if (!question || !Array.isArray(options) || options.length < 2) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const cats = await query<{ id: number }[]>("SELECT id FROM categories WHERE slug = ?", [categorySlug]);
  const categoryId = cats[0]?.id || null;
  const res = await query<ResultSetHeader>(
    "INSERT INTO polls (question, description, category_id, created_by) VALUES (?, ?, ?, ?)",
    [question, description || null, categoryId, Number(user.sub)]
  );
  const insertId = (res as ResultSetHeader).insertId;
  for (const text of options) {
    await query<ResultSetHeader>("INSERT INTO poll_options (poll_id, text) VALUES (?, ?)", [insertId, text]);
  }
  return NextResponse.json({ id: insertId }, { status: 201 });
}