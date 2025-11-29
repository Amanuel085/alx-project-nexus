"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<{ role: "admin" | "user"; name?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    })();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) router.replace("/");
    } catch {}
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary text-primary">□</span>
          <span className="text-xl font-bold text-primary">Pollify</span>
        </Link>
        <nav className="hidden md:block">
          <ul className="flex gap-8 text-sm font-medium text-foreground">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/polls">Polls</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin" className="text-sm font-medium text-foreground">Admin</Link>
              )}
              <button onClick={handleLogout} className="border border-primary text-primary px-4 py-2 rounded-md text-sm font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-foreground">Login</Link>
              <Link href="/signup" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}