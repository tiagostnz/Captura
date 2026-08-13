import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);
      // mandando FormData: não ponho Content-Type (o navegador define sozinho)
      const res = await fetch("/api/me/avatar", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Falha ao enviar a foto");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
