import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import threadsReducer, { asyncFetchThreads, asyncCreateThread } from '../../store/slices/threadsSlice';
import authReducer from '../../store/slices/authSlice';
import uiReducer from '../../store/slices/uiSlice';
import dicodingForumApi from '../../api/dicodingForumApi';

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

function buildStore(authUser = null) {
  return configureStore({
    reducer: { threads: threadsReducer, auth: authReducer, ui: uiReducer },
    preloadedState: { auth: { user: authUser } },
  });
}

describe('asyncFetchThreads thunk', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('should dispatch fulfilled with enriched threads on success', async () => {
    vi.spyOn(dicodingForumApi, 'getAllThreads').mockResolvedValue({
      data: {
        threads: [{ id: 't-1', title: 'Hello', ownerId: 'u-1', upVotesBy: [], downVotesBy: [] }],
      },
    });
    vi.spyOn(dicodingForumApi, 'getAllUsers').mockResolvedValue({
      data: { users: [{ id: 'u-1', name: 'Budi', avatar: '' }] },
    });

    const store = buildStore();
    await store.dispatch(asyncFetchThreads());

    const { items } = store.getState().threads;
    expect(items).toHaveLength(1);
    expect(items[0].owner.name).toBe('Budi');
  });

  it('should dispatch rejected on API failure', async () => {
    vi.spyOn(dicodingForumApi, 'getAllThreads').mockRejectedValue(new Error('Network Error'));
    vi.spyOn(dicodingForumApi, 'getAllUsers').mockResolvedValue({ data: { users: [] } });

    const store = buildStore();
    const result = await store.dispatch(asyncFetchThreads());

    expect(result.type).toBe('threads/fetchAll/rejected');
  });
});

describe('asyncCreateThread thunk', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('should dispatch fulfilled with owner from auth state on success', async () => {
    const mockUser = { id: 'u-1', name: 'Budi', avatar: '' };
    vi.spyOn(dicodingForumApi, 'createThread').mockResolvedValue({
      data: {
        thread: {
          id: 't-new', title: 'New', body: 'Body', category: 'react', upVotesBy: [], downVotesBy: [],
        },
      },
    });

    const store = buildStore(mockUser);
    await store.dispatch(asyncCreateThread({ title: 'New', body: 'Body', category: 'react' }));

    const { items } = store.getState().threads;
    expect(items[0].owner).toEqual(mockUser);
  });

  it('should dispatch rejected when user is not logged in', async () => {
    const store = buildStore(null);
    const result = await store.dispatch(
      asyncCreateThread({ title: 'New', body: 'Body', category: 'react' }),
    );

    expect(result.type).toBe('threads/create/rejected');
  });
});