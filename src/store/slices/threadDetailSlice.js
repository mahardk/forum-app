import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import dicodingForumApi from '../../api/dicodingForumApi';
import { hideLoading, showLoading } from './uiSlice';

function applyVote({ entity, userId, type }) {
  const remove = (arr) => arr.filter((id) => id !== userId);
  const add = (arr) => (arr.includes(userId) ? arr : [...arr, userId]);

  const next = { ...entity };

  if (type === 'neutral') {
    next.upVotesBy = remove(next.upVotesBy);
    next.downVotesBy = remove(next.downVotesBy);
    return next;
  }

  if (type === 'up') {
    const hasUp = entity.upVotesBy.includes(userId);
    next.downVotesBy = remove(next.downVotesBy);
    next.upVotesBy = hasUp ? remove(next.upVotesBy) : add(next.upVotesBy);
    return next;
  }

  // down
  const hasDown = entity.downVotesBy.includes(userId);
  next.upVotesBy = remove(next.upVotesBy);
  next.downVotesBy = hasDown ? remove(next.downVotesBy) : add(next.downVotesBy);
  return next;
}

export const asyncFetchThreadDetail = createAsyncThunk(
  'threadDetail/fetch',
  async (threadId, { dispatch, rejectWithValue }) => {
    dispatch(showLoading());
    try {
      const detailRes = await dicodingForumApi.getThreadDetail(threadId);
      const detail = detailRes?.data?.detailThread;

      let usersById = {};
      try {
        const usersRes = await dicodingForumApi.getAllUsers();
        const users = usersRes?.data?.users || [];
        usersById = Object.fromEntries(users.map((u) => [u.id, u]));
      } catch {
        usersById = {};
      }

      const enriched = {
        ...detail,
        owner: detail.owner
          ?? usersById[detail.ownerId]
          ?? { id: detail.ownerId, name: 'Unknown', avatar: '' },

        comments: (detail.comments || []).map((c) => ({
          ...c,
          owner: c.owner
            ?? usersById[c.ownerId]
            ?? { id: c.ownerId, name: 'Unknown', avatar: '' },
        })),
      };

      return enriched;
    } catch (e) {
      toast.error(e.message);
      return rejectWithValue(e.message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const asyncCreateComment = createAsyncThunk(
  'threadDetail/createComment',
  async ({ threadId, content }, { dispatch, getState, rejectWithValue }) => {
    dispatch(showLoading());
    try {
      const { auth } = getState();
      if (!auth.user) throw new Error('Harus login untuk berkomentar');

      const res = await dicodingForumApi.createComment({ threadId, content });
      const comment = res?.data?.comment;

      toast.success('Komentar terkirim');
      return { ...comment, owner: auth.user };
    } catch (e) {
      toast.error(e.message);
      return rejectWithValue(e.message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const asyncToggleCommentVote = createAsyncThunk(
  'threadDetail/toggleCommentVote',
  async ({ threadId, commentId, voteType }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.user) {
      toast.error('Harus login untuk vote');
      return rejectWithValue('UNAUTH');
    }

    try {
      if (voteType === 'up') {
        await dicodingForumApi.upVoteComment({ threadId, commentId });
      } else if (voteType === 'down') {
        await dicodingForumApi.downVoteComment({ threadId, commentId });
      } else {
        await dicodingForumApi.neutralizeCommentVote({ threadId, commentId });
      }

      return true;
    } catch (e) {
      toast.error(e.message);
      return rejectWithValue(e.message);
    }
  },
);

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    item: null,
    lastOptimisticSnapshot: null,
  },
  reducers: {
    clearThreadDetail(state) {
      state.item = null;
      state.lastOptimisticSnapshot = null;
    },

    optimisticVoteComment(state, action) {
      const { commentId, userId, voteType } = action.payload;
      if (!state.item) return;

      state.lastOptimisticSnapshot = state.item;

      state.item = {
        ...state.item,
        comments: state.item.comments.map((c) => {
          if (c.id !== commentId) return c;
          return applyVote({ entity: c, userId, type: voteType });
        }),
      };
    },

    rollbackThreadDetail(state) {
      if (state.lastOptimisticSnapshot) {
        state.item = state.lastOptimisticSnapshot;
      }
      state.lastOptimisticSnapshot = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchThreadDetail.fulfilled, (state, action) => {
        state.item = action.payload;
      })
      .addCase(asyncCreateComment.fulfilled, (state, action) => {
        if (!state.item) return;
        state.item.comments = [action.payload, ...state.item.comments];
      })
      .addCase(asyncToggleCommentVote.fulfilled, (state) => {
        state.lastOptimisticSnapshot = null;
      });
  },
});

export const {
  clearThreadDetail,
  optimisticVoteComment,
  rollbackThreadDetail,
} = threadDetailSlice.actions;

export default threadDetailSlice.reducer;