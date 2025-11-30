"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<{ id?: number; role: "admin" | "user"; email?: string; name?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
      setLoaded(true);
    })();
  }, [pathname]);


  const handleLogout = async () => {
    try {
      setMenuOpen(false);
      const sure = typeof window !== 'undefined' ? window.confirm('Are you sure you want to log out?') : true;
      if (!sure) return;
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        router.replace("/");
        router.refresh();
      }
    } catch {}
  };

  return (
    <header className="bg-white border-b border-border text-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary text-primary">□</span>
          <span className="text-xl font-bold text-primary">Pollify</span>
        </Link>
        <nav className="hidden md:block">
          {!loaded ? null : user?.role === "admin" ? (
            <ul className="flex gap-8 text-sm font-medium text-foreground">
              <li><Link href="/admin">Admin Dashboard</Link></li>
              {pathname?.startsWith("/admin/") && (
                <li>
                  <button onClick={() => router.push("/admin")} className="text-sm font-medium text-foreground">Back</button>
                </li>
              )}
            </ul>
          ) : (
            <ul className="flex gap-8 text-sm font-medium text-foreground">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/polls">Polls</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          )}
        </nav>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin" className="text-sm font-medium text-foreground">Admin</Link>
              )}
              <Link href="/profile" className="text-sm font-medium text-foreground">Profile</Link>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold"
                >
                  {(() => {
                    const src = user?.name || user?.email || "";
                    if (user?.name) {
                      const parts = String(src).trim().split(/\s+/);
                      const a = parts[0]?.[0] || "";
                      const b = parts[1]?.[0] || "";
                      return (a + b).toUpperCase() || (a || "").toUpperCase();
                    } else {
                      const before = String(src).split("@")[0] || "";
                      return before.slice(0, 2).toUpperCase() || "?";
                    }
                  })()}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-md shadow-md">
                    <div className="px-4 py-3 border-b border-border">
                      <div className="text-sm font-semibold">{user.name || "User"}</div>
                      <div className="text-xs text-muted-foreground">{user.email || ""}</div>
                    </div>
                    <Link
                      href="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={async () => { setMenuOpen(false); await handleLogout(); }}
                      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
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