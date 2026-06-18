import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    // a função que MUDA: manda o post_id pro endpoint de curtir
    mutationFn: async (postId: number) => {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId }),
      });
      if (!res.ok) throw new Error("Falha ao curtir");
      return res.json();
    },
    // deu certo? rebusca os posts pra atualizar coração/contagem
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
