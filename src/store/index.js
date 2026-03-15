import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import threadsReducer from './slices/threadsSlice';
import threadDetailReducer from './slices/threadDetailSlice';
import leaderboardsReducer from './slices/leaderboardsSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    leaderboards: leaderboardsReducer,
    ui: uiReducer,
  },
});

export default store;