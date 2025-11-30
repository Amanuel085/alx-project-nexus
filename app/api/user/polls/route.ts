import { NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const token = getAuthCookie(req);
    const user = token ? await verifyToken(token) : null;
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const uid = Number(user.sub);

    const created = await query<{
      id: number; question: string; description: string | null; image_path: string | null; created_at: string; total_votes: number; category: string | null
    }[]>(
      `SELECT p.id, p.question, p.description, p.image_path, p.created_at, p.total_votes, c.name as category
       FROM polls p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.created_by = ?
       ORDER BY p.created_at DESC`,
      [uid]
    );

    const voted = await query<{
      id: number; question: string; image_path: string | null; total_votes: number; category: string | null
    }[]>(
      `SELECT p.id, p.question, p.image_path, p.total_votes, c.name as category
       FROM votes v
       INNER JOIN polls p ON p.id = v.poll_id
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE v.user_id = ?
       ORDER BY v.id DESC`,
      [uid]
    );

    return NextResponse.json({ created, voted }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}