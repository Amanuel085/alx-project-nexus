"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function SharePollPage() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const pid = Array.isArray(id) ? id[0] : id;
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const pollLink = `${origin}/polls/${pid}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(pollLink)}`;

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0B0B] text-[#1A1A1A] dark:text-[#EDEDED]">
      <section className="px-8 py-12 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Share Your Poll</h2>
          <button onClick={() => history.back()} className="text-sm text-[#34967C] underline">Back</button>
        </div>

        {/* Poll Link */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Poll Link</label>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={pollLink}
              readOnly
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md shadow-sm text-sm"
            />
        <button
        onClick={() => {
            navigator.clipboard.writeText(pollLink);
            setCopied(true);
        }}
        className="bg-[#34967C] text-white px-4 py-2 rounded-md text-sm font-medium"
        >
        Copy Link
        </button>
          </div>
          {copied && (
            <p className="text-sm text-green-600 mt-2">Link copied!</p>
          )}
        </div>

        {/* Social Media */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Share on Social Media</h3>
          <div className="flex gap-4">
            <button
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pollLink)}`, "_blank")}
              className="bg-[#4267B2] text-white px-4 py-2 rounded-md text-sm"
            >
              Facebook
            </button>
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(pollLink)}&text=${encodeURIComponent('Check out this poll on Pollify!')}`, "_blank")}
              className="bg-black text-white px-4 py-2 rounded-md text-sm"
            >
              X (Twitter)
            </button>
            <button
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pollLink)}`, "_blank")}
              className="bg-[#0077B5] text-white px-4 py-2 rounded-md text-sm"
            >
              LinkedIn
            </button>
            <button
              onClick={() => window.open(`https://www.instagram.com/`, "_blank")}
              className="bg-[#E1306C] text-white px-4 py-2 rounded-md text-sm"
            >
              Instagram
            </button>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
          <img
            src={qrSrc}
            alt="Poll QR Code"
            className="w-64 h-64 rounded-lg border border-[#E5E5E5]"
          />
          <p className="text-sm text-[#7E7B7B] mt-4">
            Scan this QR code to open the poll directly.
          </p>
        </div>
      </section>
    </main>
  );
}