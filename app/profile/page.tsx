"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Me = { id: number; name: string; email: string; role: "admin" | "user" } | null;
type RowPoll = { id: number; question: string; description: string | null; image_path: string | null; created_at: string; total_votes: number; category: string | null };

export default function ProfilePage() {
  const [me, setMe] = useState<Me>(null);
  const [created, setCreated] = useState<RowPoll[]>([]);
  const [voted, setVoted] = useState<RowPoll[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setStatus("loading");
      try {
        const meRes = await fetch("/api/me");
        const meJson = await meRes.json();
        if (!meJson?.user) {
          setMe(null);
          setStatus("idle");
          return;
        }
        setMe(meJson.user as Me);
        const res = await fetch("/api/user/polls");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        setCreated(data.created || []);
        setVoted(data.voted || []);
        setStatus("idle");
      } catch (e) {
        setStatus("error");
        setError(e instanceof Error ? e.message : "Failed to load");
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0B0B] text-[#1A1A1A] dark:text-[#EDEDED]">
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Image
              src="/avatar.png"
              alt="User Avatar"
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">{me ? me.name : "Guest"}</h2>
              <p className="text-sm text-[#7E7B7B]">{me ? me.email : "Not signed in"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => history.back()} className="text-sm text-[#34967C] underline">Back</button>
            <Link href={me ? "/settings" : "/login"} className="bg-[#34967C] text-white px-4 py-2 rounded-md text-sm font-medium">
              {me ? "Edit Profile" : "Sign In"}
            </Link>
          </div>
        </div>

        {status === "loading" && <p className="text-[#7E7B7B]">Loading...</p>}
        {status === "error" && <p className="text-red-600">{error}</p>}

        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Polls You&apos;ve Created</h3>
          {created.length === 0 ? (
            <p className="text-sm text-[#7E7B7B]">No polls yet.</p>
          ) : (
            <ul className="space-y-4">
              {created.map((poll) => (
                <li key={poll.id} className="border border-[#E5E5E5] rounded-md p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{poll.question}</h4>
                    <p className="text-sm text-[#7E7B7B]">{poll.category || "General"} – {poll.total_votes} Votes</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/polls/${poll.id}`} className="text-sm text-white bg-[#34967C] px-4 py-2 rounded-md">View</Link>
                    <Link href={`/polls/${poll.id}/edit`} className="text-sm border border-[#34967C] text-[#34967C] px-4 py-2 rounded-md">Edit</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Polls You&apos;ve Voted On</h3>
          {voted.length === 0 ? (
            <p className="text-sm text-[#7E7B7B]">No votes yet.</p>
          ) : (
            <ul className="space-y-4">
              {voted.map((poll) => (
                <li key={poll.id} className="border border-[#E5E5E5] rounded-md p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{poll.question}</h4>
                    <p className="text-sm text-[#7E7B7B]">{poll.category || "General"} – {poll.total_votes} Votes</p>
                  </div>
                  <Link href={`/polls/${poll.id}`} className="text-sm text-white bg-[#34967C] px-4 py-2 rounded-md">View</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}