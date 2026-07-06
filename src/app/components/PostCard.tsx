"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import Avatar from "@/app/components/Avatar";
import { useToggleLike } from "@/hooks/useToggleLike";
import { useAddComment } from "@/hooks/useAddComment";
import { useToggleFollow } from "@/hooks/useToggleFollow";
import { useDeletePost } from "@/hooks/useDeletePost";

export default function PostCard({
  post,
  onDeleted,
}: {
  post: any;
  onDeleted?: () => void; // o detalhe passa um redirect; o feed não passa nada
}) {
  const { mutate: toggleLike } = useToggleLike();
  const { mutate: addComment } = useAddComment();
  const { mutate: toggleFollow } = useToggleFollow();
  const { mutate: deletePost } = useDeletePost();

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      {/* autor + (seguir / excluir) */}
      <div className="flex items-center p-3">
        <Link href={`/perfil/${post.username}`} className="flex items-center gap-3">
          <Avatar src={post.author_avatar} name={post.username} size={32} />
          <span className="font-semibold text-sm hover:underline">{post.username}</span>
        </Link>

        {post.is_mine ? (
          <button
            onClick={() => {
              if (confirm("Excluir este post?")) {
                deletePost(post.id, { onSuccess: onDeleted });
              }
            }}
            className="ml-auto text-destructive text-sm font-semibold"
          >
            Excluir
          </button>
        ) : (
          <button
            onClick={() => toggleFollow(post.author_id)}
            className="ml-auto text-primary text-sm font-semibold"
          >
            {post.following_author ? "Seguindo" : "Seguir"}
          </button>
        )}
      </div>

      <Image src={post.image_url} alt={post.caption} width={400} height={400} className="w-full" />

      {/* like + contagem */}
      <div className="px-3 pt-3">
        <button onClick={() => toggleLike(post.id)} aria-label="Curtir">
          <Heart className={post.liked_by_me ? "w-6 h-6 fill-primary text-primary" : "w-6 h-6"} />
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
          <button type="submit" className="text-primary font-semibold">
            Publicar
          </button>
        </form>
      </div>
    </div>
  );
}
