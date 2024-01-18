import gnosisProposals from "@/data/gnosisProposals.json";
import mainnetProposals from "@/data/mainnetProposals.json";
import ipfsDataFile from "@/ipfsData.json";
import { Chain, Hex, ProposalSystem, IpfsData } from "@/types/proposal";
import { FilterFn } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

interface Proposal {
  chain: Chain;
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

export const getProposalData = (): Proposal[] => {
  const ipfsData = ipfsDataFile as { [key: string]: IpfsData };
  const gnosisData = gnosisProposals as ProposalSystem;
  const mainnetData = mainnetProposals as ProposalSystem;

  const proposalList = { ...gnosisData.proposals, ...mainnetData.proposals };
  const proposalKeys = Object.keys(proposalList) as Hex[];
  const proposalMap = new Map<Hex, Proposal>();

  proposalKeys.forEach((proposalId) => {
    const proposal = proposalList[proposalId];

    const title = ipfsData[proposalId]?.title;
    const description = ipfsData[proposalId]?.description;
    const isAccepted = Boolean(proposal.stateInVotingMachine === 2);
    const submittedTime = Number.parseInt(proposal.submittedTime) * 1000;

    let chain: Chain;
    const gnosisProposal = gnosisData.proposals[proposalId];
    if (gnosisProposal) chain = "gnosis";
    else chain = "mainnet";

    proposalMap.set(proposalId, {
      chain,
      title,
      description,
      id: proposal.id,
      proposer: proposal.proposer,
      isAccepted,
      submittedTime,
      votes: [],
    });
  });

  const votingMachines = {
    ...gnosisData.votingMachines,
    ...mainnetData.votingMachines,
  };
  const votingMachineAddresses = Object.keys(votingMachines) as Hex[];

  votingMachineAddresses.forEach((address) => {
    const votes = votingMachines[address].events.votes;
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
  let proposals = getProposalData();
  let proposal = proposals.find((proposal) => proposal.id === id);
  return proposal;
};

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

export const shortenAddress = (address: string): string => {
  const start = address.slice(0, 6);
  const end = address.slice(-4);
  return `${start}...${end}`;
};
