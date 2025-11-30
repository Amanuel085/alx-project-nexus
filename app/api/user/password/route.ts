import { NextResponse } from "next/server";
import { getAuthCookie, verifyToken, hashPassword, verifyPassword } from "@/lib/auth";
import { query } from "@/lib/db";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function PATCH(req: Request) {
  try {
    const token = getAuthCookie(req);
    const user = token ? await verifyToken(token) : null;
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const uid = Number(user.sub);
    const body = await req.json();
    const current = String(body.currentPassword || "");
    const next = String(body.newPassword || "");
    if (!current || !next) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    const rows = await query<{ password_hash: string; email: string; name: string }[]>("SELECT password_hash, email, name FROM users WHERE id = ?", [uid]);
    const ok = rows[0]?.password_hash ? await verifyPassword(current, rows[0].password_hash) : false;
    if (!ok) return NextResponse.json({ message: "Invalid current password" }, { status: 400 });
    const newHash = await hashPassword(next);

    await query(
      "CREATE TABLE IF NOT EXISTS password_change_requests (token VARCHAR(255) PRIMARY KEY, user_id INT NOT NULL, new_hash VARCHAR(255) NOT NULL, expires_at DATETIME NOT NULL, used_at DATETIME NULL)"
    );
    const reqToken = crypto.randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 30);
    await query("INSERT INTO password_change_requests (token, user_id, new_hash, expires_at) VALUES (?, ?, ?, ?)", [reqToken, uid, newHash, expires]);

    const baseURL = new URL(req.url).origin;
    const confirmLink = `${baseURL}/api/user/password/confirm?token=${reqToken}`;

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 0;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const from = process.env.MAIL_FROM || "no-reply@pollify.local";
    if (host && port && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user: smtpUser, pass: smtpPass } });
      await transporter.sendMail({
        from,
        to: rows[0]?.email || "",
        subject: "Confirm your password change",
        html: `<p>Hi ${rows[0]?.name || "User"},</p><p>Click to confirm your password change:</p><p><a href="${confirmLink}">Confirm Password Change</a></p>`,
        text: `Confirm password change: ${confirmLink}`,
      });
    }

    return NextResponse.json({ message: "Verification email sent" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}