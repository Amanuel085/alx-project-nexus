import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-white text-[#1A1A1A] flex flex-col justify-between">
      <Navbar />
      <section className="flex flex-col items-center justify-center flex-1 px-8 py-20 text-center">
        {/* Illustration Placeholder */}
        <div className="w-64 h-64 bg-[#F5F5F5] rounded-lg flex items-center justify-center text-[#7E7B7B] text-sm mb-8">
          Maintenance Illustration
        </div>

        <h1 className="text-3xl font-bold mb-4">We’ll be back soon!</h1>
        <p className="text-[#7E7B7B] max-w-md mb-8">
          Pollify is currently offline for scheduled maintenance or due to connectivity issues.  
          Please check back later or try again.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium"
          >
            Retry
          </button>
          <Link
            href="/"
            className="border border-[#34967C] text-[#34967C] px-6 py-3 rounded-md font-medium"
          >
            Go Home
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}