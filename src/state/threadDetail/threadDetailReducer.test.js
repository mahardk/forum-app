import { describe, it, expect } from 'vitest';
import threadDetailReducer, {
  clearThreadDetail,
  optimisticVoteComment,
  rollbackThreadDetail,
} from '../../store/slices/threadDetailSlice';

const mockComment = {
  id: 'comment-1',
  content: 'Test comment',
  upVotesBy: [],
  downVotesBy: [],
};

const mockItem = {
  id: 'thread-1',
  title: 'Thread Detail',
  comments: [mockComment],
};

const initialState = {
  item: mockItem,
  lastOptimisticSnapshot: null,
};

describe('threadDetailSlice reducer', () => {
  describe('clearThreadDetail', () => {
    it('should set item to null', () => {
      const nextState = threadDetailReducer(initialState, clearThreadDetail());
      expect(nextState.item).toBeNull();
    });

    it('should set lastOptimisticSnapshot to null', () => {
      const state = { ...initialState, lastOptimisticSnapshot: mockItem };
      const nextState = threadDetailReducer(state, clearThreadDetail());
      expect(nextState.lastOptimisticSnapshot).toBeNull();
    });
  });

  describe('optimisticVoteComment', () => {
    it('should add userId to upVotesBy on target comment', () => {
      const nextState = threadDetailReducer(
        initialState,
        optimisticVoteComment({ commentId: 'comment-1', userId: 'user-1', voteType: 'up' }),
      );
      expect(nextState.item.comments[0].upVotesBy).toContain('user-1');
    });

    it('should save current item as lastOptimisticSnapshot before mutating', () => {
      const nextState = threadDetailReducer(
        initialState,
        optimisticVoteComment({ commentId: 'comment-1', userId: 'user-1', voteType: 'up' }),
      );
      expect(nextState.lastOptimisticSnapshot).toEqual(mockItem);
    });
  });

  describe('rollbackThreadDetail', () => {
    it('should restore item from lastOptimisticSnapshot', () => {
      const state = {
        item: { ...mockItem, comments: [] },
        lastOptimisticSnapshot: mockItem,
      };
      const nextState = threadDetailReducer(state, rollbackThreadDetail());
      expect(nextState.item).toEqual(mockItem);
    });

    it('should clear lastOptimisticSnapshot after rollback', () => {
      const state = { item: mockItem, lastOptimisticSnapshot: mockItem };
      const nextState = threadDetailReducer(state, rollbackThreadDetail());
      expect(nextState.lastOptimisticSnapshot).toBeNull();
    });
  });
});