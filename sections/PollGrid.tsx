import PollCard from "@/components/PollCard";

export default function PollGrid() {
  const dummyPolls = [
    { id: "1", title: "Best Programming Language", category: "Technology", votes: 120 },
    { id: "2", title: "Favorite Movie of 2025", category: "Entertainment", votes: 85 },
    { id: "3", title: "Should school uniforms be mandatory?", category: "Education", votes: 200 },
    { id: "4", title: "Next President Prediction", category: "Politics", votes: 340 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {dummyPolls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}