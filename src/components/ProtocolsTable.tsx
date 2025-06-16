import React, { useState, useMemo } from 'react';
import { useProtocols } from '../hooks/useProtocols';
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel, 
  getPaginationRowModel,
  flexRender, 
  ColumnDef 
} from '@tanstack/react-table';
import styles from './ProtocolsTable.module.scss';
import { TableSkeleton } from './Skeletons';

interface Protocol {
  /** Name of the protocol */
  name: string;
  /** Total value locked in USD */
  tvl: number;
  /** Blockchain chain the protocol operates on */
  chain: string;
}

/**
 * React functional component that displays a sortable and filterable table of DeFi protocols.
 *
 * Fetches protocol data using the `useProtocols` hook, supports global text filtering by name or chain,
 * and sorting by column headers. Utilizes TanStack Table for table logic and rendering.
 *
 * @component
 * @example
 * return <ProtocolsTable />;
 */

const ProtocolsTable: React.FC = () => {
  const { data: protocols, isLoading, error } = useProtocols();
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });

  const columns = useMemo<ColumnDef<Protocol>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'tvl', header: 'TVL', cell: info => `$${(info.getValue<number>() || 0).toLocaleString()}` },
      { accessorKey: 'chain', header: 'Chain' },
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (!protocols) return [];
    return protocols.filter(p =>
      p.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
      (p.chain || '').toLowerCase().includes(globalFilter.toLowerCase())
    );
  }, [protocols, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { 
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) return <TableSkeleton />;
  if (error) return <div>Error loading protocols</div>;

  return (
    <div className={styles.container} role="region" aria-label="Protocols table">
      <div className={styles.tableHeader}>
        <input
          type="text"
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Filter by name or chain..."
          className={styles.filterInput}
          aria-label="Filter protocols"
        />
      </div>
      <div className={styles.tableWrapper} role="region" aria-label="Protocols data">
        <table className={styles.table} role="grid">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    role="columnheader"
                    aria-sort={
                      header.column.getIsSorted()
                        ? header.column.getIsSorted() === 'desc'
                          ? 'descending'
                          : 'ascending'
                        : 'none'
                    }
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        header.column.toggleSorting();
                      }
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} role="row">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} role="cell">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination} role="navigation" aria-label="Table pagination">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={styles.paginationButton}
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className={styles.pageInfo} role="status" aria-live="polite">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={styles.paginationButton}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProtocolsTable;