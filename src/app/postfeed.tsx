"use client";

import { usePosts } from "@/hooks/usePosts";

export default function PostsFeed() {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) return <p className="text-center">Carregando...</p>;
  if (error) return <p className="text-center text-red-500">Deu erro 😕</p>;

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      {posts.map((post: any) => (
        <div key={post.id} className="border rounded-lg overflow-hidden bg-white">
          <div className="flex items-center gap-3 p-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
              {post.username[0].toUpperCase()}
            </div>
            <span className="font-semibold text-sm">{post.username}</span>
          </div>
          <img src={post.image_url} alt={post.caption} className="w-full" />
          <div className="p-3 text-sm">
            <span className="font-semibold mr-2">{post.username}</span>
            {post.caption}
          </div>
        </div>
      ))}
    </div>
  );
}
