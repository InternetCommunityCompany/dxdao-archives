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
import StatusIndicator from "./_components/StatusIndicator";

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
      cell: (info) => (
        <Link
          className="font-medium tracking-tighter text-stone-800 text-base"
          href={`/p/${info.row.original.id}`}
        >
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor("submittedTime", {
      header: "Submitted time",
      cell: (info) => {
        const formattedDate = new Date(
          info.row.original.submittedTime
        ).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        return (
          <span className="text-xs text-stone-500 font-semibold">
            {formattedDate}
          </span>
        );
      },
    }),
    columnHelper.accessor("proposer", {
      header: "From",
      cell: (info) => (
        <span className="text-xs font-mono text-stone-500 font-semibold">
          {shortenAddress(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor("isAccepted", {
      header: "State",
      cell: (info) => (
        <span className="flex justify-center">
          <StatusIndicator isAccepted={info.row.original.isAccepted} />
        </span>
      ),
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
      <h1 className="font-serif flex flex-col text-4xl sm:text-6xl text-center text-jet whitespace-pre md:items-stretch items-center">
        dxDAO archives
      </h1>
      <div className="p-5">
        <ChainToggle chain={chain} setChain={setChain} setData={setData} />
      </div>
      <div className="flex flex-col items-center gap-5">
        <table className="">
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
                  className="border-b border-stone-400 bg-transparent hover:bg-stone-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="text-stone-800 p-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
