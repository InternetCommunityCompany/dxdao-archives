"use client";

import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      className="flex py-1 px-3 border-stone-400 text-stone-400 border text-xs font-medium my-7 hover:border-stone-500 hover:bg-stone-100 hover:text-stone-"
      onClick={() => router.back()}
    >
      Back
    </button>
  );
};

export default BackButton;
