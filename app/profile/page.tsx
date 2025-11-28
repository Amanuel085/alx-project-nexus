"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import Image from "next/image";
import Link from "next/link";

const user = {
  name: "Sophia Williams",
  email: "sophia.williams@example.com",
  avatar: "/avatar.png", // Replace with actual image
};

const createdPolls = [
  { id: "1", title: "Favorite Coffee Type", category: "Food & Drink", votes: 120 },
  { id: "2", title: "Next Vacation Destination", category: "Travel", votes: 85 },
  { id: "3", title: "Best Programming Language", category: "Technology", votes: 210 },
  { id: "4", title: "Weekend Activity Preference", category: "Lifestyle", votes: 95 },
];

const votedPolls = [
  { id: "5", title: "Favorite Genre of Music", category: "Entertainment", votes: 150 },
  { id: "6", title: "Preferred Learning Style", category: "Education", votes: 70 },
  { id: "7", title: "Top Social Media Platform", category: "Technology", votes: 180 },
];

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-white text-[#1A1A1A]">
      <Navbar />
      <section className="px-8 py-12 max-w-4xl mx-auto">
        {/* User Info */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-[#7E7B7B]">{user.email}</p>
            </div>
          </div>
          <button className="bg-[#34967C] text-white px-4 py-2 rounded-md text-sm font-medium">
            Edit Profile
          </button>
        </div>

        {/* Polls Created */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Polls You've Created</h3>
          <ul className="space-y-4">
            {createdPolls.map((poll) => (
              <li
                key={poll.id}
                className="border border-[#E5E5E5] rounded-md p-4 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium">{poll.title}</h4>
                  <p className="text-sm text-[#7E7B7B]">
                    {poll.category} – {poll.votes} Votes
                  </p>
                </div>
                <Link
                  href={`/polls/${poll.id}`}
                  className="text-sm text-white bg-[#34967C] px-4 py-2 rounded-md"
                >
                  View Poll
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Polls Voted On */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Polls You've Voted On</h3>
          <ul className="space-y-4">
            {votedPolls.map((poll) => (
              <li
                key={poll.id}
                className="border border-[#E5E5E5] rounded-md p-4 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium">{poll.title}</h4>
                  <p className="text-sm text-[#7E7B7B]">
                    {poll.category} – {poll.votes} Votes
                  </p>
                </div>
                <Link
                  href={`/polls/${poll.id}`}
                  className="text-sm text-white bg-[#34967C] px-4 py-2 rounded-md"
                >
                  View Poll
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </main>
  );
}