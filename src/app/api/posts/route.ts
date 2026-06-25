import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    const me = session?.user?.email
      ? await db("users").where({ email: session.user.email }).first()
      : null;

    const posts = await db("posts")
    .join("users", "posts.user_id", "users.id")
    .leftJoin("likes", "likes.post_id", "posts.id")
    .select(
        "posts.id",
        "posts.image_url",
        "posts.caption",
        "users.username",
        "users.id as author_id",
        "users.avatar_url as author_avatar",
    )
    .count("likes.id as likes_count")
    .groupBy("posts.id", "users.username", "users.id", "users.avatar_url")
    .orderBy("posts.created_at", "desc");

    const myLikedPostsId = me
    ? await db("likes").where("user_id", me.id).pluck("post_id")
    : [];

    // ids das pessoas que EU sigo
    const myFollowingIds = me
      ? await db("follows").where({ follower_id: me.id }).pluck("following_id")
      : [];

    // todos os comentários, com o username de quem comentou
    const comments = await db("comments")
      .join("users", "comments.user_id", "users.id")
      .select("comments.id", "comments.post_id", "comments.content", "users.username")
      .orderBy("comments.created_at", "asc");

    // monta cada post com: liked_by_me + a lista de comentários daquele post
    const postsFinal = posts.map((post) => ({
        ...post,
        liked_by_me: myLikedPostsId.includes(post.id),
        comments: comments.filter((c) => c.post_id === post.id),
        following_author: myFollowingIds.includes(post.author_id),
        is_mine: me ? post.author_id === me.id : false,
    }));
    // transforma a lista nun json de resposta http
    return NextResponse.json(postsFinal);
}