"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreatePollPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (!data.user) {
          router.replace("/login");
        } else {
          router.replace("/polls");
        }
      } catch {
        router.replace("/login");
      }
    })();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <p className="text-muted-foreground">Redirecting...</p>
    </main>
  );
}