import BackButton from "@/app/_components/BackButton";
import { getProposalById } from "@/app/_utils/utils";

export default function Page({ params }: { params: { proposalId: string } }) {
  const proposalData = getProposalById(params.proposalId);
  if (!proposalData) return <div>Proposal not found</div>;

  return (
    <div className="flex flex-col m-auto max-w-2xl mb-20">
      <div className="flex items-start">
        <BackButton />
      </div>

      <div className="flex flex-col rounded-lg  p-9 break-words shadow-lg bg-stone-50">
        <h1 className="text-3xl font-light text-stone-500 pb-3">
          {proposalData.title}
        </h1>
        <h2 className="text-zinc-400 text-medium pb-7 text-sm">
          {proposalData.proposer}
        </h2>

        <div className="border-b border-stone-400 mb-7" />

        <p className="leading-relaxed whitespace-pre-wrap text-stone-700 tracking-tight">
          {proposalData.description}
        </p>
      </div>
    </div>
  );
}
