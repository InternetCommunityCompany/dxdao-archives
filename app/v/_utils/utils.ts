import videoDataFile from "@/data/videos/data.json";
import summaryDataFile from "@/data/videos/summaries.json";

interface Video {
  title: string;
  description: string;
  thumbnailUrl: string;
  channelId: string;
  channelTitle: string;
  videoId: string;
  publishedAt: Date;
  summary: string;
  tags: string[];
}

export const getVideoData = (): Video[] => {
  const videos = videoDataFile as VideoData[];
  const summaries = summaryDataFile as SummaryData[];

  return videos.map((video) => {
    const {
      snippet: {
        publishedAt,
        channelId,
        channelTitle,
        title,
        description,
        thumbnails: {
          medium: { url: thumbnailUrl },
        },
      },
      contentDetails: { videoId },
      tags,
    } = video;

    const summary =
      summaries.find((summary) => summary.videoId === videoId)?.summary || "";
    return {
      title,
      description,
      thumbnailUrl,
      channelId,
      channelTitle,
      videoId,
      publishedAt: new Date(publishedAt),
      summary,
      tags,
    };
  });
};

export const getTags = () => {
  const videos = videoDataFile as VideoData[];
  const tags = videos.map((video) => video.tags).flat();
  const tagsSet = new Set(tags);
  return Array.from(tagsSet);
};

export const getVideoById = (id: string): Video | undefined => {
  let videos = getVideoData();
  let video = videos.find((proposal) => proposal.videoId === id);
  return video;
};
