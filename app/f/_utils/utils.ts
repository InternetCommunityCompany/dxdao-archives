import threadsDataFile from "@/data/forum/index.json";
import postsDataFile from "@/data/forum/posts.json";

const DXDAO_CATEGORY_ID = 15;

export const getThreads = () => {
  const threadIndex = threadsDataFile as ForumThreadData[];

  const threads = threadIndex
    .filter((threadData) => threadData.category === DXDAO_CATEGORY_ID)
    .map((threadData) => {
      const createdAt = new Date(threadData.createdAt);
      const thread: ForumThread = {
        ...threadData,
        createdAt,
      };
      return thread;
    });

  return threads;
};

export const getThread = (threadId: string) => {
  const threads = getThreads();
  const thread =
    threads.find((thread) => String(thread.id) === threadId) ||
    threads.find((thread) => thread.slug === threadId);
  if (!thread) return null;
  return thread;
};

export const getThreadPosts = (threadId: string) => {
  const postsMap = postsDataFile as unknown as Record<string, ForumPostData[]>;
  const postsData = postsMap[threadId];

  if (!postsData) return null;

  const posts = postsData.map((postData) => {
    const createdAt = new Date(postData.created_at);
    const updatedAt = new Date(postData.updated_at);
    const post: ForumPost = {
      id: postData.id,
      name: postData.name,
      username: postData.username,
      displayUsername: postData.display_username,
      reads: postData.reads,
      readersCount: postData.readers_count,
      actionsSummary: postData.actions_summary,
      cooked: postData.cooked,
      raw: postData.raw,
      postNumber: postData.post_number,
      postType: postData.post_type,
      createdAt,
      updatedAt,
    };
    return post;
  });

  return posts;
};
