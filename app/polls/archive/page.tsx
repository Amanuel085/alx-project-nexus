"use client";

import Link from "next/link";
import { useState } from "react";

const archivedPolls = [
  {
    id: "1",
    title: "Best Remote Work Tool",
    category: "Technology",
    votes: 3456,
    status: "Closed",
    archivedAt: "2025-10-15",
  },
  {
    id: "2",
    title: "Next Company Holiday Destination",
    category: "Travel",
    votes: 1890,
    status: "Closed",
    archivedAt: "2025-09-30",
  },
  {
    id: "3",
    title: "Top Book Genres",
    category: "Culture",
    votes: 2567,
    status: "Closed",
    archivedAt: "2025-08-20",
  },
];

export default function PollArchivePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = archivedPolls.filter(
    (poll) =>
      poll.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || poll.category === filter)
  );

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A]">
      <section className="px-8 py-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Poll Archive</h2>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search archived polls..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 border border-[#E5E5E5] rounded-md shadow-sm text-sm"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 border border-[#E5E5E5] rounded-md shadow-sm text-sm"
          >
            <option>All</option>
            <option>Technology</option>
            <option>Travel</option>
            <option>Culture</option>
          </select>
        </div>

        {/* Archive List */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-[#E5E5E5]">
            <thead className="bg-[#F5F5F5]">
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Votes</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Archived At</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((poll) => (
                <tr key={poll.id} className="border-t">
                  <td className="p-3">{poll.title}</td>
                  <td className="p-3">{poll.category}</td>
                  <td className="p-3">{poll.votes.toLocaleString()}</td>
                  <td className="p-3">{poll.status}</td>
                  <td className="p-3">{poll.archivedAt}</td>
                  <td className="p-3 space-x-2">
                    <Link
                      href={`/polls/${poll.id}`}
                      className="text-[#34967C] font-medium"
                    >
                      View
                    </Link>
                    <button className="text-blue-500 font-medium">Restore</button>
                    <button className="text-red-500 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-[#7E7B7B] mt-4">
          Showing {filtered.length} of {archivedPolls.length} archived polls
        </p>
      </section>
    </main>
  );
}