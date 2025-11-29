import { NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = getAuthCookie(req);
    const admin = token ? await verifyToken(token) : null;
    if (!admin || admin.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const id = Number(params.id);
    const body = await req.json();
    const fields: string[] = [];
    const values: unknown[] = [];
    if (typeof body.name === "string") { fields.push("name = ?"); values.push(body.name); }
    if (typeof body.email === "string") { fields.push("email = ?"); values.push(body.email); }
    if (body.role === "admin" || body.role === "user") { fields.push("role = ?"); values.push(body.role); }
    if (!fields.length) return NextResponse.json({ message: "No changes" }, { status: 400 });

    type UserRow = { id: number; name: string; email: string; role: "admin" | "user" };
    const before = await query<UserRow[]>("SELECT id, name, email, role FROM users WHERE id = ?", [id]);
    await query("UPDATE users SET " + fields.join(", ") + " WHERE id = ?", [...values, id]);

    await query(
      "CREATE TABLE IF NOT EXISTS user_change_logs (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, action ENUM('deactivate','activate','update','delete') NOT NULL, changed_fields JSON NULL, performed_by INT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB"
    );
    const after = await query<UserRow[]>("SELECT id, name, email, role FROM users WHERE id = ?", [id]);
    await query(
      "INSERT INTO user_change_logs (user_id, action, changed_fields, performed_by) VALUES (?, 'update', ?, ?)",
      [id, JSON.stringify({ before: before[0] || null, after: after[0] || null }), Number(admin.sub)]
    );
    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = getAuthCookie(req);
    const admin = token ? await verifyToken(token) : null;
    if (!admin || admin.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const id = Number(params.id);
    type UserRow = { id: number; name: string; email: string; role: "admin" | "user" };
    const before = await query<UserRow[]>("SELECT id, name, email, role FROM users WHERE id = ?", [id]);

    await query(
      "CREATE TABLE IF NOT EXISTS user_change_logs (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, action ENUM('deactivate','activate','update','delete') NOT NULL, changed_fields JSON NULL, performed_by INT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB"
    );

    await query("DELETE FROM users WHERE id = ?", [id]);
    await query(
      "INSERT INTO user_change_logs (user_id, action, changed_fields, performed_by) VALUES (?, 'delete', ?, ?)",
      [id, JSON.stringify({ before: before[0] || null }), Number(admin.sub)]
    );
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}