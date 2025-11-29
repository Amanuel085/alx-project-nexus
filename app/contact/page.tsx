"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setStatus("idle");
    if (!name || !email || !subject || !message) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json().catch(() => ({ message: "Failed" }));
      if (!res.ok) throw new Error(data.message || "Failed to submit");
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to submit";
      setError(msg);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <p className="text-muted-foreground mb-8">Have a question or feedback? Send us a message.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input className="w-full px-4 py-3 border border-border rounded-md bg-background" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" className="w-full px-4 py-3 border border-border rounded-md bg-background" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input className="w-full px-4 py-3 border border-border rounded-md bg-background" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea className="w-full px-4 py-3 border border-border rounded-md bg-background min-h-[140px]" value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <button onClick={handleSubmit} disabled={loading} className={`px-6 py-3 rounded-md font-medium ${loading ? "bg-primary/60 text-primary-foreground" : "bg-primary text-primary-foreground"}`}>
            {loading ? "Sending..." : "Send Message"}
          </button>
          {status === "success" && <p className="text-sm text-green-600">Message sent. We will get back to you shortly.</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </section>
    </main>
  );
}