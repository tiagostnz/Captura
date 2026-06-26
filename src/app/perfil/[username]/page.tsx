"use client";

import { use } from "react";
import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import { useToggleFollow } from "@/hooks/useToggleFollow";
import Image from "next/image";
import Avatar from "@/app/components/Avatar";

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
        <Avatar src={user.avatar_url} name={user.username} size={80} />
        <div>
          <h1 className="text-xl font-bold">@{user.username}</h1>
          <p className="text-sm">{user.name}</p>
          {user.bio && <p className="text-sm text-muted-foreground">{user.bio}</p>}

          {/* contadores */}
          <div className="flex gap-4 mt-2 text-sm">
            <span><strong>{posts.length}</strong> posts</span>
            <span><strong>{followersCount}</strong> seguidores</span>
            <span><strong>{followingCount}</strong> seguindo</span>
          </div>

          {/* meu perfil → Editar; perfil de outro → Seguir */}
          {isMe ? (
            <Link
              href="/profile-edit"
              className="mt-2 inline-block text-sm font-semibold border px-4 py-1 rounded hover:bg-secondary"
            >
              Editar perfil
            </Link>
          ) : (
            <button
              onClick={() => toggleFollow(user.id)}
              className="mt-2 text-sm font-semibold text-primary-foreground bg-primary px-4 py-1 rounded"
            >
              {isFollowing ? "Seguindo" : "Seguir"}
            </button>
          )}
        </div>
      </div>

      {/* grade de posts (3 colunas) */}
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post: any) => (
          <Link key={post.id} href={`/post/${post.id}`}>
            <Image
              src={post.image_url}
              alt={post.caption}
              className="w-full aspect-square object-cover"
              width={300}
              height={300}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
