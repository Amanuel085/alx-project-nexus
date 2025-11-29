import { cookies } from "next/headers";
import * as jose from "jose";
import bcrypt from "bcryptjs";

const cookieName = "pollify_token";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me");

export type JWTPayload = {
  sub: string;
  role: "admin" | "user";
  email: string;
};

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: JWTPayload) {
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as JWTPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  cookies().set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
}

export function clearAuthCookie() {
  cookies().set(cookieName, "", { path: "/", maxAge: 0 });
}

export function getAuthCookie() {
  return cookies().get(cookieName)?.value || null;
}