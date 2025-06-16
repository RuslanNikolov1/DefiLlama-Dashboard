import React, { Suspense } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import styles from './App.module.scss';
import Footer from './components/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import { TableSkeleton } from './components/Skeletons';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import './styles/themes.scss';

// Lazy load components
const ProtocolsTable = React.lazy(() => import('./components/ProtocolsTable'));
const TVLChart = React.lazy(() => import('./components/TVLChart'));
const StablecoinChart = React.lazy(() => import('./components/StablecoinChart'));
const AveragePercentageYieldChart = React.lazy(() => import('./components/AveragePercentageYieldChart'));

/**
 * Root component that defines the layout and routing of the DeFiLlama Dashboard.
 * Uses React Router for page navigation and wraps pages with shared layout (e.g., Navbar).
 */
const AppContent: React.FC = () => {
  const location = useLocation();

  return (
    <div className={styles.container} role="application">
      <header>
        <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
          <div className={styles.logoContainer}>
            <img 
              src="/defillama-logo.png" 
              alt="DefiLlama Logo" 
              className={styles.logo}
              width="32"
              height="32"
            />
          </div>
          <div className={styles.navLinks} role="menubar">
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
          </div>
          <ThemeToggle />
        </nav>
      </header>
      <main className={styles.main} role="main">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                role="region"
                aria-label="Dashboard content"
              >
                <h1>DeFi Dashboard</h1>
                <Suspense fallback={<TableSkeleton />}>
                  <ProtocolsTable />
                </Suspense>
              </motion.div>
            } />
            <Route path="/stablecoins" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                role="region"
                aria-label="Stablecoins chart"
              >
                <Suspense fallback={<div role="status" aria-live="polite">Loading stablecoins data...</div>}>
                  <StablecoinChart />
                </Suspense>
              </motion.div>
            } />
            <Route path="/percentage-yield" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                role="region"
                aria-label="Percentage yield chart"
              >
                <Suspense fallback={<div role="status" aria-live="polite">Loading percentage yield data...</div>}>
                  <AveragePercentageYieldChart />
                </Suspense>
              </motion.div>
            } />
            <Route path="/tvl" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                role="region"
                aria-label="TVL chart"
              >
                <Suspense fallback={<div role="status" aria-live="polite">Loading TVL data...</div>}>
                  <TVLChart />
                </Suspense>
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;