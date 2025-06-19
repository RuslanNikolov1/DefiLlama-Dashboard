import React from 'react';
import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './Header.module.scss';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img 
            src="/defillama-logo.png" 
            alt="DefiLlama Logo" 
            className={styles.logoImg}
            width="32"
            height="32"
          />
        </Link>

        {user ? (
          <>
            <nav className={styles.nav} role="navigation" aria-label="Main navigation">
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => isActive ? styles.active : ''}
                role="menuitem"
                aria-current={location.pathname === '/' ? 'page' : undefined}
              >
                📊 Dashboard
              </NavLink>
              <NavLink 
                to="/stablecoins" 
                className={({ isActive }) => isActive ? styles.active : ''}
                role="menuitem"
                aria-current={location.pathname === '/stablecoins' ? 'page' : undefined}
              >
                💰 Stablecoins
              </NavLink>
              <NavLink 
                to="/percentage-yield" 
                className={({ isActive }) => isActive ? styles.active : ''}
                role="menuitem"
                aria-current={location.pathname === '/percentage-yield' ? 'page' : undefined}
              >
                📈 Percentage Yield
              </NavLink>
              <NavLink 
                to="/tvl" 
                className={({ isActive }) => isActive ? styles.active : ''}
                role="menuitem"
                aria-current={location.pathname === '/tvl' ? 'page' : undefined}
              >
                💎 TVL Chart
              </NavLink>
              <NavLink 
                to="/news" 
                className={({ isActive }) => isActive ? styles.active : ''}
                role="menuitem"
                aria-current={location.pathname === '/news' ? 'page' : undefined}
              >
                📰 DeFi News
              </NavLink>
            </nav>
            <ThemeToggle />
            <div className={styles.authButtons}>
              <span className={styles.username}>{user.username}</span>
              <button onClick={handleSignOut} className={styles.signOutButton}>
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <div className={styles.authButtons}>
            <Link to="/signin" className={styles.signInButton}>
              Sign In
            </Link>
            <Link to="/signup" className={styles.signUpButton}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}; 