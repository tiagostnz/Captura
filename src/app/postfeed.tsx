"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { useToggleLike } from "@/hooks/useToggleLike";
import { useAddComment } from "@/hooks/useAddComment";
import { useToggleFollow } from "@/hooks/useToggleFollow";

export default function PostsFeed() {
  const { data: posts, isLoading, error } = usePosts();
  const { mutate: toggleLike } = useToggleLike();
  const { mutate: addComment } = useAddComment();
  const { mutate: toggleFollow } = useToggleFollow();

  if (isLoading) return <p className="text-center">Carregando...</p>;
  if (error) return <p className="text-center text-destructive">Deu erro 😕</p>;

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      {posts.map((post: any) => (
        <div key={post.id} className="border rounded-lg overflow-hidden bg-card">
          <div className="flex items-center gap-3 p-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold">
              {post.username[0].toUpperCase()}
            </div>
            <span className="font-semibold text-sm">{post.username}</span>

            {/* botão seguir — escondido nos meus próprios posts */}
            {!post.is_mine && (
              <button
                onClick={() => toggleFollow(post.author_id)}
                className="ml-auto text-primary text-sm font-semibold"
              >
                {post.following_author ? "Seguindo" : "Seguir"}
              </button>
            )}
          </div>

          <img src={post.image_url} alt={post.caption} className="w-full" />

          {/* coração + contagem */}
          <div className="px-3 pt-3">
            <button onClick={() => toggleLike(post.id)} aria-label="Curtir">
              <Heart
                className={
                  post.liked_by_me ? "w-6 h-6 fill-primary text-primary" : "w-6 h-6"
                }
              />
            </button>
            <p className="text-sm font-semibold mt-1">{post.likes_count} curtidas</p>
          </div>

          {/* legenda */}
          <div className="px-3 pt-3 text-sm">
            <span className="font-semibold mr-2">{post.username}</span>
            {post.caption}
          </div>

          {/* comentários */}
          <div className="px-3 py-3 text-sm">
            {post.comments.map((c: any) => (
              <p key={c.id}>
                <span className="font-semibold mr-2">{c.username}</span>
                {c.content}
              </p>
            ))}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const content = String(new FormData(form).get("content") ?? "");
                if (!content.trim()) return;
                addComment({ postId: post.id, content });
                form.reset();
              }}
              className="flex gap-2 mt-2"
            >
              <input
                name="content"
                placeholder="Adicione um comentário..."
                className="flex-1 border rounded p-1"
              />
              <button type="submit" className="text-primary">
                Publicar
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
