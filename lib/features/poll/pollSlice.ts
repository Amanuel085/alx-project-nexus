import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

// Types
export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  category: string;
  createdAt: string;
  createdBy: string;
  isActive: boolean;
  totalVotes: number;
}

interface PollState {
  polls: Poll[];
  currentPoll: Poll | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filter: {
    category: string;
    searchQuery: string;
  };
}

// Initial State
const initialState: PollState = {
  polls: [],
  currentPoll: null,
  status: 'idle',
  error: null,
  filter: {
    category: 'all',
    searchQuery: '',
  },
};

// Thunks
export const fetchPolls = createAsyncThunk<Poll[], void, { state: RootState }>(
  'polls/fetchPolls',
  async () => {
    const response = await fetch('/api/polls');
    if (!response.ok) {
      throw new Error('Failed to fetch polls');
    }
    return (await response.json()) as Poll[];
  }
);

export const fetchPollById = createAsyncThunk<Poll, string, { state: RootState }>(
  'polls/fetchPollById',
  async (pollId: string) => {
    const response = await fetch(`/api/polls/${pollId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch poll');
    }
    return (await response.json()) as Poll;
  }
);

export const createPoll = createAsyncThunk<
  Poll,
  Omit<Poll, 'id' | 'createdAt' | 'totalVotes' | 'isActive'>,
  { state: RootState }
>('polls/createPoll', async (pollData) => {
  const response = await fetch('/api/polls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pollData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create poll');
  }
  
  return (await response.json()) as Poll;
});

export const voteOnPoll = createAsyncThunk<
  Poll,
  { pollId: string; optionId: string },
  { state: RootState }
>('polls/voteOnPoll', async ({ pollId, optionId }, { getState }) => {
  const { poll } = getState();
  const existingPoll = poll.polls.find((p: Poll) => p.id === pollId) || poll.currentPoll;
  
  if (!existingPoll) {
    throw new Error('Poll not found');
  }

  const response = await fetch(`/api/polls/${pollId}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ optionId }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit vote');
  }
  
  return (await response.json()) as Poll;
});

// Slice
const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setFilterCategory: (state, action: PayloadAction<string>) => {
      state.filter.category = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filter.searchQuery = action.payload;
    },
    resetCurrentPoll: (state) => {
      state.currentPoll = null;
    },
    clearPollError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Polls
      .addCase(fetchPolls.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.polls = action.payload;
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch polls';
      })
      
      // Fetch Single Poll
      .addCase(fetchPollById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPollById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPoll = action.payload;
      })
      .addCase(fetchPollById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch poll';
      })
      
      // Create Poll
      .addCase(createPoll.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.polls.unshift(action.payload);
      })
      .addCase(createPoll.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create poll';
      })
      
      // Vote on Poll
      .addCase(voteOnPoll.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(voteOnPoll.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload;
        
        // Update in polls array
        const pollIndex = state.polls.findIndex(poll => poll.id === id);
        if (pollIndex !== -1) {
          state.polls[pollIndex] = action.payload;
        }
        
        // Update current poll if it's the one being voted on
        if (state.currentPoll?.id === id) {
          state.currentPoll = action.payload;
        }
      })
      .addCase(voteOnPoll.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to submit vote';
      });
  },
});

// Actions
export const { 
  setFilterCategory, 
  setSearchQuery, 
  resetCurrentPoll, 
  clearPollError 
} = pollSlice.actions;

// Selectors
export const selectAllPolls = (state: RootState) => state.poll.polls;
export const selectCurrentPoll = (state: RootState) => state.poll.currentPoll;
export const selectPollStatus = (state: RootState) => state.poll.status;
export const selectPollError = (state: RootState) => state.poll.error;
export const selectPollFilter = (state: RootState) => state.poll.filter;

export const selectFilteredPolls = createSelector(
  [selectAllPolls, selectPollFilter],
  (polls, filter) => {
    return polls.filter(poll => {
      const matchesCategory = 
        filter.category === 'all' || 
        poll.category.toLowerCase() === filter.category.toLowerCase();
      
      const matchesSearch = 
        filter.searchQuery === '' ||
        poll.question.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
        poll.options.some(option => 
          option.text.toLowerCase().includes(filter.searchQuery.toLowerCase())
        );
      
      return matchesCategory && matchesSearch;
    });
  }
);

export const selectPollsByCategory = createSelector(
  [selectAllPolls, (_, category: string) => category],
  (polls, category) => {
    return polls.filter(poll => 
      category === 'all' ? true : poll.category.toLowerCase() === category.toLowerCase()
    );
  }
);

export const selectPollsByUser = createSelector(
  [selectAllPolls, (_, userId: string) => userId],
  (polls, userId) => {
    return polls.filter(poll => poll.createdBy === userId);
  }
);

export default pollSlice.reducer;
