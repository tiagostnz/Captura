import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";


async function logout() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export default async function Home() {
  const session = await auth();

  // feed que puxa os posts do banco, junto com os usernames
  const posts = await db("posts")
    .join("users", "posts.user_id", "users.id")
    .select("posts.id", "posts.image_url", "posts.caption", "users.username")
    .orderBy("posts.created_at", "desc");

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      {/* barra de topo: quem está logado */}
      <div className="max-w-md mx-auto mb-6 flex justify-between items-center text-sm">
        {session ? (
          <>
           <div className="flex items-center gap-4">
              <a href="/new" className="font-semibold">＋ Novo post</a>
            <span>Logado como: {session.user?.name}</span>
            </div>
            <form action={logout}>
              <button type="submit" className="text-blue-500">Sair</button>
            </form>
          </>
        ) : (
          // se n tem um login, vai aparer para logar
          <p>Não logado. <a href="/login" className="text-blue-500">Fazer login</a></p>
        )}
      </div>

      {/* feed básico de posts p teste inicial, vou mexer aqui ainda */}
      <div className="max-w-md mx-auto flex flex-col gap-6">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg overflow-hidden bg-white">
            <div className="flex items-center gap-3 p-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                {post.username[0].toUpperCase()}
              </div>
              <span className="font-semibold text-sm">{post.username}</span>
            </div>

            <img src={post.image_url} alt={post.caption} className="w-full" />

            <div className="p-3 text-sm">
              <span className="font-semibold mr-2">{post.username}</span>
              {post.caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
