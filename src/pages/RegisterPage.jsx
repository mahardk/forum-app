import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { asyncRegister } from '../store/slices/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(asyncRegister({ name, email, password }));
    if (res.meta.requestStatus === 'fulfilled') navigate('/login');
  };

  return (
    <section className="card formCard">
      <h1 className="pageTitle">Register</h1>
      <form className="form" onSubmit={onSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
        <button className="btnPrimary" type="submit">Daftar</button>
      </form>
      <p className="muted">
        Sudah punya akun? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}