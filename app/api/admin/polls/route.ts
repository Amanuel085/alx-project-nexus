import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET() {
  const token = getAuthCookie();
  const user = token ? await verifyToken(token) : null;
  if (!user || user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const rows = await query<{
    id: number; question: string; is_active: number; created_at: string; creator: string; category: string | null; total_votes: number
  }[]>(
    `SELECT p.id, p.question, p.is_active, p.created_at, p.total_votes,
            u.name AS creator, c.name AS category
     FROM polls p
     LEFT JOIN users u ON u.id = p.created_by
     LEFT JOIN categories c ON c.id = p.category_id
     ORDER BY p.created_at DESC`
  );
  return NextResponse.json(rows);
}