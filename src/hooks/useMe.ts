import { useQuery } from "@tanstack/react-query";
import type { Me } from "@/types";

export function useMe() {
  return useQuery<Me>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("/api/me");
      if (!res.ok) throw new Error("Falha ao buscar seus dados");
      return res.json();
    },
  });
}
