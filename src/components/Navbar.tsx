import React from 'react';
import styles from './Navbar.module.scss';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <img 
          src="/defillama-logo.png" 
          alt="DefiLlama Logo" 
          className={styles.logo}
        />
        <span className={styles.brandName}>DefiLlama</span>
      </div>
    </nav>
  );
};

export default Navbar; 