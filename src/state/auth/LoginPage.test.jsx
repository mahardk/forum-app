import React from 'react';
import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '../../pages/LoginPage';
import authReducer from '../../store/slices/authSlice';
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

function renderLoginPage() {
  const store = buildStore();
  render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>,
  );
  return store;
}

describe('LoginPage component', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should render email input, password input, and submit button', () => {
    renderLoginPage();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument();
  });

  it('should update email state when email input changes', () => {
    renderLoginPage();
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'budi@test.com' } });
    expect(emailInput.value).toBe('budi@test.com');
  });

  it('should update password state when password input changes', () => {
    renderLoginPage();
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });
    expect(passwordInput.value).toBe('secret123');
  });

  it('should dispatch asyncLogin with correct credentials when form is submitted', async () => {
    vi.spyOn(dicodingForumApi, 'login').mockResolvedValue({ data: { token: 'token-abc' } });
    vi.spyOn(dicodingForumApi, 'putAccessToken').mockImplementation(() => {});
    vi.spyOn(dicodingForumApi, 'getOwnProfile').mockResolvedValue({
      data: { user: { id: 'u-1', name: 'Budi', email: 'budi@test.com' } },
    });

    const store = renderLoginPage();
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'budi@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret123' } });
    fireEvent.submit(screen.getByRole('button', { name: /masuk/i }).closest('form'));

    await vi.waitFor(() => {
      expect(store.getState().auth.user?.name).toBe('Budi');
    });
  });
});