import React, { useState, useMemo } from 'react';
import { useProtocols } from '../hooks/useProtocols';
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import styles from './ProtocolsTable.module.scss';

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
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) return <div>Loading protocols...</div>;
  if (error) return <div>Error loading protocols</div>;

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Filter by name or chain..."
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
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
                  className={styles.sortable}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProtocolsTable;