import React, { useEffect, useState } from 'react';
import { fetchDeFiNews } from '../services/newsApi';
import { Link } from 'react-router-dom';
import styles from './DeFiNews.module.scss';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  published_at: string;
  description?: string;
}

const truncateDescription = (desc: string = '') => {
  // Truncate to ~2 lines (about 160 chars, adjust as needed)
  if (desc.length > 160) return desc.slice(0, 157) + '...';
  return desc;
};

const DeFiNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeFiNews().then((data) => {
      setNews(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => {
      setNews([]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading DeFi news...</div>;

  return (
    <section>
      <h2 className={styles.heading}>Latest DeFi News</h2>
      <ul className={styles.newsList}>
        {news.map((item, idx) => (
          <li key={item.id} className={styles.newsItem}>
            <Link to={`/news/${item.id}`} className={styles.newsTitle}>
              {item.title}
            </Link>
            <div className={styles.newsDesc}>
              {truncateDescription(item.description)}
            </div>
            <div className={styles.newsMeta}>
              <span className={styles.publishedAt}>{new Date(item.published_at).toLocaleString()}</span>
            </div>
            {idx !== news.length - 1 && <hr className={styles.newsDivider} />}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DeFiNews; 