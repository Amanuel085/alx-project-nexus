"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Option = { id: number; text: string; votes_count: number };
type PollData = { id: number; question: string; description: string | null; image_path: string | null; options: Option[]; created_by: number; is_active?: boolean };

export default function PollDetailPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState<PollData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const pid = Array.isArray(id) ? id[0] : id;
  const isNumeric = typeof pid === "string" && /^\d+$/.test(pid);

  useEffect(() => {
    if (!pid || !isNumeric) {
      if (pid) setError("Invalid poll");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/polls?id=${pid}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load poll");
        setPoll(data);
        try {
          const meRes = await fetch("/api/me");
          const meData = await meRes.json();
          setUserId(meData?.user?.id ?? null);
        } catch {}
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load poll";
        setError(msg);
      }
    })();
  }, [pid, isNumeric]);

  const handleVote = async () => {
    if (!selectedOption || !pid || !isNumeric) return;
    try {
      const res = await fetch(`/api/polls/${pid}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: selectedOption }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to vote");
      const refreshed = await (await fetch(`/api/polls/${pid}`)).json();
      setPoll(refreshed);
      setSelectedOption("");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to vote";
      setError(msg);
    }
  };

  if (error) {
    return <div className="px-8 py-12">{error}</div>;
  }

  if (!poll) {
    return <div className="px-8 py-12">Loading...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col justify-between bg-white text-[#1A1A1A]">
      <section className="px-8 py-12 max-w-3xl mx-auto">
        {poll.image_path && (
          <img src={poll.image_path} alt="Poll" className="w-full h-64 object-cover rounded-md mb-6" />
        )}
        <h2 className="text-2xl font-bold mb-4">{poll.question}</h2>
        {poll.description && <p className="text-[#7E7B7B] mb-8">{poll.description}</p>}

        <h3 className="text-lg font-semibold mb-4">Cast Your Vote</h3>
        <form className="space-y-4 mb-8">
          {poll.options.map((option) => (
            <label key={option.id} className="flex items-center gap-3">
              <input
                type="radio"
                name="pollOption"
                value={String(option.id)}
                checked={selectedOption === String(option.id)}
                onChange={() => setSelectedOption(String(option.id))}
                className="accent-[#34967C]"
              />
              <span className="text-sm">{option.text}</span>
            </label>
          ))}
        </form>

        <button
          onClick={handleVote}
          className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium"
        >
          Submit Vote
        </button>

        {userId && poll.created_by === userId && (
          <div className="mt-8 flex gap-3">
            <Link href={`/polls/${pid}/edit`} className="border border-[#34967C] text-[#34967C] px-4 py-2 rounded-md text-sm">Edit</Link>
            <button
              onClick={async () => {
                try {
                  const res = await fetch(`/api/polls/${pid}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: false }) });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message || "Failed to close");
                  window.location.href = `/polls/${pid}/results`;
                } catch (e) {
                  const msg = e instanceof Error ? e.message : "Failed to close";
                  setError(msg);
                }
              }}
              className="border border-[#34967C] text-[#34967C] px-4 py-2 rounded-md text-sm"
            >
              Close Poll
            </button>
            <button
              onClick={async () => {
                try {
                  const res = await fetch(`/api/polls/${pid}`, { method: "DELETE" });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message || "Failed to delete");
                  window.location.href = "/polls";
                } catch (e) {
                  const msg = e instanceof Error ? e.message : "Failed to delete";
                  setError(msg);
                }
              }}
              className="border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm"
            >
              Delete Poll
            </button>
            <Link href={`/polls/${pid}/share`} className="border border-[#34967C] text-[#34967C] px-4 py-2 rounded-md text-sm">Share</Link>
            <Link href={`/polls/${pid}/analytics`} className="border border-[#34967C] text-[#34967C] px-4 py-2 rounded-md text-sm">Analytics</Link>
          </div>
        )}

        {poll.is_active === false && (
          <div className="mt-6">
            <Link href={`/polls/${pid}/results`} className="text-sm text-white bg-[#34967C] px-4 py-2 rounded-md">View Results</Link>
          </div>
        )}
      </section>
    </main>
  );
}