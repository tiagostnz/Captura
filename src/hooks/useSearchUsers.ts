import { useQuery } from "@tanstack/react-query";

export function useSearchUsers(q: string) {
  return useQuery({
    queryKey: ["users", "search", q],// o termo da busca entra na key, assim buscar são caches separados, e o react query até reaproveita se vc repetir uma busca
    queryFn: async () => {
      const res = await fetch(`/api/users?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("Falha na busca");
      return res.json();
    },
    enabled: q.trim().length > 0,
  });
}
