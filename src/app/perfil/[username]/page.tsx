import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { toggleFollow } from "@/app/actions";

export default async function PerfilPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await db("users").where({ username }).first();
  if (!user) {
    notFound();
  }

  // os posts desse usuário (mais novos primeiro)
  const posts = await db("posts")
    .where({ user_id: user.id })
    .orderBy("created_at", "desc");

  // contadores: quem segue ESTE perfil, e quem ESTE perfil segue
  const followers = await db("follows").where({ following_id: user.id });
  const following = await db("follows").where({ follower_id: user.id });

  // quem está logado vendo o perfil?
  const session = await auth();
  const me = session?.user?.email
    ? await db("users").where({ email: session.user.email }).first()
    : null;

  const isMe = !!me && me.id === user.id; // estou vendo meu próprio perfil?
  const iFollow = me
    ? !!(await db("follows")
        .where({ follower_id: me.id, following_id: user.id })
        .first())
    : false;

  return (
    <div className="max-w-md mx-auto py-6">
      {/* cabeçalho do perfil */}
      <div className="flex items-center gap-4 mb-6 px-3">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-semibold">
          {user.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold">@{user.username}</h1>
          <p className="text-sm">{user.name}</p>
          {user.bio && <p className="text-sm text-gray-600">{user.bio}</p>}

          {/* contadores */}
          <div className="flex gap-4 mt-2 text-sm">
            <span><strong>{posts.length}</strong> posts</span>
            <span><strong>{followers.length}</strong> seguidores</span>
            <span><strong>{following.length}</strong> seguindo</span>
          </div>

          {/* botão seguir — só se eu estiver logado e não for meu perfil */}
          {me && !isMe && (
            <form action={toggleFollow} className="mt-2">
              <input type="hidden" name="following_id" value={user.id} />
              <button
                type="submit"
                className="text-sm font-semibold text-white bg-blue-500 px-4 py-1 rounded"
              >
                {iFollow ? "Seguindo" : "Seguir"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* grade de posts (que nem no concorrente rs, 3 colunas) */}
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <img
            key={post.id}
            src={post.image_url}
            alt={post.caption}
            className="w-full aspect-square object-cover"
          />
        ))}
      </div>
    </div>
  );
}
