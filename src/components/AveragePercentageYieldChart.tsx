import React, { useState } from 'react';
import { useAveragePercentageYield } from '../hooks/useAveragePercentageYield';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import styles from './Chart.module.scss';

/**
 * Functional React component that renders a bar chart of average percentage yields.
 *
 * It fetches data using the `AveragePercentageYieldChart` hook, supports filtering by symbol,
 * and displays the data using Recharts' `BarChart` component with animations.
 *
 * @component
 * @example
 * return <AveragePercentageYieldChart />;
 */

const AveragePercentageYieldChart: React.FC = () => {
  const { data, isLoading, error } = useAveragePercentageYield();
  const [filter, setFilter] = useState('');

  if (isLoading) return <div>Loading AveragePercentageYieldChart data...</div>;
  if (error) return <div>Error loading AveragePercentageYieldChart data</div>;

  const filteredData = data?.filter(rate =>
    rate.symbol.toLowerCase().includes(filter.toLowerCase())
  ) ?? [];

  return (
    <div className={styles.chartContainer}>
      <h3>Average Percentage Yield</h3>
      <input
        type="text"
        placeholder="Filter by symbol"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className={styles.filterInput}
      />
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredData}>
          <XAxis dataKey="symbol" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Bar dataKey="percentage" fill="#8884d8" isAnimationActive={true} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default AveragePercentageYieldChart;

