import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    // agora a mutation recebe DOIS dados: o post e o texto
    mutationFn: async ({ postId, content }: { postId: number; content: string }) => {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, content }),
      });
      if (!res.ok) throw new Error("Falha ao comentar");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });
}
