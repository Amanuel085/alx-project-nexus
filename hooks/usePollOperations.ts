import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import {
  fetchPolls,
  fetchPollById,
  createPoll as createPollAction,
  voteOnPoll,
  selectPollStatus,
  selectCurrentPoll,
  selectFilteredPolls,
  selectPollError,
  clearPollError,
} from '@/lib/features/poll/pollSlice';

export const usePollOperations = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectPollStatus);
  const error = useAppSelector(selectPollError);
  const currentPoll = useAppSelector(selectCurrentPoll);
  const polls = useAppSelector(selectFilteredPolls);

  const getPolls = useCallback(async () => {
    try {
      await dispatch(fetchPolls()).unwrap();
    } catch (err) {
      console.error('Failed to fetch polls:', err);
      throw err;
    }
  }, [dispatch]);

  const getPollById = useCallback(
    async (id: string) => {
      try {
        await dispatch(fetchPollById(id)).unwrap();
      } catch (err) {
        console.error(`Failed to fetch poll ${id}:`, err);
        throw err;
      }
    },
    [dispatch]
  );

  const addPoll = useCallback(
    async (pollData: { question: string; options: string[]; category: string; createdBy: string }) => {
      try {
        const newPoll = {
          question: pollData.question,
          category: pollData.category,
          createdBy: pollData.createdBy,
          options: pollData.options.map((text, index) => ({
            id: `option-${index}`,
            text,
            votes: 0,
          })),
        };
        const result = await dispatch(createPollAction(newPoll)).unwrap();
        return result;
      } catch (err) {
        console.error('Failed to create poll:', err);
        throw err;
      }
    },
    [dispatch]
  );

  const vote = useCallback(
    async (pollId: string, optionId: string) => {
      try {
        await dispatch(voteOnPoll({ pollId, optionId })).unwrap();
      } catch (err) {
        console.error('Failed to submit vote:', err);
        throw err;
      }
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearPollError());
  }, [dispatch]);

  return {
    polls,
    currentPoll,
    status,
    error,
    getPolls,
    getPollById,
    addPoll,
    vote,
    clearError,
  };
};
