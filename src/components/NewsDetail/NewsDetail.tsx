import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDeFiNews, fetchComments, postComment } from '../../services/newsApi';
import { useAuth } from '../../context/AuthContext';
import styles from './NewsDetail.module.scss';

interface NewsItem {
  id: string;
  title: string;
  published_at: string;
  description?: string;
  url: string;
}

interface Comment {
  _id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeFiNews().then((data) => {
      const found = (Array.isArray(data) ? data : []).find(
        (item) => item.id === id
      );
      setNewsItem(found || null);
      setLoading(false);
    }).catch(() => {
      setNewsItem(null);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchComments(id).then(setComments).catch(() => setComments([]));
    }
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);
    setCommentError(null);
    try {
      await postComment(id!, commentText.trim());
      setCommentText('');
      // Refresh comments
      const newComments = await fetchComments(id!);
      setComments(newComments);
    } catch (err) {
      setCommentError('Failed to post comment.');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) return <div>Loading news...</div>;
  if (!newsItem) return <div>News item not found.</div>;

  return (
    <article className={styles.container}>
      <a href={newsItem.url} target="_blank" rel="noopener noreferrer" className={styles.title}>
        {newsItem.title}
      </a>
      <div className={styles.description}>{newsItem.description || 'No description available.'}</div>
      <div className={styles.publishedAt}>{new Date(newsItem.published_at).toLocaleString()}</div>
      <section style={{ marginTop: 32 }}>
        <h3>Comments</h3>
        {comments.length === 0 && <p>No comments yet.</p>}
        <ul>
          {comments.map((c) => (
            <li key={c._id} style={{ marginBottom: 12 }}>
              <strong>{c.username}</strong>: {c.text}
              <br />
              <small>{new Date(c.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
        {user ? (
          <form onSubmit={handleCommentSubmit} style={{ marginTop: 16 }}>
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              rows={3}
              style={{ width: '100%', resize: 'vertical' }}
              placeholder="Add a comment..."
              disabled={commentLoading}
            />
            <br />
            <button type="submit" disabled={commentLoading || !commentText.trim()}>
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
            {commentError && <div style={{ color: 'red' }}>{commentError}</div>}
          </form>
        ) : (
          <p style={{ color: '#888' }}>Sign in to post a comment.</p>
        )}
      </section>
    </article>
  );
};

export default NewsDetail; 