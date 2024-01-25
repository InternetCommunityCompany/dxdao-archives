"use client";

import { useEffect, useMemo, useState } from "react";
import VideoCard from "./_components/VideoCard";
import { getTags, getVideoData } from "./_utils/utils";
import { FaCircleInfo } from "react-icons/fa6";

const VIDEOS_PER_PAGE = 24;

export default function Videos() {
  const tags = getTags();

  const [activePage, setActivePage] = useState<number>(1);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Reset page when tag changes
  useEffect(() => {
    setActivePage(1);
  }, [activeTag]);

  const videos = useMemo(() => {
    return getVideoData().filter((video) => {
      if (!activeTag) return true;
      return video.tags.includes(activeTag);
    });
  }, [activeTag]);

  const pageCount = useMemo(() => {
    return Math.ceil(videos.length / VIDEOS_PER_PAGE);
  }, [videos]);

  const paginatedVideos = useMemo(() => {
    const start = (activePage - 1) * VIDEOS_PER_PAGE;
    const end = start + VIDEOS_PER_PAGE;
    return videos.slice(start, end);
  }, [activePage, videos]);

  function createPaginationArray(totalPages: number) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  return (
    <div>
      <div className="flex flex-row justify-center items-center mt-8 border-stone-400 border-2 p-4 rounded-lg gap-3 text-stone-700 font-serif">
        <FaCircleInfo size={14} className="fill-stone-700" /> Click on a video
        to find a summary of the video transcript.
      </div>
      <div className="flex flex-row justify-center mt-8">
        <span
          onClick={() => setActiveTag(null)}
          className={`${
            !activeTag ? "bg-stone-700" : "bg-stone-500"
          } px-4 py-3 text-sm mr-1 cursor-pointer`}
        >
          All
        </span>

        {tags?.map((tag) => (
          <span
            onClick={() => setActiveTag(tag)}
            className={`${
              activeTag === tag ? "bg-stone-700" : "bg-stone-500"
            } px-4 py-3 text-sm mr-1 cursor-pointer`}
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 m-3">
        {paginatedVideos.map((video) => (
          <VideoCard
            key={video.videoId}
            title={video.title}
            date={video.publishedAt}
            image={video.thumbnailUrl}
            link={`/v/${video.videoId}`}
            tags={video.tags}
          />
        ))}
      </div>

      <div className="flex flex-row justify-center mt-8">
        {createPaginationArray(pageCount)?.map((page) => (
          <span
            onClick={() => setActivePage(page)}
            className={`${
              activePage === page ? "bg-stone-700" : "bg-stone-500"
            } px-4 py-3 text-sm mr-1 cursor-pointer`}
            key={page}
          >
            {page}
          </span>
        ))}
      </div>
    </div>
  );
}
