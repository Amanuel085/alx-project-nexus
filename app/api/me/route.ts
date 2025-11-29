import { NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export async function GET() {
  const token = getAuthCookie();
  if (!token) return NextResponse.json({ user: null }, { status: 200 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ user: null }, { status: 200 });
  return NextResponse.json({ user: payload }, { status: 200 });
}