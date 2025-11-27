import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import PollGrid from "@/sections/PollGrid";

export default function PollsPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-white text-[#1A1A1A]">
      <Navbar />
      <section className="px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <input
            type="text"
            placeholder="Search polls..."
            className="w-full md:w-2/3 px-4 py-3 border border-[#E5E5E5] rounded-md shadow-sm text-sm"
          />
          <select className="w-full md:w-1/3 px-4 py-3 border border-[#E5E5E5] rounded-md shadow-sm text-sm">
            <option>All Categories</option>
            <option>Technology</option>
            <option>Politics</option>
            <option>Entertainment</option>
            <option>Education</option>
          </select>
        </div>
        <PollGrid />
      </section>
      <Footer />
    </main>
  );
}