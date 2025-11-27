import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import Footer from "@/sections/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-white text-[#1A1A1A]">
      <Navbar />
      <Hero />
      <Footer />
    </main>
  );
}