import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import dicodingForumApi from '../../api/dicodingForumApi';
import { hideLoading, showLoading } from './uiSlice';

export const asyncRegister = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { dispatch, rejectWithValue }) => {
    dispatch(showLoading());
    try {
      await dicodingForumApi.register({ name, email, password });
      toast.success('Registrasi berhasil. Silakan login.');
      return true;
    } catch (e) {
      toast.error(e.message);
      return rejectWithValue(e.message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const asyncLogin = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    dispatch(showLoading());
    try {
      const res = await dicodingForumApi.login({ email, password });
      const token = res?.data?.token;
      dicodingForumApi.putAccessToken(token);
      const me = await dicodingForumApi.getOwnProfile();
      toast.success('Login berhasil');
      return me?.data?.user;
    } catch (e) {
      toast.error(e.message);
      return rejectWithValue(e.message);
    } finally {
      dispatch(hideLoading());
    }
  },
);

export const asyncPreloadAuth = createAsyncThunk(
  'auth/preload',
  async (_, { dispatch }) => {
    const token = dicodingForumApi.getAccessToken();
    if (!token) return null;
    dispatch(showLoading());
    try {
      const me = await dicodingForumApi.getOwnProfile();
      return me?.data?.user;
    } catch {
      dicodingForumApi.clearAccessToken();
      return null;
    } finally {
      dispatch(hideLoading());
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      dicodingForumApi.clearAccessToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncLogin.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(asyncPreloadAuth.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;