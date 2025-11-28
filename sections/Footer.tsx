import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F5] text-[#7E7B7B] px-8 py-12 text-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Pollify Brand */}
        <div>
          <h3 className="font-semibold text-[#1A1A1A] mb-2">Pollify</h3>
          <p>Create, vote, and decide together. Your voice matters.</p>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-[#1A1A1A] mb-2">Company</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/careers">Careers</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-[#1A1A1A] mb-2">Support</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/help">Help Center</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold text-[#1A1A1A] mb-2">Legal</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/legal">Terms & Privacy</Link>
            </li>
            <li>
              <Link href="/offline">Offline / Maintenance</Link>
            </li>
            <li>
              <Link href="/404">Error Page</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Note */}
      <p className="mt-8 text-center text-xs">
        © 2025 Pollify. All rights reserved.
      </p>
    </footer>
  );
}