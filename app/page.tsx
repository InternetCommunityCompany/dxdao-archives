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
  RowPinningState,
  Row,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fuzzyFilter,
  getProposalData,
  getVoteDistributionString,
  shortenAddress,
} from "./_utils/utils";
import { Filter } from "./_components/Filter";
import Link from "next/link";
import Pagination from "./_components/Pagination";
import StatusIndicator from "./_components/StatusIndicator";
import Header from "./_components/Header";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ChainPill from "./_components/ChainPill";
import Timeline from "./_components/Timeline";

type Proposal = ReturnType<typeof getProposalData>[0];

const highlightedProposals = [
  "0x5b414d3747d95a3a260be19a1b7ebfe0b8c21940e98900a1525d3fd9bfd616d1",
];

interface TableRowProps {
  row: Row<Proposal>;
}

const TableRow = ({ row }: TableRowProps) => {
  return (
    <tr
      key={row.id}
      className={`border-b border-stone-400 bg-transparent hover:bg-stone-200 `}
      data-highlighted={highlightedProposals.includes(row.original.id)}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="text-stone-800 py-4">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

export default function Home() {
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

  const data = useMemo(() => getProposalData(), []);

  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortParam = searchParams.get("sort");
    return sortParam
      ? JSON.parse(sortParam)
      : [{ id: "submittedTime", desc: true }];
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const filterParam = searchParams.get("filters");
    return filterParam ? JSON.parse(filterParam) : [];
  });

  const columnHelper = createColumnHelper<Proposal>();
  const columns = [
    columnHelper.accessor("title", {
      header: "Proposal title",
      cell: (info) =>
        info.getValue() ? (
          <Link
            className="font-medium tracking-tighter text-stone-800 text-base"
            href={info.getValue() ? `/p/${info.row.original.id}` : ``}
          >
            {info.getValue()}
          </Link>
        ) : (
          <span className="text-stone-700 italic font-light">
            no data available
          </span>
        ),
    }),
    columnHelper.accessor("submittedTime", {
      header: () => <span className="text-center min-w-28">Submitted</span>,
      cell: (info) => {
        const formattedDate = new Date(
          info.row.original.submittedTime
        ).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        return (
          <span className="text-xs text-stone-500 font-semibold px-3 text-right">
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
      header: () => <span className="flex justify-center">State</span>,
      cell: (info) => (
        <span className="flex justify-center">
          <StatusIndicator isAccepted={info.row.original.isAccepted} />
        </span>
      ),
    }),
    columnHelper.display({
      id: "parsedVotes",
      header: () => <span>Votes</span>,
      cell: (info) => (
        <span className="flex text-xs min-w-24 text-stone-500 font-medium">
          {getVoteDistributionString(
            info.row.original.positiveVotes,
            info.row.original.negativeVotes
          )}
        </span>
      ),
    }),
    columnHelper.accessor("chain", {
      header: () => <span>Chain</span>,
      cell: (info) => (
        <span className="flex justify-center w-20">
          <ChainPill chain={info.row.original.chain} />
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
      rowPinning: {
        top: ["1896"],
        bottom: [],
      },
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
    <main className="flex min-h-screen flex-col items-center pt-16 max-w-4xl mx-auto">
      <div>
        <Header />

        <Timeline />

        <div className="flex gap-5 p-4 justify-center font-serif mb-16 text-jet text-stone-500">
          <div className="w-1/2">
            <p>
              DXdao was a beacon of decentralization, born from the
              collaboration of Gnosis and DAOstack. It pioneered the use of
              holographic consensus and non-transferable reputation tokens in
              governance. <br /> Beyond theory, DXdao developed bleeding edge
              products and upheld true decentralization, notably hosting with
              ENS & IPFS, distinguishing itself in a landscape of DAOs in name
              only.
            </p>
          </div>
          <div className="w-1/2">
            <p>
              After a period of disagreements and splintering opinions inside
              and outside the DAO, in April 2023 a vote was passed to dissolve
              the DAO. Most funds went back to investors and the remaining
              amount was split between the projects.
              <br />
              You can follow these projects below:
            </p>
            <a
              href="https://twitter.com/Swapr_dapp"
              target="_blank"
              className="underline font-bold mt-10"
            >
              Swapr
            </a>
            <br />
            <a
              href="https://twitter.com/CarrotEth"
              target="_blank"
              className="underline font-bold mt-10"
            >
              Carrot
            </a>
            <br />
            <a
              href="https://internetcommunity.co"
              target="_blank"
              className="underline font-bold mt-10"
            >
              The Internet Community Company (previously DXgov)
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5">
          <table>
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
                        {header.column.getCanFilter() ? (
                          <div className="mb-4">
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                        <span className="flex">
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
            <Pagination table={table} setParam={setParam} />
          </div>
        </div>
      </div>
      <p className="p-4 justify-center font-serif mt-8 text-jet text-stone-500">
        This archive was put together to the best of the ability of The Internet
        Community Company.
        <br /> Information in this archive is provided as is for historical
        reference and may not be accurate or complete. <br />
        <a
          href="https://medium.com/@ticc/a-catch-up-for-dxdao-members-on-ticc-302707366262"
          target="_blank"
          className="underline font-bold mt-10"
        >
          What is TICC?
        </a>
      </p>
    </main>
  );
}
