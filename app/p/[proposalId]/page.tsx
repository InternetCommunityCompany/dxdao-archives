import { getProposalById } from "@/app/_utils/utils";

export default function Page({ params }: { params: { proposalId: string } }) {
  const proposalData = getProposalById(params.proposalId);
  if (!proposalData) return <div>Proposal not found</div>;

  return (
    <div>
      <h1>{proposalData.title}</h1>
      <h2>{proposalData.proposer}</h2>
      <p>{proposalData.description}</p>
    </div>
  );
}
