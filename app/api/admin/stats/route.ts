import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthCookie, verifyToken } from "@/lib/auth";

type CountRow = { count: number };

export async function GET(req: Request) {
  const token = getAuthCookie(req);
  const user = token ? await verifyToken(token) : null;
  if (!user || user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const [polls] = await query<CountRow[]>("SELECT COUNT(*) as count FROM polls");
  const [active] = await query<CountRow[]>("SELECT COUNT(*) as count FROM polls WHERE is_active = 1");
  const [votes] = await query<CountRow[]>("SELECT COUNT(*) as count FROM votes");
  const [users] = await query<CountRow[]>("SELECT COUNT(*) as count FROM users WHERE role = 'user'");
  const [newUsers] = await query<CountRow[]>("SELECT COUNT(*) as count FROM users WHERE role = 'user' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)");

  return NextResponse.json({
    totalPolls: polls?.count || 0,
    activePolls: active?.count || 0,
    totalVotes: votes?.count || 0,
    totalUsers: users?.count || 0,
    newUsers: newUsers?.count || 0,
  });
}