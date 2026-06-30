import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// apaga o post — SÓ se ele for do usuário logado (defesa contra IDOR)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }
  const me = await db("users").where({ email: session.user.email }).first();
  const { id } = await params;
  const postId = Number(id);

  // o user_id no where é a trava: se o post não for SEU, nada é apagado
  const deleted = await db("posts").where({ id: postId, user_id: me.id }).del();

  if (deleted === 0) {
    // não existe OU não é seu (não revelamos qual) → 404
    return NextResponse.json({ error: "post não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = Number(id); // o param vem como texto; converto pra número

  const session = await auth();
  const me = session?.user?.email
    ? await db("users").where({ email: session.user.email }).first()
    : null;

  // o post + autor + contagem de likes
  const post = await db("posts")
    .join("users", "posts.user_id", "users.id")
    .leftJoin("likes", "likes.post_id", "posts.id")
    .where("posts.id", postId)
    .select(
      "posts.id",
      "posts.image_url",
      "posts.caption",
      "users.username",
      "users.id as author_id",
      "users.avatar_url as author_avatar"
    )
    .count("likes.id as likes_count")
    .groupBy("posts.id", "users.username", "users.id", "users.avatar_url")
    .first();

  if (!post) {
    return NextResponse.json({ error: "post não encontrado" }, { status: 404 });
  }

  // comentários do post
  const comments = await db("comments")
    .join("users", "comments.user_id", "users.id")
    .where("comments.post_id", postId)
    .select("comments.id", "comments.content", "users.username", "users.avatar_url")
    .orderBy("comments.created_at", "asc");

  // eu curti? sigo o autor? o post é meu?
  const likedByMe = me
    ? !!(await db("likes").where({ user_id: me.id, post_id: postId }).first())
    : false;
  const followingAuthor = me
    ? !!(await db("follows").where({ follower_id: me.id, following_id: post.author_id }).first())
    : false;
  const isMine = !!me && me.id === post.author_id;

  return NextResponse.json({
    ...post,
    comments,
    liked_by_me: likedByMe,
    following_author: followingAuthor,
    is_mine: isMine,
  });
}
