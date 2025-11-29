"use client";

import Hero from "@/sections/Hero";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (data?.user?.role === "admin") {
          router.replace("/admin");
        }
      } catch {}
    })();
  }, [router]);
  return (
    <main className="min-h-screen flex flex-col justify-between bg-white text-[#1A1A1A]">
      <Hero />
    </main>
  );
}