import Link from "next/link";

export default function Navbar() {
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
          <Link href="/login" className="text-sm font-medium text-foreground">Login</Link>
          <Link href="/signup" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">Sign Up</Link>
        </div>
      </div>
    </header>
  );
}