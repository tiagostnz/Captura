"use client";

import { useState } from "react";
import Link from "next/link";
import Avatar from "@/app/components/Avatar";
import { useSearchUsers } from "@/hooks/useSearchUsers";
import { Loader } from "@/components/ui/loader";

export default function BuscarPage() {
  const [q, setQ] = useState("");
  const { data: users, isLoading } = useSearchUsers(q);

  return (
    <div className="max-w-md mx-auto py-6 px-4">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar usuários..."
        className="w-full border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="mt-4 flex flex-col gap-2">
        {isLoading && (
          <div className="flex justify-center py-4 text-primary">
            <Loader />
          </div>
        )}

        {users?.map((user) => (
          <Link
            key={user.id}
            href={`/perfil/${user.username}`}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary"
          >
            <Avatar src={user.avatar_url} name={user.username} size={40} />
            <div>
              <p className="font-semibold text-sm">@{user.username}</p>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>
          </Link>
        ))}

        {q.trim() && !isLoading && users?.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum usuário encontrado.</p>
        )}
      </div>
    </div>
  );
}
