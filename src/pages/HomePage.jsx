import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ThreadItem from '../components/ThreadItem';
import CategoryFilter from '../components/CategoryFilter';
import { asyncFetchThreads } from '../store/slices/threadsSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const threads = useSelector((s) => s.threads.items);
  const filter = useSelector((s) => s.threads.categoryFilter);

  useEffect(() => {
    dispatch(asyncFetchThreads());
  }, [dispatch]);

  const categories = useMemo(() => {
    const set = new Set(threads.map((t) => t.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [threads]);

  const filtered = useMemo(() => {
    if (filter === 'all') return threads;
    return threads.filter((t) => t.category === filter);
  }, [threads, filter]);

  return (
    <section>
      <h1 className="pageTitle">Diskusi tersedia</h1>
      <CategoryFilter categories={categories} />

      <div className="list">
        {filtered.map((t) => <ThreadItem key={t.id} thread={t} />)}
      </div>
    </section>
  );
}