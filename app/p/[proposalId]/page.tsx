import { getProposalById } from "@/app/_utils/utils";
import Link from "next/link";

export default function Page({ params }: { params: { proposalId: string } }) {
  const proposalData = getProposalById(params.proposalId);
  if (!proposalData) return <div>Proposal not found</div>;

  return (
    <div className="flex flex-col m-auto max-w-2xl">
      <div className="flex items-start">
        <Link
          className="flex py-1 px-3 border-white border rounded text-sm my-7"
          href="/"
        >
          Back
        </Link>
      </div>
      <div className="flex flex-col rounded-md bg-zinc-900 p-9 break-words">
        <h1 className="text-3xl font-bold text-zinc-500 pb-2">
          {proposalData.title}
        </h1>
        <h2 className="text-zinc-500 pb-7">{proposalData.proposer}</h2>
        <p className="leading-normal whitespace-pre-wrap text-zinc-200">
          {proposalData.description}
        </p>
      </div>
    </div>
  );
}
