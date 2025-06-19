import React, { useMemo, useState } from 'react';
import { useCoins } from '../../hooks/useCoins';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import styles from './CoinsTable.module.scss';
import { useNavigate } from 'react-router-dom';

const CoinsTable: React.FC = () => {
  const { data: coins, isLoading, error } = useCoins();
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'image',
      header: '',
      cell: info => <img src={info.getValue()} alt="" style={{ width: 24, height: 24 }} />,
      enableSorting: false,
    },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'symbol', header: 'Symbol', cell: info => info.getValue().toUpperCase() },
    {
      accessorKey: 'current_price',
      header: 'Price',
      cell: info => `$${(info.getValue() || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      accessorKey: 'market_cap',
      header: 'Market Cap',
      cell: info => `$${(info.getValue() || 0).toLocaleString()}`,
    },
  ], []);

  const filteredData = useMemo(() => {
    if (!coins) return [];
    return coins.filter(
      c =>
        c.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        c.symbol.toLowerCase().includes(globalFilter.toLowerCase())
    );
  }, [coins, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    manualSorting: false,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading coins</div>;

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Filter by name or symbol..."
        className={styles.filterInput}
      />
      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className={header.column.getCanSort() ? styles.sortable : ''}
                  aria-sort={
                    header.column.getIsSorted()
                      ? header.column.getIsSorted() === 'desc'
                        ? 'descending'
                        : 'ascending'
                      : 'none'
                  }
                  tabIndex={header.column.getCanSort() ? 0 : -1}
                  onKeyDown={e => {
                    if ((e.key === 'Enter' || e.key === ' ') && header.column.getCanSort()) {
                      header.column.toggleSorting();
                    }
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() ? (header.column.getIsSorted() === 'desc' ? ' ↓' : ' ↑') : ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} onClick={() => navigate(`/coin/${row.original.id}`)} style={{ cursor: 'pointer' }}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={styles.paginationButton}
        >
          Previous
        </button>
        <span className={styles.pageInfo}>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CoinsTable; 