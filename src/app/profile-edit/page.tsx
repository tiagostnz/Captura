"use client";

import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/useMe";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useUpdateAvatar } from "@/hooks/useUpdateAvatar";

export default function EditarPerfilPage() {
  const router = useRouter();
  const { data: me, isLoading } = useMe();
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();
  const { mutate: updateAvatar, isPending: isUpdatingAvatar } = useUpdateAvatar();

  if (isLoading) return <p className="text-center py-6">Carregando...</p>;

  return (
    <div className="max-w-md mx-auto py-6 px-4">
      <h1 className="text-xl font-bold mb-4">Editar perfil</h1>

      <div className="bg-card border rounded-lg p-6">
        {error && <p className="text-destructive text-sm mb-3">{error.message}</p>}

        <div className="mb-4">
          <label className="text-sm font-semibold">Foto de perfil</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) updateAvatar(file);
            }}
            className="w-full border rounded-md p-2 text-sm mt-1 file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-3 file:py-1 file:font-semibold file:text-foreground"
          />
          {isUpdatingAvatar && (
            <p className="text-sm text-muted-foreground mt-1">Enviando foto...</p>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const username = String(form.get("username") ?? "");
            const bio = String(form.get("bio") ?? "");
            updateProfile(
              { username, bio },
              { onSuccess: () => router.push(`/perfil/${username}`) }
            );
          }}
          className="flex flex-col gap-3"
        >
          <label className="text-sm font-semibold">Username</label>
          <input
            name="username"
            defaultValue={me.username}
            className="border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <label className="text-sm font-semibold">Bio</label>
          <textarea
            name="bio"
            defaultValue={me.bio ?? ""}
            rows={3}
            className="border rounded-md px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-primary-foreground rounded-md py-2 font-semibold disabled:opacity-60"
          >
            {isPending ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </div>
    </div>
  );
}
