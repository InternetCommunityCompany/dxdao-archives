import gnosisProposals from "@/data/gnosisProposals.json";
import mainnetProposals from "@/data/mainnetProposals.json";
import ipfsDataFile from "@/ipfsData.json";
import { Chain, Hex, ProposalSystem, IpfsData } from "@/types/proposal";
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

export const getProposalData = (chain: Chain = "gnosis"): Proposal[] => {
  const ipfsData = ipfsDataFile as { [key: string]: IpfsData };
  const data =
    chain === "mainnet"
      ? (mainnetProposals as ProposalSystem)
      : (gnosisProposals as ProposalSystem);

  const proposalList = data.proposals;
  const proposalKeys = Object.keys(proposalList) as Hex[];
  const proposalMap = new Map<Hex, Proposal>();

  proposalKeys.forEach((proposalId) => {
    const proposal = proposalList[proposalId];
    const title = ipfsData[proposalId]?.title;
    proposalMap.set(proposalId, {
      title,
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
