import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import dicodingForumApi from '../../api/dicodingForumApi';
import { hideLoading, showLoading } from './uiSlice';

export const asyncFetchLeaderboards = createAsyncThunk(
  'leaderboards/fetch',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(showLoading());
    try {
      const res = await dicodingForumApi.getLeaderboards();
      return res?.data?.leaderboards || [];
    } catch (e) {
      toast.error(e.message);
      return rejectWithValue(e.message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState: { items: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(asyncFetchLeaderboards.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export default leaderboardsSlice.reducer;