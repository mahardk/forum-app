import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { asyncLogin } from '../store/slices/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(asyncLogin({ email, password }));
    if (res.meta.requestStatus === 'fulfilled') navigate('/');
  };

  return (
    <section className="card formCard">
      <h1 className="pageTitle">Login</h1>
      <form className="form" onSubmit={onSubmit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
        <button className="btnPrimary" type="submit">Masuk</button>
      </form>
      <p className="muted">
        Belum punya akun? <Link to="/register">Daftar</Link>
      </p>
    </section>
  );
}