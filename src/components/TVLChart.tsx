import React, { useState, useMemo } from 'react';
import { useTVLData } from '../hooks/useTVLData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import styles from './Chart.module.scss';
import { ChartSkeleton } from './Skeletons';
import { useTheme } from '../context/ThemeContext';

/**
 * React functional component that displays an area chart showing Total Value Locked (TVL) over time.
 *
 * Uses the `useTVLData` hook to fetch TVL data from the DeFiLlama API.
 * Provides a filter to display data from the last selected number of days (7, 30, 90, 180, or 365 days).
 * The chart is rendered using Recharts components with smooth animations, tooltips, and a responsive container.
 *
 * @component
 * @example
 * return <TVLChart />;
 */

const TVLChart: React.FC = () => {
  const { data, isLoading, error } = useTVLData();
  const [filterDays, setFilterDays] = useState(30);
  const { theme } = useTheme();

  const filteredData = useMemo(() => {
    if (!data) return [];
    const cutoff = Date.now() - filterDays * 24 * 60 * 60 * 1000;
    return data.filter(point => point.date * 1000 >= cutoff);
  }, [data, filterDays]);

  if (isLoading) return <ChartSkeleton />;
  if (error) return <div>Error loading TVL data</div>;

  return (
    <div className={styles.chartContainer}>
      <h3>Total Value Locked (TVL)</h3>
      <select 
        value={filterDays} 
        onChange={e => setFilterDays(Number(e.target.value))}
        className={styles.filterInput}
        data-testid="filter-select"
      >
        {[7, 30, 90, 180, 365].map(days => (
          <option key={days} value={days}>{days} days</option>
        ))}
      </select>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="colorTvl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tickFormatter={timestamp => new Date(timestamp * 1000).toLocaleDateString()}
            stroke={theme === 'dark' ? '#fff' : '#334155'}
          />
          <YAxis stroke={theme === 'dark' ? '#fff' : '#334155'} />
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#444' : '#e2e8f0'} />
          <Tooltip 
            labelFormatter={timestamp => new Date(timestamp * 1000).toLocaleDateString()}
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1e1e2f' : '#ffffff',
              border: `1px solid ${theme === 'dark' ? '#444' : '#e2e8f0'}`,
              color: theme === 'dark' ? '#fff' : '#334155'
            }}
          />
          <Area
            type="monotone"
            dataKey="totalLiquidityUSD"
            stroke="var(--primary-color)"
            fillOpacity={1}
            fill="url(#colorTvl)"
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TVLChart;
