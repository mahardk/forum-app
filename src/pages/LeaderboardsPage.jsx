import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncFetchLeaderboards } from '../store/slices/leaderboardsSlice';

export default function LeaderboardsPage() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.leaderboards.items);

  useEffect(() => {
    dispatch(asyncFetchLeaderboards());
  }, [dispatch]);

  return (
    <section>
      <h1 className="pageTitle">Leaderboards</h1>
      <div className="card">
        {items.map((x, idx) => (
          <div key={x.user.id} className="leaderRow">
            <div className="leaderRank">{idx + 1}</div>
            <img className="avatar" src={x.user.avatar} alt={x.user.name} />
            <div className="leaderName">{x.user.name}</div>
            <div className="leaderScore">{x.score}</div>
          </div>
        ))}
      </div>
    </section>
  );
}