import React, { useState } from 'react';
import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './Header.module.scss';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleHamburgerClick = () => {
    setMobileMenuOpen((open) => !open);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            <img
              src="/defillama-logo.png"
              alt="DefiLlama Logo"
              className={styles.logoImg}
              width="32"
              height="32"
            />
          </Link>
        </div>
        {/* Hamburger for mobile */}
        {user ? (
          <>
            <button className={styles.hamburger} onClick={handleHamburgerClick} aria-label="Toggle navigation" aria-expanded={mobileMenuOpen} aria-controls="mobile-menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className={styles.center}>
              <nav className={styles.nav} role="navigation" aria-label="Main navigation">
                <NavLink
                  to="/coins"
                  className={({ isActive }) => isActive ? styles.active : ''}
                  role="menuitem"
                  aria-current={location.pathname === '/coins' ? 'page' : undefined}
                >
                  💸 Coins
                </NavLink>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => isActive ? styles.active : ''}
                  role="menuitem"
                  aria-current={location.pathname === '/' ? 'page' : undefined}
                >
                  📊 Protocols
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
            </div>
            <div className={styles.right}>
              <ThemeToggle />
              <div className={styles.authButtons}>
                <span className={styles.username}>{user.username}</span>
                <button onClick={handleSignOut} className={styles.signOutButton}>
                  Sign Out
                </button>
              </div>
            </div>
            {/* Mobile menu */}
            {mobileMenuOpen && (
              <nav id="mobile-menu" className={styles.mobileMenu} role="navigation" aria-label="Mobile navigation">
                <NavLink to="/coins" onClick={closeMobileMenu}>💸 Coins</NavLink>
                <NavLink to="/" end onClick={closeMobileMenu}>📊 Protocols</NavLink>
                <NavLink to="/stablecoins" onClick={closeMobileMenu}>💰 Stablecoins</NavLink>
                <NavLink to="/percentage-yield" onClick={closeMobileMenu}>📈 Percentage Yield</NavLink>
                <NavLink to="/tvl" onClick={closeMobileMenu}>💎 TVL Chart</NavLink>
                <NavLink to="/news" onClick={closeMobileMenu}>📰 DeFi News</NavLink>
              </nav>
            )}
          </>
        ) : (
          <div className={styles.right}>
            <div className={styles.authButtons}>
              <Link to="/signin" className={styles.signInButton}>
                Sign In
              </Link>
              <Link to="/signup" className={styles.signUpButton}>
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}; 