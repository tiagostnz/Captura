import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


async function logout() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

async function toggleLike(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const me = await db("users").where({ email: session.user.email }).first();
  const postId = Number(formData.get("post_id"));

  const existing = await db("likes")
    .where({ user_id: me.id, post_id: postId })
    .first();

  if (existing) {
    await db("likes").where({ id: existing.id }).del();
  } else {
    await db("likes").insert({ user_id: me.id, post_id: postId });
  }

  revalidatePath("/");
}

async function addComment(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const me = await db("users").where({ email: session.user.email }).first();
  const postId = Number(formData.get("post_id"));
  const content = (formData.get("content") as string)?.trim();

  // comentário vazio? não faz nada
  if (!content) {
    return;
  }

  await db("comments").insert({
    user_id: me.id,
    post_id: postId,
    content,
  });

  revalidatePath("/");
}

async function toggleFollow(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const me = await db("users").where({ email: session.user.email }).first();
  const followingId = Number(formData.get("following_id"));

  // não dá pra seguir a si mesmo
  if (followingId === me.id) {
    return;
  }

  const existing = await db("follows")
    .where({ follower_id: me.id, following_id: followingId })
    .first();

  if (existing) {
    await db("follows").where({ id: existing.id }).del();
  } else {
    await db("follows").insert({ follower_id: me.id, following_id: followingId });
  }

  revalidatePath("/");
}

export default async function Home() {
  const session = await auth();

  // quem sou eu? (pra saber o que já curti/sigo)
  const me = session?.user?.email
    ? await db("users").where({ email: session.user.email }).first()
    : null;

  // feed: posts + username + id do autor + contagem de likes
  const posts = await db("posts")
    .join("users", "posts.user_id", "users.id")
    .leftJoin("likes", "likes.post_id", "posts.id")
    .select(
      "posts.id",
      "posts.image_url",
      "posts.caption",
      "users.username",
      "users.id as author_id"
    )
    .count("likes.id as likes_count")
    .groupBy("posts.id", "users.username", "users.id")
    .orderBy("posts.created_at", "desc");

  // ids dos posts que eu curti
  const myLikedPostIds = me
    ? await db("likes").where({ user_id: me.id }).pluck("post_id")
    : [];

  // todos os comentários (com o username de quem comentou)
  const comments = await db("comments")
    .join("users", "comments.user_id", "users.id")
    .select("comments.id", "comments.post_id", "comments.content", "users.username")
    .orderBy("comments.created_at", "asc");

  // ids das pessoas que eu sigo
  const myFollowingIds = me
    ? await db("follows").where({ follower_id: me.id }).pluck("following_id")
    : [];

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
          <p>Não logado. <a href="/login" className="text-blue-500">Fazer login</a></p>
        )}
      </div>

      {/* feed */}
      <div className="max-w-md mx-auto flex flex-col gap-6">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg overflow-hidden bg-white">
            <div className="flex items-center gap-3 p-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                {post.username[0].toUpperCase()}
              </div>
              <span className="font-semibold text-sm">{post.username}</span>

              {/* botão seguir — só aparece se NÃO for o meu próprio post */}
              {me && post.author_id !== me.id && (
                <form action={toggleFollow} className="ml-auto">
                  <input type="hidden" name="following_id" value={post.author_id} />
                  <button type="submit" className="text-blue-500 text-sm font-semibold">
                    {myFollowingIds.includes(post.author_id) ? "Seguindo" : "Seguir"}
                  </button>
                </form>
              )}
            </div>

            <img src={post.image_url} alt={post.caption} className="w-full" />

            {/* coração + contagem */}
            <div className="px-3 pt-3">
              <form action={toggleLike}>
                <input type="hidden" name="post_id" value={post.id} />
                <button type="submit" className="text-2xl leading-none">
                  {myLikedPostIds.includes(post.id) ? "❤️" : "🤍"}
                </button>
              </form>
              <p className="text-sm font-semibold mt-1">{post.likes_count} curtidas</p>
            </div>

            <div className="px-3 pt-3 text-sm">
              <span className="font-semibold mr-2">{post.username}</span>
              {post.caption}
            </div>

            {/* comentários */}
            <div className="px-3 py-3 text-sm">
              {comments
                .filter((c) => c.post_id === post.id)
                .map((c) => (
                  <p key={c.id}>
                    <span className="font-semibold mr-2">{c.username}</span>
                    {c.content}
                  </p>
                ))}

              <form action={addComment} className="flex gap-2 mt-2">
                <input type="hidden" name="post_id" value={post.id} />
                <input
                  name="content"
                  placeholder="Adicione um comentário..."
                  className="flex-1 border rounded p-1"
                />
                <button type="submit" className="text-blue-500 font-semibold">
                  Publicar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
