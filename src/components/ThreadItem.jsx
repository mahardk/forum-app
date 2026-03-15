import React from 'react';
import { Link } from 'react-router-dom';
import VoteButtons from './VoteButtons';
import { formatRelativeTime } from '../utils/time';

export default function ThreadItem({ thread }) {
  return (
    <article className="card">
      <div className="cardTop">
        <span className="tag">#{thread.category}</span>
      </div>

      <h2 className="threadTitle">
        <Link to={`/threads/${thread.id}`}>{thread.title}</Link>
      </h2>

      <p className="muted">
        {formatRelativeTime(thread.createdAt)} • Dibuat oleh <b>{thread.owner?.name}</b> • {thread.totalComments} komentar
      </p>

      <div className="cardBottom">
        <VoteButtons type="thread" item={thread} />
        <Link className="btnLink" to={`/threads/${thread.id}`}>Lihat detail</Link>
      </div>
    </article>
  );
}