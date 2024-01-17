import gnosisProposals from "@/data/gnosisProposals.json";
import mainnetProposals from "@/data/mainnetProposals.json";
import ipfsDataFile from "@/ipfsData.json";
import { Chain, Hex, ProposalSystem, IpfsData } from "@/types/proposal";
import { FilterFn } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

interface Proposal {
  title?: string;
  description?: string;
  id: Hex;
  proposer: Hex;
  isAccepted: boolean;
  submittedTime: number;
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
    const description = ipfsData[proposalId]?.description;
    const isAccepted = Boolean(proposal.stateInVotingMachine === 2);
    const submittedTime = Number.parseInt(proposal.submittedTime) * 1000;

    proposalMap.set(proposalId, {
      title,
      description,
      id: proposal.id,
      proposer: proposal.proposer,
      isAccepted,
      submittedTime,
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

export const getProposalById = (
  id: Hex | string,
  chain: Chain = "gnosis"
): Proposal | undefined => {
  const proposals = getProposalData(chain);
  const proposal = proposals.find((proposal) => proposal.id === id);
  return proposal;
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

export const shortenAddress = (address: string): string => {
  const start = address.slice(0, 6);
  const end = address.slice(-4);
  return `${start}...${end}`;
};
