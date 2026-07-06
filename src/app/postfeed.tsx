"use client";

import { Loader } from "@/components/ui/loader";
import { usePosts } from "@/hooks/usePosts";
import PostCard from "@/app/components/PostCard";

export default function PostsFeed() {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-primary">
        <Loader />
      </div>
    );
  if (error) return <p className="text-center text-destructive">Deu erro 😕</p>;

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      {posts.map((post: any) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
