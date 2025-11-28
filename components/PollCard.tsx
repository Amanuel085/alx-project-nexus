import Link from "next/link";

interface Poll {
  id: string;
  title: string;
  category: string;
  votes: number;
}

export default function PollCard({ poll }: { poll: Poll }) {
  return (
    <div className="border border-[#E5E5E5] rounded-lg p-6 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold mb-2">{poll.title}</h3>
      <p className="text-sm text-[#7E7B7B] mb-4">Category: {poll.category}</p>
      <p className="text-sm text-[#34967C] font-medium mb-4">{poll.votes} votes</p>
      <Link
        href={`/polls/${poll.id}`}
        className="text-sm text-white bg-[#34967C] px-4 py-2 rounded-md inline-block"
      >
        View Poll
      </Link>
    </div>
  );
}