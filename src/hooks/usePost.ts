import { useQuery } from "@tanstack/react-query";

export function usePost(id: string) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${id}`);
      if (!res.ok) throw new Error("Falha ao buscar o post");
      return res.json();
    },
  });
}
