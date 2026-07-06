import { useQuery } from "@tanstack/react-query";
import type { Post } from "@/types";

export function usePost(id: string) {
  return useQuery<Post>({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${id}`);
      if (!res.ok) throw new Error("Falha ao buscar o post");
      return res.json();
    },
  });
}
