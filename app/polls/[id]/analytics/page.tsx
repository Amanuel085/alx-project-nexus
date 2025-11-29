"use client";

import {
  Line,
  Doughnut,
  Bar,
} from "react-chartjs-2";
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
  const summary = {
    totalVotes: 1350,
    avgResponseTime: "1 min 23 sec",
    completionRate: "85.7%",
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Votes",
        data: [50, 100, 200, 300, 400, 500, 600, 700, 800, 950, 1100, 1350],
        borderColor: "#34967C",
        backgroundColor: "rgba(52, 150, 124, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const donutData = {
    labels: ["Mobile", "Desktop", "Tablet"],
    datasets: [
      {
        data: [600, 500, 250],
        backgroundColor: ["#34967C", "#7E7B7B", "#E5E5E5"],
      },
    ],
  };

  const barData = {
    labels: ["Option A", "Option B", "Option C", "Option D", "Option E"],
    datasets: [
      {
        label: "Votes",
        data: [465, 620, 390, 310, 235],
        backgroundColor: "#34967C",
        borderRadius: 6,
      },
    ],
  };

  const responses = [
    { id: "R1001", name: "Alice J.", option: "Option B", device: "Mobile", time: "2023-11-20 14:30" },
    { id: "R1002", name: "Bob K.", option: "Option B", device: "Desktop", time: "2023-11-20 14:25" },
    { id: "R1003", name: "Charlie L.", option: "Option A", device: "Tablet", time: "2023-11-20 14:20" },
    { id: "R1004", name: "Dana M.", option: "Option C", device: "Desktop", time: "2023-11-20 14:15" },
    { id: "R1005", name: "Eve N.", option: "Option B", device: "Mobile", time: "2023-11-20 14:10" },
  ];

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A]">
      <section className="px-8 py-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Poll Analytics</h2>

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
            <p className="text-2xl font-bold text-[#34967C]">{summary.totalVotes.toLocaleString()}</p>
            <p className="text-xs text-[#7E7B7B] mt-1">Responses collected since poll creation</p>
          </div>
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Avg. Response Time</h3>
            <p className="text-2xl font-bold text-[#34967C]">{summary.avgResponseTime}</p>
          </div>
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
            <p className="text-2xl font-bold text-[#34967C]">{summary.completionRate}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-lg font-semibold mb-4">Total Votes Over Time</h3>
            <Line data={lineData} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
            <Doughnut data={donutData} />
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Option Popularity Trends</h3>
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
                  <th className="text-left p-3">Device</th>
                  <th className="text-left p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">{r.id}</td>
                    <td className="p-3">{r.name}</td>
                    <td className="p-3">{r.option}</td>
                    <td className="p-3">{r.device}</td>
                    <td className="p-3">{r.time}</td>
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