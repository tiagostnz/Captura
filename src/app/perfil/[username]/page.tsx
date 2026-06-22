"use client";

import { use } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useToggleFollow } from "@/hooks/useToggleFollow";

export default function PerfilPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params); // "abre" a Promise do params no cliente
  const { data, isLoading, error } = useProfile(username);
  const { mutate: toggleFollow } = useToggleFollow();

  if (isLoading) return <p className="text-center py-6">Carregando...</p>;
  if (error || !data) return <p className="text-center py-6">Perfil não encontrado.</p>;

  const { user, posts, followersCount, followingCount, isMe, isFollowing } = data;

  return (
    <div className="max-w-md mx-auto py-6">
      {/* cabeçalho do perfil */}
      <div className="flex items-center gap-4 mb-6 px-3">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-semibold">
          {user.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold">@{user.username}</h1>
          <p className="text-sm">{user.name}</p>
          {user.bio && <p className="text-sm text-gray-600">{user.bio}</p>}

          {/* contadores */}
          <div className="flex gap-4 mt-2 text-sm">
            <span><strong>{posts.length}</strong> posts</span>
            <span><strong>{followersCount}</strong> seguidores</span>
            <span><strong>{followingCount}</strong> seguindo</span>
          </div>

          {/* botão seguir — só se não for meu próprio perfil */}
          {!isMe && (
            <button
              onClick={() => toggleFollow(user.id)}
              className="mt-2 text-sm font-semibold text-white bg-blue-500 px-4 py-1 rounded"
            >
              {isFollowing ? "Seguindo" : "Seguir"}
            </button>
          )}
        </div>
      </div>

      {/* grade de posts (3 colunas) */}
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post: any) => (
          <img
            key={post.id}
            src={post.image_url}
            alt={post.caption}
            className="w-full aspect-square object-cover"
          />
        ))}
      </div>
    </div>
  );
}
