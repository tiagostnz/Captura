export type PostComment = {
  id: number;
  username: string;
  content: string;
  avatar_url?: string | null;
};

export type User = {
  id: number;
  username: string;
  name: string;
  avatar_url: string | null;
};

export type Me = {
  id: number;
  username: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
};

export type ProfilePost = {
  id: number;
  image_url: string;
  caption: string | null;
};

export type Profile = {
  user: {
    id: number;
    username: string;
    name: string;
    bio: string | null;
    avatar_url: string | null;
  };
  posts: ProfilePost[];
  followersCount: number;
  followingCount: number;
  isMe: boolean;
  isFollowing: boolean;
};

export type Post = {
  id: number;
  image_url: string;
  caption: string;
  username: string;
  author_id: number;
  author_avatar: string | null;
  likes_count: string | number; // pg count vem como texto ("3")
  liked_by_me: boolean;
  following_author: boolean;
  is_mine: boolean;
  comments: PostComment[];
};
