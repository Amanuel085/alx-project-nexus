"use client";

import { useState } from "react";

const metrics = [
  { label: "Total Polls", value: 1234, subtext: "Across all categories" },
  { label: "Active Polls", value: 876, subtext: "Currently accepting votes" },
  { label: "Total Votes", value: 56789, subtext: "Submitted this month" },
  { label: "New Users", value: 125, subtext: "Joined in last 30 days" },
];

const polls = [
  {
    id: "1",
    title: "Favorite Ice Cream Flavor",
    category: "Food & Drinks",
    votes: 5123,
    status: "Active",
  },
  {
    id: "2",
    title: "Best Remote Work Tool",
    category: "Technology",
    votes: 3456,
    status: "Active",
  },
  {
    id: "3",
    title: "Next Company Holiday Destination",
    category: "Travel",
    votes: 1890,
    status: "Closed",
  },
  {
    id: "4",
    title: "Preferred Learning Style",
    category: "Education",
    votes: 987,
    status: "Active",
  },
  {
    id: "5",
    title: "Top Book Genres",
    category: "Culture",
    votes: 2567,
    status: "Closed",
  },
];

export default function AdminDashboard() {
  const [pollList, setPollList] = useState(polls);

  const handleDelete = (id: string) => {
    setPollList(pollList.filter((poll) => poll.id !== id));
  };

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#F5F5F5] p-6 hidden md:block">
          <h2 className="text-xl font-bold mb-6">Pollify</h2>
          <nav className="space-y-4 text-sm font-medium">
            <div>Dashboard</div>
            <div>Manage Polls</div>
            <div>Manage Users</div>
            <div>Settings</div>
            <div>Logout</div>
          </nav>
          <div className="mt-12 text-xs text-[#7E7B7B]">Admin User</div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 px-8 py-12">
          <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-2">{metric.label}</h3>
                <p className="text-2xl font-bold text-[#34967C]">
                  {metric.value.toLocaleString()}
                </p>
                <p className="text-xs text-[#7E7B7B] mt-1">{metric.subtext}</p>
              </div>
            ))}
          </div>

          {/* Poll Table */}
          <h2 className="text-xl font-semibold mb-4">Manage Polls</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-[#E5E5E5]">
              <thead className="bg-[#F5F5F5]">
                <tr>
                  <th className="text-left p-3">Title</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Total Votes</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pollList.map((poll) => (
                  <tr key={poll.id} className="border-t">
                    <td className="p-3">{poll.title}</td>
                    <td className="p-3">{poll.category}</td>
                    <td className="p-3">{poll.votes.toLocaleString()}</td>
                    <td className="p-3">{poll.status}</td>
                    <td className="p-3 space-x-2">
                      <button className="text-[#34967C] font-medium">Edit</button>
                      <button
                        className="text-red-500 font-medium"
                        onClick={() => handleDelete(poll.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}