import React, { useState, useMemo } from 'react';
import { useStablecoinData } from '../hooks/useStablecoinData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import styles from './Chart.module.scss';
import { ChartSkeleton } from './Skeletons';

/**
 * React functional component that displays a line chart of stablecoin circulating supply over time.
 *
 * Fetches stablecoin data using the `useStablecoinData` hook. Provides a filter to display data for the last
 * selected number of days (e.g., 7, 30, 90, 180, or 365 days).
 *
 * The chart uses Recharts components with animations, tooltips, and a responsive container.
 *
 * @component
 * @example
 * return <StablecoinChart />;
 */

const StablecoinChart: React.FC = () => {
  const { data, isLoading, error } = useStablecoinData();
  const [filterDays, setFilterDays] = useState(30);

  const filteredData = useMemo(() => {
    if (!data) return [];
    const cutoff = Date.now() - filterDays * 24 * 60 * 60 * 1000;
    return data.filter(point => point.date * 1000 >= cutoff);
  }, [data, filterDays]);

  if (isLoading) return <ChartSkeleton />;
  if (error) return <div>Error loading stablecoin data</div>;

  return (
    <div className={styles.chartContainer}>
      <h3>Stablecoin Circulating Supply</h3>
      <select value={filterDays} onChange={e => setFilterDays(Number(e.target.value))}>
        {[7, 30, 90, 180, 365].map(days => (
          <option key={days} value={days}>{days} days</option>
        ))}
      </select>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData}>
          <XAxis dataKey="date" tickFormatter={timestamp => new Date(timestamp * 1000).toLocaleDateString()} />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip labelFormatter={timestamp => new Date(timestamp * 1000).toLocaleDateString()} />
          <Line type="monotone" dataKey="circulating" stroke="#82ca9d" isAnimationActive={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StablecoinChart;
