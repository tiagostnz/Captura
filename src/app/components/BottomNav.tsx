import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export default async function BottomNav() {
  const session = await auth();

  // sem login, não mostra a barra
  if (!session?.user?.email) {
    return null;
  }

  // pega o username pra montar o link do perfil
  const me = await db("users").where({ email: session.user.email }).first();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white">
      <div className="max-w-md mx-auto flex justify-around items-center h-14 text-2xl">
        <Link href="/" aria-label="Feed">🏠</Link>
        <Link href="/new" aria-label="Novo post">➕</Link>
        <Link href={`/perfil/${me.username}`} aria-label="Perfil">👤</Link>
      </div>
    </nav>
  );
}
