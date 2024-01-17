import Image from "next/image";
import React from "react";
import separator from "../_assets/dotted-squiggly.svg";

const Header = () => {
  return (
    <>
      <h1 className="font-serif flex flex-col text-4xl sm:text-6xl text-center text-white whitespace-pre md:items-stretch items-center">
        dxDAO archives
      </h1>

      <h2 className="flex flex-col items-center font-serif text-center text-slate-800">
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
