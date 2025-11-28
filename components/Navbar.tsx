import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 shadow-sm bg-white">
      {/* Brand */}
      <Link href="/" className="text-xl font-bold text-[#34967C]">
        Pollify
      </Link>

      {/* Navigation Links */}
      <ul className="flex gap-6 text-sm font-medium">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/polls">Polls</Link>
        </li>
        <li>
          <Link href="/polls/archive">Archive</Link>
        </li>
        <li>
          <Link href="/admin">Admin</Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        <li>
          <Link href="/notifications">Notifications</Link>
        </li>
        <li>
          <Link href="/settings">Settings</Link>
        </li>
        <li>
          <Link href="/legal">Terms & Privacy</Link>
        </li>
      </ul>

      {/* Auth Buttons */}
      <div className="flex gap-4">
        <Link
          href="/login"
          className="text-sm font-medium text-[#34967C]"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="bg-[#34967C] text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}