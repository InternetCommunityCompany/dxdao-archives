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
  Row,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getThreads } from "./_utils/utils";
import { fuzzyFilter } from "../_utils/utils";
import { Filter } from "../_components/Filter";
import ForumPagination from "./_components/Pagination";

const leftAlignedColumn = "title";

interface TableRowProps {
  row: Row<ForumThread>;
}

const TableRow = ({ row }: TableRowProps) => {
  return (
    <tr
      key={row.id}
      className={`border-b border-stone-400 bg-transparent hover:bg-stone-200 `}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          className="text-stone-800 py-4"
          style={{
            width:
              cell.column.id === leftAlignedColumn
                ? "auto"
                : cell.column.getSize(),
          }}
        >
          <div
            className={
              cell.column.id !== leftAlignedColumn
                ? "flex justify-center text-center"
                : undefined
            }
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        </td>
      ))}
    </tr>
  );
};

export default function Forum() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (name: string, value: string | number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, `${value}`);
      router.push(pathname + "?" + params.toString(), { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const threads = useMemo(() => getThreads(), []);

  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortParam = searchParams.get("sort");
    return sortParam
      ? JSON.parse(sortParam)
      : [{ id: "createdAt", desc: true }];
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const filterParam = searchParams.get("filters");
    return filterParam ? JSON.parse(filterParam) : [];
  });

  const columnHelper = createColumnHelper<ForumThread>();
  const columns = [
    columnHelper.accessor("title", {
      header: "Thread title",
      cell: (info) => {
        const value = info.getValue();
        return value ? (
          <Link
            className="font-medium tracking-tighter text-stone-800 text-base"
            href={`/f/${info.row.original.id}`}
          >
            {value}
          </Link>
        ) : (
          <span className="text-stone-700 italic font-light">
            no data available
          </span>
        );
      },
    }),
    columnHelper.accessor("username", {
      header: "From",
      size: 120,
      cell: (info) => {
        return (
          <span className="text-xs text-stone-500 font-semibold text-right">
            {info.row.original.username}
          </span>
        );
      },
    }),
    columnHelper.accessor("createdAt", {
      header: "Created at",
      size: 120,
      cell: (info) => {
        const formattedDate = new Date(
          info.row.original.createdAt
        ).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        return (
          <span className="text-xs text-stone-500 font-semibold text-right">
            {formattedDate}
          </span>
        );
      },
    }),
  ];

  const table = useReactTable({
    columns,
    data: threads,
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
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    // Sorting
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // Filtering
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    //Pagination
    getPaginationRowModel: getPaginationRowModel(),
    // Pinning
    keepPinnedRows: true,
  });

  useEffect(
    () => setParam("sort", JSON.stringify(sorting)),
    [sorting, setParam]
  );
  useEffect(
    () => setParam("filters", JSON.stringify(columnFilters)),
    [columnFilters, setParam]
  );

  useEffect(() => {
    const page = searchParams.get("page");
    const show = searchParams.get("show");

    table.setPageIndex(Number(page ?? 1) - 1);
    table.setPageSize(Number(show ?? 10));
  }, [searchParams, table, sorting, columnFilters]);

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="align-bottom text-left text-stone-500 bg-stone-200 text-sm"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    width:
                      header.column.id === leftAlignedColumn
                        ? "auto"
                        : header.getSize(),
                  }}
                >
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : "",
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {header.column.getCanFilter() ? (
                      <div className="mb-4">
                        <Filter column={header.column} />
                      </div>
                    ) : null}
                    <span
                      className={`flex p-1 ${
                        header.column.id === leftAlignedColumn
                          ? "justify-start"
                          : "justify-center"
                      }`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " ▲",
                        desc: " ▼",
                      }[header.column.getIsSorted() as string] ?? null}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {/* Pinned rows */}
          {table.getTopRows().map((row) => (
            <TableRow key={row.id} row={row} />
          ))}
          {/* Rest of the rows */}
          {table.getCenterRows().map((row) => (
            <TableRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
      <div className="my-6 flex w-full">
        <ForumPagination table={table} setParam={setParam} />
      </div>
    </div>
  );
}