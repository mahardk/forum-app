import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { isLoading: false },
  reducers: {
    showLoading(state) { state.isLoading = true; },
    hideLoading(state) { state.isLoading = false; },
  },
});

export const { showLoading, hideLoading } = uiSlice.actions;
export default uiSlice.reducer;