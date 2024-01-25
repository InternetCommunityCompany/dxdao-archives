interface ForumThreadData {
  id: number;
  slug: string;
  title: string;
  htmlTitle: string;
  category: number;
  username: string;
  createdAt: string;
}

interface ForumThread {
  id: number;
  slug: string;
  title: string;
  username: string;
  createdAt: Date;
}

interface ForumPostData {
  id: number;
  name: number;
  username: number;
  display_username: string;
  created_at: string;
  cooked: string;
  post_number: number;
  post_type: number;
  updated_at: string;
  reads: number;
  readers_count: number;
  yours: false;

  raw: string;
  actions_summary: { id: number; count: number }[];
}

interface ForumPost {
  id: number;
  name: number;
  username: number;
  displayUsername: string;
  createdAt: Date;
  cooked: string;
  raw: string;
  postNumber: number;
  postType: number;
  updatedAt: Date;
  reads: number;
  readersCount: number;
  likesCount: number;
}
