import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-white text-[#1A1A1A] flex flex-col justify-between">
      <Navbar />
      <section className="flex flex-col items-center justify-center flex-1 px-8 py-20 text-center">
        <h1 className="text-6xl font-bold text-[#34967C] mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-[#7E7B7B] max-w-md mb-8">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="flex gap-4">
          <Link
            href="/"
            className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium"
          >
            Go Home
          </Link>
          <Link
            href="/polls"
            className="border border-[#34967C] text-[#34967C] px-6 py-3 rounded-md font-medium"
          >
            Browse Polls
          </Link>
        </div>

        {/* Illustration Placeholder */}
        <div className="mt-12 w-64 h-64 bg-[#F5F5F5] rounded-lg flex items-center justify-center text-[#7E7B7B] text-sm">
          Illustration Placeholder
        </div>
      </section>
      <Footer />
    </main>
  );
}