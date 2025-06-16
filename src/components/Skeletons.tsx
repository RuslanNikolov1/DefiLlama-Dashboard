import React from 'react';
import styles from './Chart.module.scss';
import tableStyles from './ProtocolsTable.module.scss';

const shimmerAnimation = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const shimmerStyle = {
  background: 'linear-gradient(90deg, #2a2a3d 25%, #3a3a4d 50%, #2a2a3d 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className={styles.chartContainer} data-testid="chart-skeleton">
      <div style={{ height: '20px', width: '200px', marginBottom: '1rem', ...shimmerStyle }} />
      <div style={{ height: '300px', width: '100%', ...shimmerStyle }} />
      <style>{shimmerAnimation}</style>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className={styles.tableContainer} data-testid="table-skeleton">
      <div className={styles.filterPlaceholder} />
      <div className={styles.tablePlaceholder}>
        <div className={styles.headerPlaceholder} />
        {[...Array(10)].map((_, index) => (
          <div key={index} className={styles.rowPlaceholder} />
        ))}
      </div>
    </div>
  );
}; 