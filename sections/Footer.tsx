import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 text-sm text-muted-foreground">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-primary text-primary">□</span>
              <span className="font-semibold text-foreground">Pollify</span>
            </div>
            <p>Create, vote, and decide together. Your voice matters.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/legal" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/legal" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-xs">© 2025 Pollify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}