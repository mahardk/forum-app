import { describe, it, expect } from 'vitest';
import threadsReducer, {
  setCategoryFilter,
  optimisticVoteThread,
  rollbackThreads,
} from '../../store/slices/threadsSlice';

const mockThread = {
  id: 'thread-1',
  title: 'Test Thread',
  upVotesBy: [],
  downVotesBy: [],
};

const initialState = {
  items: [mockThread],
  categoryFilter: 'all',
  lastOptimisticSnapshot: null,
};

describe('threadsSlice reducer', () => {
  describe('setCategoryFilter', () => {
    it('should set categoryFilter to given value', () => {
      const nextState = threadsReducer(initialState, setCategoryFilter('react'));
      expect(nextState.categoryFilter).toBe('react');
    });

    it("should reset categoryFilter to 'all'", () => {
      const state = { ...initialState, categoryFilter: 'redux' };
      const nextState = threadsReducer(state, setCategoryFilter('all'));
      expect(nextState.categoryFilter).toBe('all');
    });
  });

  describe('optimisticVoteThread', () => {
    it('should add userId to upVotesBy when upvoting', () => {
      const nextState = threadsReducer(
        initialState,
        optimisticVoteThread({ threadId: 'thread-1', userId: 'user-1', voteType: 'up' }),
      );
      expect(nextState.items[0].upVotesBy).toContain('user-1');
    });

    it('should toggle off upVote when user already upvoted', () => {
      const state = {
        ...initialState,
        items: [{ ...mockThread, upVotesBy: ['user-1'] }],
      };
      const nextState = threadsReducer(
        state,
        optimisticVoteThread({ threadId: 'thread-1', userId: 'user-1', voteType: 'up' }),
      );
      expect(nextState.items[0].upVotesBy).not.toContain('user-1');
    });

    it('should move userId from upVotesBy to downVotesBy when downvoting', () => {
      const state = {
        ...initialState,
        items: [{ ...mockThread, upVotesBy: ['user-1'] }],
      };
      const nextState = threadsReducer(
        state,
        optimisticVoteThread({ threadId: 'thread-1', userId: 'user-1', voteType: 'down' }),
      );
      expect(nextState.items[0].upVotesBy).not.toContain('user-1');
      expect(nextState.items[0].downVotesBy).toContain('user-1');
    });
  });

  describe('rollbackThreads', () => {
    it('should restore items from lastOptimisticSnapshot', () => {
      const snapshot = [{ ...mockThread, upVotesBy: ['user-1'] }];
      const state = {
        items: [mockThread],
        categoryFilter: 'all',
        lastOptimisticSnapshot: snapshot,
      };
      const nextState = threadsReducer(state, rollbackThreads());
      expect(nextState.items).toEqual(snapshot);
    });

    it('should clear lastOptimisticSnapshot after rollback', () => {
      const state = { ...initialState, lastOptimisticSnapshot: [mockThread] };
      const nextState = threadsReducer(state, rollbackThreads());
      expect(nextState.lastOptimisticSnapshot).toBeNull();
    });
  });
});