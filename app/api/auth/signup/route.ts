import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import type { ResultSetHeader } from "mysql2/promise";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const existing = await query<{ id: number }[]>("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const password_hash = await hashPassword(password);
    const result = await query<ResultSetHeader>(
      "INSERT INTO users (name, email, password_hash, role, is_email_verified) VALUES (?, ?, ?, 'user', 0)",
      [name, email, password_hash]
    );
    const insertId = (result as ResultSetHeader).insertId;

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await query<ResultSetHeader>(
      "INSERT INTO email_verifications (user_id, token, expires_at) VALUES (?, ?, ?)",
      [insertId, token, expires]
    );

    const baseURL = new URL(req.url).origin;
    const verifyLink = `${baseURL}/api/auth/verify?token=${token}`;

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 0;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.MAIL_FROM || "no-reply@pollify.local";

    if (host && port && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      await transporter.sendMail({
        from,
        to: email,
        subject: "Verify your Pollify account",
        html: `<p>Hi ${name},</p><p>Please verify your email to activate your Pollify account.</p><p><a href="${verifyLink}">Click here to verify</a></p>`,
        text: `Verify your email: ${verifyLink}`,
      });
    }

    return NextResponse.json({ message: "Verification sent", token }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}