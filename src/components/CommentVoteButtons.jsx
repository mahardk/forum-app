import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  asyncToggleCommentVote,
  optimisticVoteComment,
  rollbackThreadDetail,
} from '../store/slices/threadDetailSlice';

export default function CommentVoteButtons({ threadId, comment }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const userId = user?.id;
  const hasUp = userId ? comment.upVotesBy.includes(userId) : false;
  const hasDown = userId ? comment.downVotesBy.includes(userId) : false;

  const onVote = async (voteType) => {
    if (!user) {
      toast.error('Harus login untuk vote');
      return;
    }

    dispatch(optimisticVoteComment({ commentId: comment.id, userId: user.id, voteType }));
    const res = await dispatch(asyncToggleCommentVote({
      threadId,
      commentId: comment.id,
      voteType,
    }));

    if (res.meta.requestStatus === 'rejected') {
      dispatch(rollbackThreadDetail());
      toast.error(res.payload || 'Gagal vote komentar');
    }
  };

  return (
    <div className="votes">
      <button
        type="button"
        className={`voteBtn ${hasUp ? 'voteActive' : ''}`}
        onClick={() => onVote(hasUp ? 'neutral' : 'up')}
        disabled={!user}
      >
        👍 {comment.upVotesBy.length}
      </button>

      <button
        type="button"
        className={`voteBtn ${hasDown ? 'voteActive' : ''}`}
        onClick={() => onVote(hasDown ? 'neutral' : 'down')}
        disabled={!user}
      >
        👎 {comment.downVotesBy.length}
      </button>
    </div>
  );
}