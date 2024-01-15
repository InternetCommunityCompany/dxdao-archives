export type Hex = `0x${string}`;

export interface ProposalSystem {
  address: Hex;
  blockNumber: number;
  callPermissions: {
    [key: Hex]: {
      [key: Hex]: {
        [key: Hex]: {
          [key: Hex]: {
            fromTime: string;
            value: string;
          };
        };
      };
    };
  };
  ipfsHashes: IpfsHash[];
  networkId: number;
  proposals: {
    [key: Hex]: Proposal;
  };
  reputation: {
    events: ReputationEvent[];
    total: string; // it's "0"
  };
  schemes: {
    [key: Hex]: Scheme;
  };
  version: number;
  votingMachines: {
    [key: Hex]: VotingMachine;
  };
  vestingContracts: VestingContract[];
}

interface IpfsHash {
  hash: string;
  name: Hex;
  type: string; // ? currently, only 'proposal' is used
}

interface ReputationEvent {
  account: Hex;
  address: Hex;
  amount: string;
  blockNumber: number;
  event: string; // ? currently, only "Mint"?
  logIndex: number;
  signature: Hex;
  timestamp: number;
  transactionIndex: number;
  tx: Hex;
}

export interface Proposal {
  boostedPhaseTime: string;
  callData: string[];
  confidenceThreshold: string;
  creationEvent: CreationEvent;
  currentBoostedVotePeriodLimit: string;
  daoBounty: string;
  daoBountyRemain: string;
  descriptionHash: string;
  id: Hex;
  negativeStakes: string;
  negativeVotes: string;
  paramsHash: Hex;
  positiveStakes: string;
  positiveVotes: string;
  preBoostedPhaseTime: string;
  proposer: Hex;
  scheme: Hex;
  secondsFromTimeOutTillExecuteBoosted: string;
  shouldBoost: boolean;
  stateInScheme: number;
  stateInVotingMachine: number;
  submittedTime: string;
  title: string;
  to: Hex[];
  values: string[];
  winningVote: string;
}

interface CreationEvent {
  address: Hex;
  blockNumber: number;
  logIndex: number;
  timestamp: number;
  transactionIndex: number;
  tx: Hex;
}

interface Scheme {
  address: Hex;
  boostedProposals: string;
  boostedVoteRequiredPercentage: number;
  controllerAddress: Hex;
  maxRepPercentageChange: number;
  maxSecondsForExecution: number;
  name: string;
  newProposalEvents: NewProposalEvent[];
  paramsHash: Hex;
  permissions: {
    canChangeConstraints: boolean;
    canGenericCall: boolean;
    canRegisterSchemes: boolean;
    canUpgrade: boolean;
  };
  proposalIds: Hex[];
  registered: boolean;
  type: string;
  votingMachine: Hex;
}

interface NewProposalEvent {
  address: Hex;
  blockNumber: number;
  logIndex: number;
  proposalId: Hex;
  timestamp: number;
  transactionIndex: number;
  tx: Hex;
}

interface VotingMachine {
  events: {
    newProposal: VotingMachineNewProposalEvent[];
    // proposalStateChanges: VotingMachineNewProposalEvent[];
    // redeems: VotingMachineNewProposalEvent[];
    // redeemsDaoBounty: VotingMachineNewProposalEvent[];
    // redeemsRep: VotingMachineNewProposalEvent[];
    // stakes: VotingMachineNewProposalEvent[];
    votes: VotingMachineVoteEvent[];
  };
  name: string;
  token: Hex;
  votingParameters: {
    [key: Hex]: VotingParameters;
  };
}

interface VotingMachineBaseEvent {
  address: Hex;
  blockNumber: number;
  event:
    | "VoteProposal"
    | "NewProposal"
    | "StateChange"
    | "Redeem"
    | "RedeemDaoBounty"
    | "RedeemReputation"
    | "Stake"
    | "VoteProposal";
  logIndex: number;
  proposalId: Hex;
  signature: Hex;
  transactionIndex: number;
  tx: Hex;
}

export interface VotingMachineNewProposalEvent extends VotingMachineBaseEvent {
  paramHash: Hex;
  proposer: Hex;
  timestamp: number;
}

export interface VotingMachineVoteEvent extends VotingMachineBaseEvent {
  amount: string;
  preBoosted: boolean;
  vote: string;
  voter: Hex;
}

interface VotingParameters {
  activationTime: string;
  boostedVotePeriodLimit: string;
  daoBountyConst: string;
  limitExponentValue: string;
  minimumDaoBounty: string;
  proposingRepReward: string;
  queuedVotePeriodLimit: string;
  queuedVoteRequiredPercentage: string;
  quietEndingPeriod: string;
  thresholdConst: string;
  votersReputationLossRatio: string;
}

interface VestingContract {
  address: Hex;
  beneficiary: Hex;
  cliff: string;
  duration: string;
  isOwner: boolean;
  owner: Hex;
  revocable: boolean;
  start: string;
}
