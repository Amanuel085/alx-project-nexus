"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Metric = { label: string; value: number; subtext: string };
type AdminPoll = { id: number; question: string; category: string | null; total_votes: number; is_active: number };

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([ 
    { label: "Total Polls", value: 0, subtext: "Across all categories" },
    { label: "Active Polls", value: 0, subtext: "Currently accepting votes" },
    { label: "Total Votes", value: 0, subtext: "Submitted this month" },
    { label: "New Users", value: 0, subtext: "Joined in last 30 days" },
  ]);
  const [pollList, setPollList] = useState<AdminPoll[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const statsRes = await fetch("/api/admin/stats");
        const stats = await statsRes.json();
        if (statsRes.ok) {
          setMetrics([
            { label: "Total Polls", value: stats.totalPolls ?? 0, subtext: "Across all categories" },
            { label: "Active Polls", value: stats.activePolls ?? 0, subtext: "Currently accepting votes" },
            { label: "Total Votes", value: stats.totalVotes ?? 0, subtext: "Submitted this month" },
            { label: "New Users", value: stats.newUsers ?? 0, subtext: "Joined in last 30 days" },
          ]);
        }
      } catch {}

      try {
        const pollsRes = await fetch("/api/admin/polls");
        const rows = await pollsRes.json();
        if (pollsRes.ok) {
          setPollList(rows.slice(0, 5));
        }
      } catch {}
    })();
  }, []);

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#F5F5F5] p-6 hidden md:block">
          <h2 className="text-xl font-bold mb-6">Pollify</h2>
          <nav className="space-y-4 text-sm font-medium">
            <a href="/admin" className="text-[#1A1A1A]">Dashboard</a>
            <a href="/admin/polls" className="text-[#34967C]">Manage Polls</a>
            <a href="/admin/users" className="text-[#34967C]">Manage Users</a>
            <a href="/admin/categories" className="text-[#34967C]">Manage Categories</a>
            <div>Settings</div>
            <div>Logout</div>
          </nav>
          <div className="mt-12 text-xs text-[#7E7B7B]">Admin User</div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-4 text-sm font-medium">
              <a href="/admin/polls" className="text-[#34967C]">Manage Polls</a>
              <a href="/admin/users" className="text-[#34967C]">Manage Users</a>
              <a href="/admin/categories" className="text-[#34967C]">Manage Categories</a>
            </div>
          </div>

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
                    <td className="p-3">{poll.question}</td>
                    <td className="p-3">{poll.category || '-'}</td>
                    <td className="p-3">{Number(poll.total_votes || 0).toLocaleString()}</td>
                    <td className="p-3">{poll.is_active === 1 ? 'Active' : 'Inactive'}</td>
                    <td className="p-3 space-x-2">
                      <Link href={`/admin/polls`} className="text-[#34967C] font-medium">Edit</Link>
                      <Link href={`/admin/polls`} className="text-red-500 font-medium">Delete</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <Link href="/admin/polls" className="text-[#34967C] font-medium">See more</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}