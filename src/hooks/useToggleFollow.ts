import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (followingId: number) => {
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ following_id: followingId }),
      });
      if (!res.ok) throw new Error("Falha ao seguir");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] }); // invalida todos os perfis em cache, assim o contador de seguidores atualizam quando segue
    },
  });
}
