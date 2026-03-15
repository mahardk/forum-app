import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { asyncLogin, asyncPreloadAuth } from '../../store/slices/authSlice';
import uiReducer from '../../store/slices/uiSlice';
import dicodingForumApi from '../../api/dicodingForumApi';

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

function buildStore() {
  return configureStore({
    reducer: { auth: authReducer, ui: uiReducer },
  });
}

describe('asyncLogin thunk', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('should set user in auth state on successful login', async () => {
    vi.spyOn(dicodingForumApi, 'login').mockResolvedValue({ data: { token: 'token-123' } });
    vi.spyOn(dicodingForumApi, 'putAccessToken').mockImplementation(() => {});
    vi.spyOn(dicodingForumApi, 'getOwnProfile').mockResolvedValue({
      data: { user: { id: 'u-1', name: 'Budi', email: 'budi@test.com' } },
    });

    const store = buildStore();
    await store.dispatch(asyncLogin({ email: 'budi@test.com', password: '123456' }));

    expect(store.getState().auth.user.name).toBe('Budi');
  });

  it('should dispatch rejected on wrong credentials', async () => {
    vi.spyOn(dicodingForumApi, 'login').mockRejectedValue(new Error('Email atau password salah'));

    const store = buildStore();
    const result = await store.dispatch(
      asyncLogin({ email: 'wrong@test.com', password: 'wrong' }),
    );

    expect(result.type).toBe('auth/login/rejected');
    expect(store.getState().auth.user).toBeNull();
  });
});

describe('asyncPreloadAuth thunk', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('should set user when valid token exists in storage', async () => {
    vi.spyOn(dicodingForumApi, 'getAccessToken').mockReturnValue('valid-token');
    vi.spyOn(dicodingForumApi, 'getOwnProfile').mockResolvedValue({
      data: { user: { id: 'u-1', name: 'Budi' } },
    });

    const store = buildStore();
    await store.dispatch(asyncPreloadAuth());

    expect(store.getState().auth.user.name).toBe('Budi');
  });

  it('should return null when no token in storage', async () => {
    vi.spyOn(dicodingForumApi, 'getAccessToken').mockReturnValue(null);

    const store = buildStore();
    await store.dispatch(asyncPreloadAuth());

    expect(store.getState().auth.user).toBeNull();
  });
});
