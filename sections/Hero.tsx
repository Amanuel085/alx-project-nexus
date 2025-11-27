import Image from "next/image";
import dnaImage from "@/public/dna.png"; 

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 py-20 bg-white">
      <div className="max-w-xl">
        <h2 className="text-4xl font-bold mb-4">Create. Vote. Decide.</h2>
        <p className="text-[#7E7B7B] mb-8">
          A simple and interactive online polling system.
        </p>
        <div className="flex gap-4">
          <button className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium">
            Create Poll
          </button>
          <button className="border border-[#34967C] text-[#34967C] px-6 py-3 rounded-md font-medium">
            Browse Polls
          </button>
        </div>
      </div>
      <div className="mt-12 md:mt-0">
        <Image src={dnaImage} alt="DNA strand" width={400} height={400} />
      </div>
    </section>
  );
}