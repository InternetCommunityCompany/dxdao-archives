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
  Table,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { fuzzyFilter, getProposalData, shortenAddress } from "./_utils/utils";
import { Filter } from "./_components/Filter";
import { Chain } from "@/types/proposal";
import Link from "next/link";
import ChainToggle from "./_components/ChainToggle";
import Pagination from "./_components/Pagination";
import StatusIndicator from "./_components/StatusIndicator";
import Header from "./_components/Header";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Proposal = ReturnType<typeof getProposalData>[0];

const getColumnType = (columnId: string, table: Table<Proposal>) => {
  return typeof table.getPreFilteredRowModel().flatRows[0]?.getValue(columnId);
};

export default function Home() {
  const setParam = (name: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, `${value}`);
    router.push(pathname + "?" + params.toString(), { scroll: false });
  };

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // const [chain, setChain] = useState<Chain>("gnosis");
  const [data, setData] = useState(() => {
    const chain = searchParams.get("chain") as Chain;
    return getProposalData(chain ? "mainnet" : "gnosis");
  });
  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortParam = searchParams.get("sort");
    return sortParam ? JSON.parse(sortParam) : [];
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const filterParam = searchParams.get("filters");
    return filterParam ? JSON.parse(filterParam) : [];
  });

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
      pagination: {
        pageIndex: Number(searchParams.get("page") ?? 1) - 1,
        pageSize: Number(searchParams.get("show") ?? 10),
      },
      sorting,
      columnFilters,
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
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  useEffect(() => {
    const page = searchParams.get("page");
    const show = searchParams.get("show");

    table.setPageIndex(Number(page ?? 1) - 1);
    table.setPageSize(Number(show ?? 10));
    setParam("sort", JSON.stringify(sorting));
    setParam("filters", JSON.stringify(columnFilters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, table, sorting, columnFilters]);

  return (
    <main className="flex min-h-screen flex-col items-center pt-16">
      <div>
        <Header />

        <div className="flex pb-4 justify-end">
          <ChainToggle
            chain={(searchParams.get("chain") as Chain) ?? "gnosis"}
            setParam={setParam}
            setData={setData}
          />
        </div>
        <div className="flex flex-col items-center gap-5">
          <table className="">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="align-bottom text-left text-stone-500 bg-stone-200 text-sm"
                >
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
                        {header.column.getCanFilter() &&
                        getColumnType(header.column.id, table) !== "boolean" ? (
                          <div className="mb-4">
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " ▲",
                          desc: " ▼",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
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
                      <td key={cell.id} className="text-stone-800 py-4">
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

          <div className="my-6 flex w-full">
            <Pagination table={table} setParam={setParam} />
          </div>
        </div>
      </div>
    </main>
  );
}
