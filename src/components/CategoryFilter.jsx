import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryFilter } from '../store/slices/threadsSlice';

export default function CategoryFilter({ categories }) {
  const dispatch = useDispatch();
  const active = useSelector((s) => s.threads.categoryFilter);

  return (
    <div className="chips">
      {categories.map((c) => (
        <button
          key={c}
          type="button"
          className={`chip ${active === c ? 'chipActive' : ''}`}
          onClick={() => dispatch(setCategoryFilter(c))}
        >
          {c === 'all' ? 'Semua' : `#${c}`}
        </button>
      ))}
    </div>
  );
}