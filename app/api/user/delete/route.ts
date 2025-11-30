import { NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const token = getAuthCookie(req);
    const user = token ? await verifyToken(token) : null;
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const uid = Number(user.sub);
    const rows = await query<{ email: string; name: string }[]>("SELECT email, name FROM users WHERE id = ?", [uid]);

    await query(
      "CREATE TABLE IF NOT EXISTS account_delete_requests (token VARCHAR(255) PRIMARY KEY, user_id INT NOT NULL, expires_at DATETIME NOT NULL, used_at DATETIME NULL)"
    );
    const reqToken = crypto.randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 30);
    await query("INSERT INTO account_delete_requests (token, user_id, expires_at) VALUES (?, ?, ?)", [reqToken, uid, expires]);

    const baseURL = new URL(req.url).origin;
    const confirmLink = `${baseURL}/api/user/delete/confirm?token=${reqToken}`;

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
        subject: "Confirm account deletion",
        html: `<p>Hi ${rows[0]?.name || "User"},</p><p>Please confirm deleting your account:</p><p><a href="${confirmLink}">Confirm Account Deletion</a></p>`,
        text: `Confirm account deletion: ${confirmLink}`,
      });
    }

    return NextResponse.json({ message: "Confirmation email sent" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}