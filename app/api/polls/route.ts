import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import type { ResultSetHeader } from "mysql2/promise";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const idParam = url.searchParams.get("id");
    const category = url.searchParams.get("category");
    const q = url.searchParams.get("q");

    if (idParam) {
      const idNum = Number.parseInt(String(idParam).trim(), 10);
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
      let categoryName: string | null = null;
      if (row.category_id) {
        try {
          const cat = await query<{ name: string }[]>("SELECT name FROM categories WHERE id = ? LIMIT 1", [row.category_id]);
          categoryName = cat[0]?.name ?? null;
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
        category: categoryName,
        options,
      });
    }

    let sql = `SELECT p.id, p.question, p.description, p.image_path, p.created_at, p.total_votes, c.name as category, u.name as created_by
               FROM polls p
               LEFT JOIN categories c ON c.id = p.category_id
               LEFT JOIN users u ON u.id = p.created_by
               WHERE p.is_active = 1`;
    const params: (string | number)[] = [];
    if (category && category !== "all") { sql += " AND c.slug = ?"; params.push(category); }
    if (q) { sql += " AND p.question LIKE ?"; params.push(`%${q}%`); }
    sql += " ORDER BY p.created_at DESC";
    try {
      const rows = await query<{ id: number; question: string; description: string | null; image_path: string | null; created_at: string; total_votes: number; category: string | null; created_by: string }[]>(sql, params);
      return NextResponse.json(rows);
    } catch {
      const fallback = `SELECT p.id, p.question, NULL as description, NULL as image_path, NOW() as created_at, 0 as total_votes, c.name as category, u.name as created_by
                        FROM polls p
                        LEFT JOIN categories c ON c.id = p.category_id
                        LEFT JOIN users u ON u.id = p.created_by`;
      const rows = await query<{ id: number; question: string; description: string | null; image_path: string | null; created_at: string; total_votes: number; category: string | null; created_by: string }[]>(fallback + " ORDER BY p.id DESC", []);
      return NextResponse.json(rows);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = getAuthCookie(req);
    const user = token ? await verifyToken(token) : null;
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const form = await req.formData();
    const question = String(form.get("question") || "").trim();
    const description = String(form.get("description") || "").trim() || null;
    const category = String(form.get("category") || "").trim();
    const optionsRaw = String(form.get("options") || "[]");
    let options: string[] = [];
    try { options = JSON.parse(optionsRaw); } catch { options = []; }
    if (!question || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const cats = await query<{ id: number }[]>("SELECT id FROM categories WHERE slug = ?", [category]);
    const categoryId = cats[0]?.id || null;
    let imagePath: string | null = null;
    const file = form.get("image") as File | null;
    if (file && file.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      try { await fs.mkdir(uploadsDir, { recursive: true }); } catch {}
      const ext = (file.type?.split("/")[1] || "jpg").toLowerCase();
      const filename = `${crypto.randomUUID()}.${ext}`;
      const dest = path.join(uploadsDir, filename);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(dest, buffer);
      imagePath = `/uploads/${filename}`;
    }

    try {
      await query("ALTER TABLE polls ADD COLUMN image_path VARCHAR(255) NULL");
    } catch {}
    const res = await query<ResultSetHeader>(
      "INSERT INTO polls (question, description, category_id, created_by, image_path) VALUES (?, ?, ?, ?, ?)",
      [question, description, categoryId, Number(user.sub), imagePath]
    );
    const insertId = (res as ResultSetHeader).insertId;
    for (const opt of options) {
      const text = typeof opt === "string" ? opt : (opt?.text ?? "");
      if (!text) continue;
      await query<ResultSetHeader>("INSERT INTO poll_options (poll_id, text) VALUES (?, ?)", [insertId, text]);
    }

    const poll = await query<{
      id: number; question: string; description: string | null; image_path: string | null; created_at: string; total_votes: number; created_by: number; category: string | null
    }[]>(
      `SELECT p.id, p.question, p.description, p.image_path, p.created_at, p.total_votes, p.created_by,
              c.name as category
       FROM polls p LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = ?`,
      [insertId]
    );
    const optionsRows = await query<{ id: number; text: string; votes_count: number }[]>("SELECT id, text, votes_count FROM poll_options WHERE poll_id = ?", [insertId]);
    const payload = poll[0] ? {
      id: String(poll[0].id),
      question: poll[0].question,
      description: poll[0].description || undefined,
      imagePath: poll[0].image_path || undefined,
      options: optionsRows.map(o => ({ id: String(o.id), text: o.text, votes: o.votes_count })),
      category: poll[0].category || (category || "other"),
      createdAt: poll[0].created_at,
      createdBy: String(poll[0].created_by),
      isActive: true,
      totalVotes: poll[0].total_votes,
    } : { id: String(insertId), question, description: description || undefined, imagePath, options: [], category: category || "other", createdAt: new Date().toISOString(), createdBy: String(user.sub), isActive: true, totalVotes: 0 };
    return NextResponse.json(payload, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}