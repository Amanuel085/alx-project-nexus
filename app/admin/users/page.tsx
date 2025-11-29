"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AdminUser = { id: number; name: string; email: string; role: "admin" | "user"; is_active: number; is_email_verified: number; created_at: string };

export default function AdminUsersPage() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");
      setItems(data);
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: !isActive }) });
      if (res.ok) load();
    } catch {}
  };

  const editUser = async (u: AdminUser) => {
    const name = prompt("Edit name", u.name) ?? u.name;
    const email = prompt("Edit email", u.email) ?? u.email;
    const role = prompt("Edit role (admin/user)", u.role) ?? u.role;
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, role }) });
      if (res.ok) load();
    } catch {}
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) load();
    } catch {}
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="px-8 py-12 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Manage Users</h2>
          <Link href="/admin/contacts" className="text-sm text-primary">Contact Messages</Link>
        </div>
        {status === "loading" && <p className="text-muted-foreground">Loading...</p>}
        {status === "error" && <p className="text-red-600">{error}</p>}
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Verified</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{u.is_email_verified ? "Yes" : "No"}</td>
                  <td className="p-3">{u.is_active ? "Active" : "Inactive"}</td>
                  <td className="p-3">
                    <div className="flex gap-3">
                      <button className="text-primary" onClick={() => toggleActive(u.id, !!u.is_active)}>{u.is_active ? "Deactivate" : "Activate"}</button>
                      <button className="text-foreground" onClick={() => editUser(u)}>Edit</button>
                      <button className="text-red-600" onClick={() => deleteUser(u.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}