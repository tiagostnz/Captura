import { useQuery } from "@tanstack/react-query";

export function useProfile(username: string) {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const res = await fetch(`/api/perfil/${username}`);
      if (!res.ok) throw new Error("Falha ao buscar perfil");
      return res.json();
    },
  });
}
