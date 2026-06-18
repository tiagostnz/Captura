// o provider usa "estado do Reazct, então precisa ser client component"
"use client";

// é oq guarda o cache de todas as queries, e é oq faz a comunicação com o backend
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// basicamente isso cria o client uma vez, se a gnt escrevesse uma versão solta, ele seria reciado a cada re-render, e perderia o cache, então a gnt usa o useState pra "segurar"
import { useState } from "react";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}