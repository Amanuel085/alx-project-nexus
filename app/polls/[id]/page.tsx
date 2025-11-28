"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";

const dummyPoll = {
  id: "1",
  question: "What is your favorite programming language for web development?",
  description:
    "Help us understand the current trends in web development by picking your preferred language. Your input will shape our future content!",
  options: [
    "JavaScript/TypeScript",
    "Python (Django/Flask)",
    "PHP (Laravel/Symfony)",
    "Ruby (Ruby on Rails)",
    "Go (Gin/Echo)",
  ],
};

export default function PollDetailPage() {
  const { id } = useParams();
  const [selectedOption, setSelectedOption] = useState("");

  const handleVote = () => {
    if (!selectedOption) return;
    console.log(`Voted for: ${selectedOption}`);
    // Dispatch Redux action or API call here
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-white text-[#1A1A1A]">
      <Navbar />
      <section className="px-8 py-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">{dummyPoll.question}</h2>
        <p className="text-[#7E7B7B] mb-8">{dummyPoll.description}</p>

        <h3 className="text-lg font-semibold mb-4">Cast Your Vote</h3>
        <form className="space-y-4 mb-8">
          {dummyPoll.options.map((option) => (
            <label key={option} className="flex items-center gap-3">
              <input
                type="radio"
                name="pollOption"
                value={option}
                checked={selectedOption === option}
                onChange={() => setSelectedOption(option)}
                className="accent-[#34967C]"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </form>

        <button
          onClick={handleVote}
          className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium"
        >
          Submit Vote
        </button>
      </section>
      <Footer />
    </main>
  );
}