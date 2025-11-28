"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { useState } from "react";

const notifications = [
  {
    id: "1",
    type: "Poll Update",
    title: "New votes on your poll",
    message: "Your poll 'Best Programming Language' received 25 new votes.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "System Alert",
    title: "Scheduled Maintenance",
    message: "Pollify will undergo maintenance on Dec 1 from 2AM to 4AM UTC.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "3",
    type: "Message",
    title: "New comment on your poll",
    message: "Sophia commented on 'Weekend Activity Preference'.",
    time: "3 days ago",
    read: false,
  },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState("All");

  const filtered = notifications.filter((n) =>
    filter === "All" ? true : n.type === filter
  );

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A]">
      <Navbar />
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Notifications Center</h2>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 text-sm font-medium">
          {["All", "Poll Update", "System Alert", "Message"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-md ${
                filter === tab
                  ? "bg-[#34967C] text-white"
                  : "bg-[#F5F5F5] text-[#1A1A1A]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notification Cards */}
        <ul className="space-y-4">
          {filtered.map((n) => (
            <li
              key={n.id}
              className={`border border-[#E5E5E5] rounded-md p-4 shadow-sm ${
                n.read ? "bg-white" : "bg-[#F0FAF7]"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{n.title}</h3>
                <span className="text-xs text-[#7E7B7B]">{n.time}</span>
              </div>
              <p className="text-sm text-[#7E7B7B]">{n.message}</p>
            </li>
          ))}
        </ul>
      </section>
      <Footer />
    </main>
  );
}