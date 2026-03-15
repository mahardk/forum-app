import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import dicodingForumApi from '../../api/dicodingForumApi';
import { hideLoading, showLoading } from './uiSlice';

export const asyncFetchThreads = createAsyncThunk(
  'threads/fetchAll',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(showLoading());
    try {
      const [threadsRes, usersRes] = await Promise.all([
        dicodingForumApi.getAllThreads(),
        dicodingForumApi.getAllUsers(),
      ]);

      const threads = threadsRes?.data?.threads || [];
      const users = usersRes?.data?.users || [];

      const usersById = Object.fromEntries(users.map((u) => [u.id, u]));
      const enriched = threads.map((t) => ({
        ...t,
        owner: usersById[t.ownerId] || { id: t.ownerId, name: 'Unknown', avatar: '' },
      }));

      return { threads: enriched };
    } catch (e) {
      toast.error(e.message);
      return rejectWithValue(e.message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const asyncCreateThread = createAsyncThunk(
  'threads/create',
  async ({ title, body, category }, { dispatch, getState, rejectWithValue }) => {
    dispatch(showLoading());
    try {
      const { auth } = getState();
      if (!auth.user) throw new Error('Harus login untuk membuat thread');

      const res = await dicodingForumApi.createThread({ title, body, category });
      const thread = res?.data?.thread;

      // owner dari state auth (biar instan)
      const enriched = { ...thread, owner: auth.user };
      toast.success('Thread berhasil dibuat');
      return enriched;
    } catch (e) {
      toast.error(e.message);
      return rejectWithValue(e.message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

function applyVote({
  entity, userId, type,
}) {
  // type: 'up' | 'down' | 'neutral'
  const hasUp = entity.upVotesBy.includes(userId);
  const hasDown = entity.downVotesBy.includes(userId);

  const next = { ...entity };

  const remove = (arr) => arr.filter((id) => id !== userId);
  const add = (arr) => (arr.includes(userId) ? arr : [...arr, userId]);

  if (type === 'neutral') {
    next.upVotesBy = remove(next.upVotesBy);
    next.downVotesBy = remove(next.downVotesBy);
    return next;
  }

  if (type === 'up') {
    next.downVotesBy = remove(next.downVotesBy);
    next.upVotesBy = hasUp ? remove(next.upVotesBy) : add(next.upVotesBy);
    return next;
  }

  // down
  next.upVotesBy = remove(next.upVotesBy);
  next.downVotesBy = hasDown ? remove(next.downVotesBy) : add(next.downVotesBy);
  return next;
}

export const asyncToggleThreadVote = createAsyncThunk(
  'threads/toggleVote',
  async ({ threadId, voteType }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.user) {
      toast.error('Harus login untuk vote');
      return rejectWithValue('UNAUTH');
    }

    try {
      if (voteType === 'up') await dicodingForumApi.upVoteThread(threadId);
      if (voteType === 'down') await dicodingForumApi.downVoteThread(threadId);
      if (voteType === 'neutral') await dicodingForumApi.neutralizeThreadVote(threadId);
      return true;
    } catch (e) {
      toast.error(e.message);
      return rejectWithValue(e.message);
    }
  },
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    items: [],
    categoryFilter: 'all',
    lastOptimisticSnapshot: null,
  },
  reducers: {
    setCategoryFilter(state, action) {
      state.categoryFilter = action.payload;
    },

    optimisticVoteThread(state, action) {
      const { threadId, userId, voteType } = action.payload;
      state.lastOptimisticSnapshot = state.items;

      state.items = state.items.map((t) => {
        if (t.id !== threadId) return t;
        return applyVote({ entity: t, userId, type: voteType });
      });
    },

    rollbackThreads(state) {
      if (state.lastOptimisticSnapshot) state.items = state.lastOptimisticSnapshot;
      state.lastOptimisticSnapshot = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchThreads.fulfilled, (state, action) => {
        state.items = action.payload.threads;
      })
      .addCase(asyncCreateThread.fulfilled, (state, action) => {
        state.items = [{ ...action.payload, clientId: nanoid() }, ...state.items];
      })
      .addCase(asyncToggleThreadVote.fulfilled, (state) => {
        state.lastOptimisticSnapshot = null;
      })
      .addCase(asyncToggleThreadVote.rejected, () => {
      });
  },
});

export const {
  setCategoryFilter, optimisticVoteThread, rollbackThreads,
} = threadsSlice.actions;

export default threadsSlice.reducer;