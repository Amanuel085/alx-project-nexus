"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Option = { id: number; text: string; votes_count: number };
type PollData = { id: number; question: string; options: Option[] };

export default function PollResultsPage() {
  const { id } = useParams();
  const pid = Array.isArray(id) ? id[0] : id;
  const [poll, setPoll] = useState<PollData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!pid) return;
      try {
        const res = await fetch(`/api/polls/${pid}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load results");
        setPoll({ id: data.id, question: data.question, options: data.options || [] });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load results";
        setError(msg);
      }
    })();
  }, [pid]);

  if (error) {
    return <div className="px-8 py-12">{error}</div>;
  }

  if (!poll) {
    return <div className="px-8 py-12">Loading...</div>;
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes_count || 0), 0);
  const chartData = {
    labels: poll.options.map((opt) => opt.text),
    datasets: [
      {
        label: "Votes",
        data: poll.options.map((opt) => opt.votes_count),
        backgroundColor: "#34967C",
        borderRadius: 6,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-white dark:bg-[#0B0B0B] text-[#1A1A1A] dark:text-[#EDEDED]">
      <section className="px-8 py-12 max-w-3xl mx-auto">
        <div className="flex items-center justify-end mb-4">
          <button onClick={() => history.back()} className="text-sm text-[#34967C] underline">Back</button>
        </div>
        <h2 className="text-2xl font-bold mb-4">{poll.question}</h2>
        <h3 className="text-lg font-semibold mb-6">Vote Distribution</h3>

        <div className="mb-8">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <ul className="mb-8 space-y-3">
          {poll.options.map((opt) => {
            const percent = totalVotes ? ((opt.votes_count / totalVotes) * 100).toFixed(1) : "0.0";
            const isWinner = opt.votes_count === Math.max(...poll.options.map((o) => o.votes_count));
            return (
              <li key={opt.id} className="text-sm">
                <span className="font-medium">{opt.text}</span>: {percent}% ({opt.votes_count} votes)
                {isWinner && <span className="ml-2 text-[#34967C] font-semibold">– Winner</span>}
              </li>
            );
          })}
        </ul>

        <div className="flex gap-4">
          <Link href={`/polls/${pid}/share`} className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium">Share Poll</Link>
          <Link href="/polls" className="border border-[#34967C] text-[#34967C] px-6 py-3 rounded-md font-medium">Back to Polls</Link>
        </div>
      </section>
    </main>
  );
}