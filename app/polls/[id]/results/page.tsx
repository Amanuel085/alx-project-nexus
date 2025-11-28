"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import Link from "next/link";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const pollResults = {
  question: "What is your favorite programming language for web development?",
  options: [
    { label: "JavaScript/TypeScript", votes: 425 },
    { label: "Python (Django/Flask)", votes: 212 },
    { label: "PHP (Laravel/Symfony)", votes: 127 },
    { label: "Go (Gin/Echo)", votes: 85 },
  ],
};

const totalVotes = pollResults.options.reduce((sum, opt) => sum + opt.votes, 0);

const chartData = {
  labels: pollResults.options.map((opt) => opt.label),
  datasets: [
    {
      label: "Votes",
      data: pollResults.options.map((opt) => opt.votes),
      backgroundColor: "#34967C",
      borderRadius: 6,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 50 },
    },
  },
};

export default function PollResultsPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-white text-[#1A1A1A]">
      <Navbar />
      <section className="px-8 py-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">{pollResults.question}</h2>
        <h3 className="text-lg font-semibold mb-6">Vote Distribution</h3>

        <div className="mb-8">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <ul className="mb-8 space-y-3">
          {pollResults.options.map((opt) => {
            const percent = ((opt.votes / totalVotes) * 100).toFixed(1);
            const isWinner = opt.votes === Math.max(...pollResults.options.map((o) => o.votes));
            return (
              <li key={opt.label} className="text-sm">
                <span className="font-medium">{opt.label}</span>: {percent}% ({opt.votes} votes)
                {isWinner && <span className="ml-2 text-[#34967C] font-semibold">– Winner</span>}
              </li>
            );
          })}
        </ul>

        <div className="flex gap-4">
          <button className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium">
            Share Poll
          </button>
          <Link
            href="/polls"
            className="border border-[#34967C] text-[#34967C] px-6 py-3 rounded-md font-medium"
          >
            Back to Polls
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}