import { useQuery } from "@tanstack/react-query";

// junta a lógica de "como buscar os posts" num lugar só
export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Falha ao buscar posts");
      return res.json();
    },
  });
}
