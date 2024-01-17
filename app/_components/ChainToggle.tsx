import { Chain, Proposal } from "@/types/proposal";
import React from "react";
import { getProposalData } from "../_utils/utils";

interface ChainToggleProps {
  chain: Chain;
  setChain: (chain: Chain) => void;
  setData: (proposals: any) => void;
}

const ToggleButton = ({
  chain,
  setChain,
  setData,
  name,
  selected,
}: {
  chain: Chain;
  setChain: (chain: Chain) => void;
  setData: (proposals: any) => void;
  name: string;
  selected: boolean;
}) => {
  return (
    <button
      className={`text-sm border text-zinc-600 border-zinc-500 hover:text-zinc-400 hover:bg-zinc-800 p-1 rounded-md tracking-tighter ${
        selected ? "bg-zinc-700 text-zinc-200" : ""
      }`}
      onClick={() => {
        setData(getProposalData(chain));
        setChain(chain);
      }}
    >
      {name}
    </button>
  );
};

const ChainToggle = ({ chain, setChain, setData }: ChainToggleProps) => {
  return (
    <div className="flex gap-1">
      <ToggleButton
        chain={"gnosis"}
        setChain={setChain}
        setData={setData}
        name="GNO"
        selected={chain === "gnosis"}
      />
      <ToggleButton
        chain={"mainnet"}
        setChain={setChain}
        setData={setData}
        name="ETH"
        selected={chain === "mainnet"}
      />
    </div>
  );
};

export default ChainToggle;
