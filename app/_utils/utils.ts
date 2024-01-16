import { Hex, ProposalSystem } from "@/types/proposal";
import gnosisProposals from "@/data/gnosisProposals.json";
import { FilterFn } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

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

export const parseProposal = (): Proposal[] => {
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

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};
