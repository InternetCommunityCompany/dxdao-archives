import { Chain } from "@/types/proposal";
import Image from "next/image";
import ethLogo from "@/app/_assets/ethLogo.png";
import gnoLogo from "@/app/_assets/gnoLogo.png";

const ChainPill = ({ chain }: { chain: Chain }) => {
  if (chain === "gnosis")
    return <Image src={gnoLogo} alt="Gnosis" width={20} height={20} />;
  else return <Image src={ethLogo} alt="Ethereum" width={20} height={20} />;
};

export default ChainPill;
