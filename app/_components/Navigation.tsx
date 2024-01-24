"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname();

  return (
    <div className="flex my-4 gap-1">
      <Link href="/">
        <div
          className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 rounded-l-xl w-36 text-center font-serif"
          style={
            pathname === "/" || pathname.startsWith("/p")
              ? {
                  color: "rgba(0, 0, 0, 0.6)",
                  background: `linear-gradient(45deg, rgba(247, 151, 30, 0.5), rgba(255, 210, 0, 0.5))`,
                }
              : undefined
          }
        >
          Proposals
        </div>
      </Link>
      <Link href="/v">
        <div
          className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 w-36 text-center font-serif"
          style={
            pathname.startsWith("/v")
              ? {
                  color: "rgba(0, 0, 0, 0.6)",
                  background: `linear-gradient(45deg, rgba(247, 151, 30, 0.5), rgba(255, 210, 0, 0.5))`,
                }
              : undefined
          }
        >
          Videos
        </div>
      </Link>
      <Link href="/f">
        <div
          className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 rounded-r-xl w-36 text-center font-serif"
          style={
            pathname.startsWith("/f")
              ? {
                  color: "rgba(0, 0, 0, 0.6)",
                  background: `linear-gradient(45deg, rgba(247, 151, 30, 0.5), rgba(255, 210, 0, 0.5))`,
                }
              : undefined
          }
        >
          Forum
        </div>
      </Link>
    </div>
  );
};

export default Navigation;
