"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { v4 as uuidv4 } from "uuid";

export default function CreatePollPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleCreatePoll = () => {
    if (!title || !description || options.some((opt) => !opt.trim())) return;
    const newPoll = {
      id: uuidv4(),
      question: title,
      description,
      options: options.map((text) => ({ id: uuidv4(), text, votes: 0 })),
    };
    console.log("Poll created:", newPoll);
    // Dispatch Redux action or save to local JSON here
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-white text-[#1A1A1A]">
      <Navbar />
      <section className="px-8 py-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Create New Poll</h2>
        <p className="text-[#7E7B7B] mb-8">
          Fill out the details below to launch your new poll.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Poll Title</label>
          <input
            type="text"
            placeholder="e.g., Favorite programming language"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md shadow-sm text-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Poll Description</label>
          <textarea
            placeholder="Provide a brief description for your poll..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md shadow-sm text-sm"
            rows={4}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Poll Options</label>
          {options.map((opt, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="w-full mb-3 px-4 py-3 border border-[#E5E5E5] rounded-md shadow-sm text-sm"
            />
          ))}
          <button
            type="button"
            onClick={handleAddOption}
            className="text-sm text-[#34967C] font-medium mt-2"
          >
            + Add Option
          </button>
        </div>

        <button
          onClick={handleCreatePoll}
          className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium"
        >
          Create Poll
        </button>
      </section>
      <Footer />
    </main>
  );
}