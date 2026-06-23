import { auth, signOut } from "@/auth";
import Link from "next/link";
import PostsFeed from "./postfeed";

async function logout() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-md mx-auto mb-6 flex justify-between items-center text-sm">
        {session ? (
          <>
            <div className="flex items-center gap-4">
              <Link href="/new" className="font-semibold">＋ Novo post</Link>
              <span>Logado como: {session.user?.name}</span>
            </div>
            <form action={logout}>
              <button type="submit" className="text-blue-500">Sair</button>
            </form>
          </>
        ) : (
          <p>Não logado. <Link href="/login" className="text-blue-500">Fazer login</Link></p>
        )}
      </div>

      <PostsFeed />
    </div>
  );
}
