"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { v4 as uuidv4 } from "uuid";

const initialPoll = {
  title: "What's your favorite way to learn new skills?",
  description:
    "Help us understand how the community prefers to acquire new knowledge and abilities.",
  options: [
    "Online Courses",
    "Books and Articles",
    "Hands-on Projects",
    "Workshops and Seminars",
    "Mentorship",
  ],
};

export default function EditPollPage() {
  const { id } = useParams();
  const [title, setTitle] = useState(initialPoll.title);
  const [description, setDescription] = useState(initialPoll.description);
  const [options, setOptions] = useState(initialPoll.options);

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleDeleteOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSaveChanges = () => {
    console.log("Updated Poll:", { title, description, options });
    // Dispatch Redux update or API call here
  };

  const handleDeletePoll = () => {
    console.log("Poll deleted:", id);
    // Dispatch Redux delete or API call here
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-white text-[#1A1A1A]">
      <Navbar />
      <section className="px-8 py-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Poll</h2>
        <p className="text-[#7E7B7B] mb-8">
          Update the details and options for your poll.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Poll Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md shadow-sm text-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Poll Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md shadow-sm text-sm"
            rows={4}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Poll Options</label>
          {options.map((opt, index) => (
            <div key={index} className="flex items-center gap-3 mb-3">
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md shadow-sm text-sm"
              />
              <button
                type="button"
                onClick={() => handleDeleteOption(index)}
                className="text-red-500 font-bold text-lg"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddOption}
            className="text-sm text-[#34967C] font-medium mt-2"
          >
            + Add Option
          </button>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSaveChanges}
            className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium"
          >
            Save Changes
          </button>
          <button
            onClick={handleDeletePoll}
            className="border border-red-500 text-red-500 px-6 py-3 rounded-md font-medium"
          >
            Delete Poll
          </button>
        </div>
      </section>
      <Footer />
    </main>
  );
}