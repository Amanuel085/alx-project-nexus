"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function PollAnalyticsPage() {
  const { id } = useParams();
  const pid = Array.isArray(id) ? id[0] : id;
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [optionVotes, setOptionVotes] = useState<{ text: string; votes_count: number }[]>([]);
  const [daily, setDaily] = useState<{ day: string; cnt: number }[]>([]);
  const [recent, setRecent] = useState<{ id: number; participant: string | null; option: string; created_at: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!pid) return;
      try {
        const res = await fetch(`/api/polls/${pid}/analytics`);
        let data = await res.json();
        if (!res.ok) {
          const res2 = await fetch(`/api/polls/analytics?id=${pid}`);
          const data2 = await res2.json();
          if (!res2.ok) throw new Error(data2.message || "Failed to load analytics");
          data = data2;
        }
        setTotalVotes(data.totalVotes || 0);
        setOptionVotes(data.optionVotes || []);
        setDaily(data.daily || []);
        setRecent(data.recent || []);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load analytics";
        setError(msg);
      }
    })();
  }, [pid]);

  const lineData = {
    labels: daily.map((d) => d.day),
    datasets: [
      {
        label: "Votes",
        data: daily.map((d) => d.cnt),
        borderColor: "#34967C",
        backgroundColor: "rgba(52, 150, 124, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const donutData = {
    labels: optionVotes.map((o) => o.text),
    datasets: [
      {
        data: optionVotes.map((o) => o.votes_count),
        backgroundColor: ["#34967C", "#7E7B7B", "#E5E5E5", "#A3A3A3", "#D1D5DB"],
      },
    ],
  };

  const barData = {
    labels: optionVotes.map((o) => o.text),
    datasets: [
      {
        label: "Votes",
        data: optionVotes.map((o) => o.votes_count),
        backgroundColor: "#34967C",
        borderRadius: 6,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0B0B] text-[#1A1A1A] dark:text-[#EDEDED]">
      <section className="px-8 py-12 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Poll Analytics</h2>
          <button onClick={() => history.back()} className="text-sm text-[#34967C] underline">Back</button>
        </div>
        {error && <p className="text-red-600 mb-6">{error}</p>}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <input type="text" placeholder="Date Range: Last 30 Days" className="px-4 py-3 border rounded-md text-sm" />
          <input type="text" placeholder="Poll Version: Latest" className="px-4 py-3 border rounded-md text-sm" />
          <input type="text" placeholder="Demographic: Age 25–34, USA" className="px-4 py-3 border rounded-md text-sm" />
        </div>
        <button className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium mb-12">
          Apply Filters
        </button>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Total Votes</h3>
            <p className="text-2xl font-bold text-[#34967C]">{totalVotes.toLocaleString()}</p>
            <p className="text-xs text-[#7E7B7B] mt-1">Responses collected since poll creation</p>
          </div>
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Options Count</h3>
            <p className="text-2xl font-bold text-[#34967C]">{optionVotes.length}</p>
          </div>
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Days Tracked</h3>
            <p className="text-2xl font-bold text-[#34967C]">{daily.length}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-lg font-semibold mb-4">Total Votes Over Time</h3>
            <Line data={lineData} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Votes by Option</h3>
            <Doughnut data={donutData} />
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Option Popularity</h3>
          <Bar data={barData} />
        </div>

        {/* Recent Responses Table */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Responses</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-[#E5E5E5]">
              <thead className="bg-[#F5F5F5]">
                <tr>
                  <th className="text-left p-3">Response ID</th>
                  <th className="text-left p-3">Participant</th>
                  <th className="text-left p-3">Option Selected</th>
                  <th className="text-left p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">{r.id}</td>
                    <td className="p-3">{r.participant || "Anonymous"}</td>
                    <td className="p-3">{r.option}</td>
                    <td className="p-3">{r.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}