"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type OptionRow = { id: number; text: string; votes_count: number };
type PollRow = { id: number; question: string; description: string | null; options: OptionRow[]; is_active?: boolean };

export default function EditPollPage() {
  const { id } = useParams();
  const router = useRouter();
  const pid = Array.isArray(id) ? id[0] : id;
  const isNumeric = typeof pid === 'string' && /^\d+$/.test(pid);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!pid || !isNumeric) {
        setError('Invalid poll');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/polls/${pid}`);
        let data = await res.json();
        if (!res.ok) {
          const res2 = await fetch(`/api/polls?id=${pid}`);
          const data2 = await res2.json();
          if (!res2.ok) throw new Error(data2.message || "Failed to load poll");
          data = data2;
        }
        const meRes = await fetch('/api/me');
        const meData = await meRes.json().catch(() => ({ user: null }));
        if (!res.ok) throw new Error(data.message || "Failed to load poll");
        const row = data as PollRow;
        const meId = meData?.user?.id ?? null;
        if (!meId || meId !== (data.created_by as number)) {
          router.replace(`/polls/${pid}`);
          return;
        }
        setTitle(row.question);
        setDescription(row.description || "");
        setOptions((row.options || []).map((o) => o.text));
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load poll";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [pid, isNumeric, router]);

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleDeleteOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSaveChanges = async () => {
    if (!pid) return;
    try {
      const res = await fetch(`/api/polls/${pid}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: title, description }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      router.replace(`/polls/${pid}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to update";
      setError(msg);
    }
  };

  const handleDeletePoll = async () => {
    if (!pid) return;
    try {
      const res = await fetch(`/api/polls/${pid}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      router.replace("/polls");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to delete";
      setError(msg);
    }
  };

  const handleClosePoll = async () => {
    if (!pid) return;
    try {
      const res = await fetch(`/api/polls/${pid}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: false }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to close poll");
      router.replace(`/polls/${pid}/results`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to close poll";
      setError(msg);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-white text-[#1A1A1A]">
      <section className="px-8 py-12 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Edit Poll</h2>
          <button onClick={() => history.back()} className="text-sm text-[#34967C] underline">Back</button>
        </div>
        <p className="text-[#7E7B7B] mb-8">
          Update the details and options for your poll.
        </p>

        {loading && <p className="text-[#7E7B7B]">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Poll Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md shadow-sm text-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Poll Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md shadow-sm text-sm"
            rows={4}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Poll Options</label>
          {options.map((opt, index) => (
            <div key={index} className="flex items-center gap-3 mb-3">
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md shadow-sm text-sm"
              />
              <button
                type="button"
                onClick={() => handleDeleteOption(index)}
                className="text-red-500 font-bold text-lg"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddOption}
            className="text-sm text-[#34967C] font-medium mt-2"
          >
            + Add Option
          </button>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSaveChanges}
            className="bg-[#34967C] text-white px-6 py-3 rounded-md font-medium"
          >
            Save Changes
          </button>
          <button
            onClick={handleDeletePoll}
            className="border border-red-500 text-red-500 px-6 py-3 rounded-md font-medium"
          >
            Delete Poll
          </button>
          <button
            onClick={handleClosePoll}
            className="border border-[#34967C] text-[#34967C] px-6 py-3 rounded-md font-medium"
          >
            Close Poll
          </button>
        </div>
      </section>
    </main>
  );
}