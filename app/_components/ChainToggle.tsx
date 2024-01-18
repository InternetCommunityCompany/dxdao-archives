import { Chain, Proposal } from "@/types/proposal";
import React from "react";
import { getProposalData } from "../_utils/utils";

interface ChainToggleProps {
  chain: Chain;
  setParam: (name: string, value: string | number) => void;
  setData: (proposals: any) => void;
}

const ToggleButton = ({
  chain,
  setParam,
  setData,
  name,
  selected,
}: {
  chain: Chain;
  setParam: (name: string, value: string | number) => void;
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
        setParam("chain", chain);
      }}
    >
      {name}
    </button>
  );
};

const ChainToggle = ({ chain, setParam, setData }: ChainToggleProps) => {
  return (
    <div className="flex gap-1">
      <ToggleButton
        chain={"gnosis"}
        setParam={setParam}
        setData={setData}
        name="GNO"
        selected={chain === "gnosis"}
      />
      <ToggleButton
        chain={"mainnet"}
        setParam={setParam}
        setData={setData}
        name="ETH"
        selected={chain === "mainnet"}
      />
    </div>
  );
};

export default ChainToggle;
