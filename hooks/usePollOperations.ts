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
  setSearchQuery as setSearchQueryAction,
  setFilterCategory as setFilterCategoryAction,
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
    async (form: FormData) => {
      try {
        const result = await dispatch(createPollAction(form)).unwrap();
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

  const setSearchQuery = useCallback((value: string) => {
    dispatch(setSearchQueryAction(value));
  }, [dispatch]);

  const setFilterCategory = useCallback((value: string) => {
    dispatch(setFilterCategoryAction(value));
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
    setSearchQuery,
    setFilterCategory,
  };
};
