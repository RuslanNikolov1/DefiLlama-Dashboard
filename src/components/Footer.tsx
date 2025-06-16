import React from 'react';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.section}>
          <h4>📊 Data Source</h4>
          <a 
            href="https://defillama.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.link}
          >
            DefiLlama
          </a>
        </div>
        <div className={styles.section}>
          <h4>📚 Resources</h4>
          <a 
            href="https://docs.llama.fi" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.link}
          >
            Documentation
          </a>
          <a 
            href="https://github.com/DefiLlama" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.link}
          >
            GitHub
          </a>
        </div>
        <div className={styles.section}>
          <h4>👥 Community</h4>
          <a 
            href="https://twitter.com/DefiLlama" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.link}
          >
            Twitter
          </a>
          <a 
            href="https://discord.gg/buPFYXzFDd" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.link}
          >
            Discord
          </a>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} DefiLlama Dashboard. All data is sourced from DefiLlama.</p>
      </div>
    </footer>
  );
};

export default Footer; 