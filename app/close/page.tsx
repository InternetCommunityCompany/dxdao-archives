import BackButton from "@/app/_components/BackButton";
import { getProposalById } from "@/app/_utils/utils";

export default function Page() {
  return (
    <div className="flex flex-col m-auto max-w-2xl mb-20">
      <div className="flex items-start">
        <BackButton />
      </div>

      <div className="flex flex-col rounded-lg  p-9 break-words shadow-lg bg-stone-50">
        <h1 className="text-3xl font-light text-stone-500 pb-3">Closing</h1>

        <div className="leading-relaxed whitespace-pre-wrap text-stone-700 tracking-tight flex flex-col gap-5">
          <p>
            After a period of disagreements and splintering opinions inside and
            outside the DAO, in April 2023 a vote was proposed to dissolve the
            DAO. After some amendments the vote passed and the DAO was no more.
          </p>
          <p>DXD could be redeemed against 70% of the treasury for 1 year.</p>
          <p>ENS tokens were sent to NIMI</p>
          <p>
            30% of treasury was split between DXdao projects to continue project
            development with no obligations to DXdao:
            <ul>
              <li>Swapr Carrot </li>
              <li>Carrot</li>
              <li>The Internet Community Company OU (previously DXgov)</li>
            </ul>
          </p>

          <p>
            After 1 year all unclaimed ETH from the DXD redemption will be sent
            to the projects.
          </p>
        </div>
      </div>
    </div>
  );
}
