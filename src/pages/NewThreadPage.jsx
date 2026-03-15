import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { asyncCreateThread } from '../store/slices/threadsSlice';

export default function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(asyncCreateThread({ title, body, category }));
    if (res.meta.requestStatus === 'fulfilled') navigate('/');
  };

  return (
    <section className="card formCard">
      <h1 className="pageTitle">Buat Thread</h1>
      <form className="form" onSubmit={onSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul" required />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Kategori (contoh: redux)" required />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Isi thread (HTML diperbolehkan)" rows={6} required />
        <button className="btnPrimary" type="submit">Publish</button>
      </form>
    </section>
  );
}