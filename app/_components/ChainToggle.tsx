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
      className={`text-xs border text-stone-500 font-semibold border-zinc-400 hover:text-zinc-700 hover:bg-stone-100 py-1 px-2 tracking-tighter ${
        selected ? "bg-stone-100 border-zinc-500" : ""
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
