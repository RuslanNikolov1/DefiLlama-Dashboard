import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import styles from './App.module.scss';
import ProtocolsTable from './components/ProtocolsTable';
import TVLChart from './components/TVLChart';
import StablecoinChart from './components/StablecoinChart';
import AveragePercentageYieldChart from './components/AveragePercentageYieldChart';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Root component that defines the layout and routing of the DeFiLlama Dashboard.
 * Uses React Router for page navigation and wraps pages with shared layout (e.g., Navbar).
 */

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ''}>Dashboard</NavLink>
        <NavLink to="/stablecoins" className={({ isActive }) => isActive ? styles.active : ''}>Stablecoins</NavLink>
        <NavLink to="/percentage-yield" className={({ isActive }) => isActive ? styles.active : ''}>Percentage Yield</NavLink>
        <NavLink to="/tvl" className={({ isActive }) => isActive ? styles.active : ''}>TVL Chart</NavLink>
      </nav>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h1>DeFi Dashboard</h1>
              <ProtocolsTable />
              <div className={styles.charts}>
                <TVLChart />
              </div>
            </motion.div>
          } />
          <Route path="/stablecoins" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <StablecoinChart />
            </motion.div>
          } />
          <Route path="/percentage-yield" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <AveragePercentageYieldChart />
            </motion.div>
          } />
          <Route path="/tvl" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <TVLChart />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;