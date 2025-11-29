"use client";

import { useEffect, useState } from "react";

type AdminPoll = { id: number; question: string; is_active: number; created_at: string; creator: string; category: string | null; total_votes: number };

export default function AdminPollsPage() {
  const [items, setItems] = useState<AdminPoll[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/polls");
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
      const res = await fetch(`/api/admin/polls/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: !isActive }) });
      if (res.ok) load();
    } catch {}
  };

  const deletePoll = async (id: number) => {
    try {
      const res = await fetch(`/api/polls/${id}`, { method: "DELETE" });
      if (res.ok) load();
    } catch {}
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="px-8 py-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Manage Polls</h2>
        {status === "loading" && <p className="text-muted-foreground">Loading...</p>}
        {status === "error" && <p className="text-red-600">{error}</p>}
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-3">Question</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Creator</th>
                <th className="text-left p-3">Votes</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.question}</td>
                  <td className="p-3">{p.category || "-"}</td>
                  <td className="p-3">{p.creator}</td>
                  <td className="p-3">{p.total_votes}</td>
                  <td className="p-3">{p.is_active ? "Active" : "Inactive"}</td>
                  <td className="p-3 space-x-2">
                    <button className="text-primary" onClick={() => toggleActive(p.id, !!p.is_active)}>{p.is_active ? "Deactivate" : "Activate"}</button>
                    <button className="text-red-600" onClick={() => deletePoll(p.id)}>Delete</button>
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