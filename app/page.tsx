"use client";

import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { fuzzyFilter, getProposalData, shortenAddress } from "./_utils/utils";
import { Filter } from "./_components/Filter";
import { Chain } from "@/types/proposal";
import Link from "next/link";
import ChainToggle from "./_components/ChainToggle";
import Pagination from "./_components/Pagination";

type Proposal = ReturnType<typeof getProposalData>[0];

export default function Home() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [chain, setChain] = useState<Chain>("gnosis");
  const [data, setData] = useState(() => getProposalData(chain));

  const columnHelper = createColumnHelper<Proposal>();
  const columns = [
    columnHelper.accessor("title", {
      header: "Proposal title",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("submittedTime", {
      header: "Submitted time",
      cell: (info) =>
        new Date(info.row.original.submittedTime).toLocaleDateString(),
    }),
    columnHelper.accessor("proposer", {
      header: "From",
      cell: (info) => shortenAddress(info.getValue()),
    }),
    columnHelper.accessor("id", {
      header: "Proposal ID",
      cell: (info) => shortenAddress(info.getValue()),
    }),
    columnHelper.accessor("isAccepted", {
      header: "State",
      cell: (info) => (info.row.original.isAccepted ? "Accepted" : "Rejected"),
    }),
  ];

  const table = useReactTable({
    columns,
    data,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    // Core
    getCoreRowModel: getCoreRowModel(),
    // Sorting
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // Filtering
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="p-5">
        <ChainToggle chain={chain} setChain={setChain} setData={setData} />
      </div>
      <div className="flex flex-col items-center gap-5">
        <table className="border">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " ▲",
                        desc: " ▼",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                    {header.column.getCanFilter() ? (
                      <div>
                        <Filter column={header.column} table={table} />
                      </div>
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className="border bg-zinc-900 hover:bg-zinc-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4">
                      <Link href={`/p/${row.original.id}`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Link>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination table={table} />
      </div>
    </main>
  );
}
