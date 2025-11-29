"use client";

import { useEffect, useState } from "react";

type ContactRow = { id: number; name: string; email: string; subject: string; message: string; created_at: string };

export default function AdminContactsPage() {
  const [items, setItems] = useState<ContactRow[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setStatus("loading");
      try {
        const res = await fetch("/api/contact");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        setItems(data);
        setStatus("idle");
      } catch (e) {
        setStatus("error");
        setError(e instanceof Error ? e.message : "Failed to load");
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="px-8 py-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Contact Requests</h2>
        {status === "loading" && <p className="text-muted-foreground">Loading...</p>}
        {status === "error" && <p className="text-red-600">{error}</p>}
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Subject</th>
                <th className="text-left p-3">Message</th>
                <th className="text-left p-3">Received</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.subject}</td>
                  <td className="p-3">{c.message}</td>
                  <td className="p-3 text-muted-foreground">{new Date(c.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}