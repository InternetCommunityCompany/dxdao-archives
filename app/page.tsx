"use client";

import { ProposalSystem, Hex } from "@/types/proposal";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import gnosisProposals from "@/data/gnosisProposals.json";
import { useState } from "react";

interface Proposal {
  title: string;
  id: Hex;
  proposer: Hex;
  votes: {
    amount: string;
    vote: string;
    voter: Hex;
  }[];
}

const parseProposal = (): Proposal[] => {
  const data = gnosisProposals as ProposalSystem;
  const proposalList = data.proposals;
  const proposalKeys = Object.keys(proposalList) as Hex[];

  const proposalMap = new Map<Hex, Proposal>();

  proposalKeys.forEach((proposalId) => {
    const proposal = proposalList[proposalId];
    proposalMap.set(proposalId, {
      title: proposal.title,
      id: proposal.id,
      proposer: proposal.proposer,
      votes: [],
    });
  });

  const votingMachineAddresses = Object.keys(data.votingMachines) as Hex[];

  votingMachineAddresses.forEach((address) => {
    const votes = data.votingMachines[address].events.votes;
    votes.forEach((vote) => {
      const proposalId = vote.proposalId;
      const proposal = proposalMap.get(proposalId);

      if (proposal) {
        proposal.votes.push(vote);
        proposalMap.set(proposalId, proposal);
      }
    });
  });

  const proposals = Array.from(proposalMap.values());
  return proposals;
};

const data = parseProposal();

export default function Home() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<Proposal>();
  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("proposer", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("title", {
      cell: (info) => info.getValue(),
    }),
  ];

  const table = useReactTable({
    columns,
    data,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <table>
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
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 100)
              .map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
