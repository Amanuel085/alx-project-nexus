"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/auth/verify?token=${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Verification failed");
        setStatus("success");
        setMessage("Email verified. You can now sign in.");
      } catch (e) {
        setStatus("error");
        const msg = e instanceof Error ? e.message : "Verification failed";
        setMessage(msg);
      }
    })();
  }, [params]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="px-8 py-12 max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        <p className={`mb-6 ${status === "error" ? "text-red-600" : "text-muted-foreground"}`}>{message || "Verifying..."}</p>
        <button
          onClick={() => router.replace("/login")}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium"
        >
          Go to Sign In
        </button>
      </section>
    </main>
  );
}