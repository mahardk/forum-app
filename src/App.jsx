import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NewThreadPage from './pages/NewThreadPage';
import { asyncPreloadAuth } from './store/slices/authSlice';

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    dispatch(asyncPreloadAuth());
  }, [dispatch]);

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/threads/:id" element={<ThreadDetailPage />} />
        <Route path="/leaderboards" element={<LeaderboardsPage />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
        <Route path="/new" element={user ? <NewThreadPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AppLayout>
  );
}