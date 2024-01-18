import Image from "next/image";
import React from "react";
import separator from "../_assets/dotted-squiggly.svg";

const Header = () => {
  return (
    <>
      <h1 className="font-serif flex flex-col text-6xl text-center text-slate-600 whitespace-pre items-center font-extralight tracking-tighter mb-4">
        <span className="text-xl font-bold text-slate-500 -mb-2 tracking-normal">
          the
        </span>
        <span className="-mb-4">dxDAO</span>
        <span>archives</span>
      </h1>

      <h2 className="flex flex-col items-center font-serif text-center text-slate-600">
        <span className="text-xs">by</span>
        <span className="flex">
          THE
          <Image src={separator} alt="separator" className="w-20 px-2" />
          INTERNET
        </span>
        <span>COMMUNITY COMPANY</span>
      </h2>
    </>
  );
};

export default Header;