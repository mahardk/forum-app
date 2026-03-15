import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ThreadItem from '../../components/ThreadItem';
import threadsReducer from '../../store/slices/threadsSlice';
import authReducer from '../../store/slices/authSlice';
import uiReducer from '../../store/slices/uiSlice';

const mockThread = {
  id: 'thread-1',
  title: 'Diskusi React Testing',
  category: 'react',
  body: 'Isi diskusi',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 5,
  createdAt: new Date().toISOString(),
  owner: { id: 'u-1', name: 'Budi', avatar: '' },
};

function buildStore(authUser = null) {
  return configureStore({
    reducer: { threads: threadsReducer, auth: authReducer, ui: uiReducer },
    preloadedState: { auth: { user: authUser } },
  });
}

function renderThreadItem(authUser = null) {
  const store = buildStore(authUser);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ThreadItem thread={mockThread} />
      </MemoryRouter>
    </Provider>,
  );
  return store;
}

describe('ThreadItem component', () => {
  it('should render thread title correctly', () => {
    renderThreadItem();
    expect(screen.getByText('Diskusi React Testing')).toBeInTheDocument();
  });

  it('should render thread category tag', () => {
    renderThreadItem();
    expect(screen.getByText('#react')).toBeInTheDocument();
  });

  it('should render owner name', () => {
    renderThreadItem();
    expect(screen.getByText('Budi')).toBeInTheDocument();
  });

  it('should render total comments count', () => {
    renderThreadItem();
    expect(screen.getByText(/5 komentar/i)).toBeInTheDocument();
  });

  it('should render upvote and downvote buttons', () => {
    renderThreadItem();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('upvote button should be disabled when user is not logged in', () => {
    renderThreadItem(null);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });
});