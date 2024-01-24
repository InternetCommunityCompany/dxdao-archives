const Summary: React.FC = () => {
  return (
    <div className="flex gap-5 p-4 justify-center font-serif mb-16 text-jet text-stone-500">
      <div className="w-1/2">
        <p>
          DXdao was a beacon of decentralization, born from the collaboration of
          Gnosis and DAOstack. It pioneered the use of holographic consensus and
          non-transferable reputation tokens in governance. <br /> Beyond
          theory, DXdao developed bleeding edge products and upheld true
          decentralization, notably hosting with ENS & IPFS, distinguishing
          itself in a landscape of DAOs in name only.
        </p>
      </div>
      <div className="w-1/2">
        <p>
          After a period of disagreements and splintering opinions inside and
          outside the DAO, in April 2023 a vote was passed to dissolve the DAO.
          Most funds went back to investors and the remaining amount was split
          between the projects.
          <br />
          You can follow these projects below:
        </p>
        <a
          href="https://twitter.com/Swapr_dapp"
          target="_blank"
          className="underline font-bold mt-10"
        >
          Swapr
        </a>
        <br />
        <a
          href="https://twitter.com/CarrotEth"
          target="_blank"
          className="underline font-bold mt-10"
        >
          Carrot
        </a>
        <br />
        <a
          href="https://internetcommunity.co"
          target="_blank"
          className="underline font-bold mt-10"
        >
          The Internet Community Company (previously DXgov)
        </a>
      </div>
    </div>
  );
};

export default Summary;
