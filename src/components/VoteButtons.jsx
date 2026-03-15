import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  asyncToggleThreadVote,
  optimisticVoteThread,
  rollbackThreads,
} from '../store/slices/threadsSlice';

export default function VoteButtons({ type, item }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const userId = user?.id;
  const hasUp = userId ? item.upVotesBy.includes(userId) : false;
  const hasDown = userId ? item.downVotesBy.includes(userId) : false;

  const onVote = async (voteType) => {
    if (!user) return;

    if (type === 'thread') {
      dispatch(optimisticVoteThread({ threadId: item.id, userId: user.id, voteType }));
      const result = await dispatch(asyncToggleThreadVote({ threadId: item.id, voteType }));
      if (result.meta.requestStatus === 'rejected') dispatch(rollbackThreads());
    }
  };

  return (
    <div className="votes">
      <button
        type="button"
        className={`voteBtn ${hasUp ? 'voteActive' : ''}`}
        onClick={() => onVote(hasUp ? 'neutral' : 'up')}
        disabled={!user}
        title={user ? 'Upvote' : 'Login untuk vote'}
      >
        👍 {item.upVotesBy.length}
      </button>

      <button
        type="button"
        className={`voteBtn ${hasDown ? 'voteActive' : ''}`}
        onClick={() => onVote(hasDown ? 'neutral' : 'down')}
        disabled={!user}
        title={user ? 'Downvote' : 'Login untuk vote'}
      >
        👎 {item.downVotesBy.length}
      </button>
    </div>
  );
}