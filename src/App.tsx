import React, { Suspense } from 'react';
import { Routes, Route, NavLink, useLocation, BrowserRouter as Router, Navigate } from 'react-router-dom';
import styles from './App.module.scss';
import Footer from './components/Footer/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import { TableSkeleton } from './components/Skeletons/Skeletons';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import './styles/themes.scss';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute/ProtectedRoute';
import { Header } from './components/layout/Header/Header';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
const DeFiNews = React.lazy(() => import('./components/DeFiNews/DeFiNews'));
const NewsDetail = React.lazy(() => import('./components/NewsDetail/NewsDetail'));

// Lazy load components
const ProtocolsTable = React.lazy(() => import('./components/ProtocolsTable/ProtocolsTable'));
const TVLChart = React.lazy(() => import('./components/TVLChart/TVLChart'));
const StablecoinChart = React.lazy(() => import('./components/StablecoinChart/StablecoinChart'));
const AveragePercentageYieldChart = React.lazy(() => import('./components/AveragePercentageYieldChart/AveragePercentageYieldChart'));
const CoinsTable = React.lazy(() => import('./components/CoinsTable/CoinsTable'));

/**
 * Root component that defines the layout and routing of the DeFiLlama Dashboard.
 * Uses React Router for page navigation and wraps pages with shared layout (e.g., Navbar).
 */
function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider>
      <div className={styles.app}>
        <Header />
        <main className={styles.main}>
          {!user ? (
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<Navigate to="/signin" replace />} />
            </Routes>
          ) : (
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    role="region"
                    aria-label="Dashboard content"
                  >
                    <h1>Protocols</h1>
                    <Suspense fallback={<TableSkeleton />}>
                      <ProtocolsTable />
                    </Suspense>
                  </motion.div>
                } />
                <Route path="/coins" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    role="region"
                    aria-label="Coins table"
                  >
                    <h1>Coins</h1>
                    <Suspense fallback={<TableSkeleton />}>
                      <CoinsTable />
                    </Suspense>
                  </motion.div>
                } />
                <Route path="/news" element={
                  <Suspense fallback={<div>Loading DeFi news...</div>}>
                    <DeFiNews />
                  </Suspense>
                } />
                <Route path="/news/:id" element={
                  <Suspense fallback={<div>Loading news detail...</div>}>
                    <NewsDetail />
                  </Suspense>
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
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          )}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default function AppWithProviders() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}