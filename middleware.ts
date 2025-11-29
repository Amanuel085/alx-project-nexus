import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  if (url.pathname.startsWith("/admin")) {
    const token = req.cookies.get("pollify_token")?.value;
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    const payload = await verifyToken(token);
    if (!payload || payload.role !== "admin") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};