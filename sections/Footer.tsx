export default function Footer() {
  return (
    <footer className="bg-[#F5F5F5] text-[#7E7B7B] px-8 py-12 text-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold text-[#1A1A1A] mb-2">Pollify</h3>
          <p>Create, vote, and decide together. Your voice matters.</p>
        </div>
        <div>
          <h3 className="font-semibold text-[#1A1A1A] mb-2">Company</h3>
          <ul className="space-y-1">
            <li>About Us</li>
            <li>Careers</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-[#1A1A1A] mb-2">Support</h3>
          <ul className="space-y-1">
            <li>Help Center</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-[#1A1A1A] mb-2">Legal</h3>
          <ul className="space-y-1">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>
      <p className="mt-8 text-center text-xs">© 2025 Pollify. All rights reserved.</p>
    </footer>
  );
}