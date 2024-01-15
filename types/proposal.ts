type Hex = `0x${string}`;

interface Main {
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
    [key: Hex]: SchemeEvent;
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

interface Proposal {
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

interface SchemeEvent {
  address: Hex;
  boostedProposals: string;
  boostedVoteRequiredPercentage: number;
  controllerAddress: Hex;
  maxRepPercentageChange: number;
  maxSecondsForExecution: number;
  name: string;
  newProposalEvents: NewProposalEvent[];
}

interface NewProposalEvent {
  address: Hex;
  blockNumber: number;
  logIndex: number;
  proposalId: Hex;
  timestamp: number;
  transactionIndex: number;
  tx: Hex;
  paramsHash: Hex;
  permissions: {
    canChangeConstraints: boolean;
    canGenericCall: boolean;
    canRegisterSchemes: boolean;
    canUpgrade: boolean;
  };
  proposalIds: Hex[];
  registered: boolean;
  type: string; // ? currently, only "ContributionReward"?
  votingMachine: Hex;
}

interface VotingMachine {
  events: {
    newProposal: VotingMachineNewProposalEvent[];
  };
}

interface VotingMachineNewProposalEvent {
  address: Hex;
  blockNumber: number;
  event: string; // ? currently, only "NewProposal"?
  logIndex: number;
  paramHash: Hex;
  proposalId: Hex;
  proposer: Hex;
  signature: Hex;
  timestamp: number;
  transactionIndex: number;
  tx: Hex;
  name: string;
  token: Hex;
  votingParameters: {
    [key: Hex]: VotingParameters;
  };
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
