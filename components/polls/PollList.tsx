import Link from 'next/link';
import { Poll } from '@/lib/features/poll/pollSlice';

interface PollListProps {
  polls: Poll[];
}

export default function PollList({ polls }: PollListProps) {
  if (polls.length === 0) {
    return <div className="text-gray-500">No polls available. Create one to get started!</div>;
  }

  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <Link
          key={poll.id}
          href={`/polls/${poll.id}`}
          className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          {poll.imagePath && (
            <img src={poll.imagePath} alt="Poll" className="w-full h-40 object-cover rounded-md mb-3" />
          )}
          <h3 className="text-xl font-semibold mb-2">{poll.question}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <span className="capitalize">{poll.category}</span>
            <span className="mx-2">•</span>
            <span>{poll.totalVotes} votes</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
