import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { asyncCreateComment, asyncFetchThreadDetail, clearThreadDetail } from '../store/slices/threadDetailSlice';
import { formatRelativeTime } from '../utils/time';
import CommentVoteButtons from '../components/CommentVoteButtons';

export default function ThreadDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const detail = useSelector((s) => s.threadDetail.item);
  const user = useSelector((s) => s.auth.user);

  const [content, setContent] = useState('');

  useEffect(() => {
    dispatch(asyncFetchThreadDetail(id));
    return () => dispatch(clearThreadDetail());
  }, [dispatch, id]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(asyncCreateComment({ threadId: id, content }));
    setContent('');
  };

  if (!detail) return null;

  const ownerName = detail.owner?.name || 'Unknown';
  const ownerAvatar = detail.owner?.avatar;

  return (
    <section>
      <div className="card">
        <div className="threadHeader">
          {ownerAvatar ? (
            <img className="threadHeaderAvatar" src={ownerAvatar} alt={ownerName} />
          ) : (
            <div className="threadHeaderAvatar threadHeaderAvatarFallback" aria-label="No avatar" />
          )}

          <div className="threadHeaderInfo">
            <div className="threadHeaderName">{ownerName}</div>
            <div className="muted">{formatRelativeTime(detail.createdAt)}</div>
          </div>
        </div>

        <div className="cardTop">
          <span className="tag">#{detail.category}</span>
        </div>

        <h1 className="pageTitle">{detail.title}</h1>
        <div className="htmlContent" dangerouslySetInnerHTML={{ __html: detail.body }} />

        <hr />

        <h3>Komentar ({detail.comments.length})</h3>

        {user ? (
          <form className="form" onSubmit={onSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis komentar..."
              required
              rows={4}
            />
            <button className="btnPrimary" type="submit">Kirim</button>
          </form>
        ) : (
          <p className="muted">Login untuk menambahkan komentar.</p>
        )}

        <div className="list">
          {detail.comments.map((c) => (
            <article key={c.id} className="comment">
              <div className="commentHead">
                <img className="avatar" src={c.owner?.avatar} alt={c.owner?.name} />
                <div>
                  <b>{c.owner?.name}</b>
                  <div className="muted">{formatRelativeTime(c.createdAt)}</div>
                </div>
              </div>

              <div className="htmlContent" dangerouslySetInnerHTML={{ __html: c.content }} />

              <div className="commentFooter">
                <CommentVoteButtons threadId={detail.id} comment={c} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}