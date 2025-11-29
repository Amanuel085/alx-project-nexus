'use client';

import { useEffect } from 'react';
import { usePollOperations } from '@/hooks/usePollOperations';
import PollList from '@/components/polls/PollList';
import CreatePollForm from '@/components/polls/CreatePollForm';

export default function PollsPage() {
  const { polls, status, error, getPolls, addPoll, setSearchQuery, setFilterCategory } = usePollOperations();

  useEffect(() => {
    // Fetch polls when the component mounts
    getPolls();
  }, [getPolls]);

  const handleCreatePoll = async (pollData: {
    question: string;
    options: string[];
    category: string;
  }) => {
    try {
      await addPoll({
        ...pollData,
        createdBy: 'current-user-id', // This should come from your auth context
      });
    } catch (err) {
      console.error('Error creating poll:', err);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value);
  };

  if (status === 'loading' && polls.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Polls</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search polls..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleSearch}
            />
            <select 
              className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleCategoryChange}
            >
              <option value="all">All Categories</option>
              <option value="technology">Technology</option>
              <option value="politics">Politics</option>
              <option value="entertainment">Entertainment</option>
              <option value="sports">Sports</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">Latest Polls</h2>
          <PollList polls={polls} />
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Create New Poll</h2>
            <CreatePollForm onSubmit={handleCreatePoll} />
          </div>
        </div>
      </div>
    </div>
  );
}