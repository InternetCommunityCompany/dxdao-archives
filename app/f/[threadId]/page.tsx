"use client";

import BackButton from "@/app/_components/BackButton";
import { Interweave } from "interweave";
import { getThread, getThreadPosts } from "../_utils/utils";
import { FaHeart, FaEye } from "react-icons/fa6";

function transform(
  node: HTMLElement,
  children: React.ReactNode[]
): React.ReactNode {
  if (node.tagName === "P") {
    return <p className="my-4">{children}</p>;
  }
  if (node.tagName === "A") {
    return (
      <a
        href={node.getAttribute("href") as string}
        className="underline text-stone-500"
        target="_blank"
      >
        {children}
      </a>
    );
  }
}

export default function Page({ params }: { params: { threadId: string } }) {
  const threadData = getThread(params.threadId);
  if (!threadData) return <div>Thread not found</div>;

  const posts = getThreadPosts(params.threadId);
  if (!posts) return <div>Posts not found</div>;

  return (
    <div className="flex flex-col m-auto max-w-2xl mb-20">
      <div className="flex items-start">
        <BackButton />
      </div>

      {posts.map((post, idx) => {
        const formattedDate = new Date(post.createdAt).toLocaleDateString(
          "en-US",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }
        );

        return (
          <div
            key={post.id}
            className="flex flex-col rounded-lg p-9 break-words shadow-lg bg-stone-50 mb-8 w-full"
          >
            {idx === 0 && (
              <>
                <h1 className="text-3xl font-light text-stone-500 pb-3">
                  {threadData.title}
                </h1>
              </>
            )}

            <h2 className="text-zinc-500 text-medium font-mono font-semibold">
              {post.displayUsername
                ? `${post.displayUsername} (@${post.username})`
                : `@${post.username}`}
            </h2>

            <div className="text-zinc-400 text-medium text-sm flex items-center gap-4">
              {formattedDate}
              <span className="gap-1 flex items-center">
                <FaEye className="fill-stone-400" size={16} /> {post.reads}
              </span>
            </div>

            <Interweave
              content={post.cooked}
              emptyContent={
                <div className="text-center text-sm">No content found.</div>
              }
              className="text-stone-700 tracking-tight mt-4"
              transform={transform}
            />

            <div className="flex flex-row items-center justify-end mt-4 gap-2 text-stone-700">
              <FaHeart className="fill-stone-400" size={16} /> {post.likesCount}{" "}
              {post.likesCount === 1 ? "Like" : "Likes"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
