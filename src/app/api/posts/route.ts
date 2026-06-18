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
    )
    .count("likes.id as likes_count")
    .groupBy("posts.id", "users.username", "users.id")
    .orderBy("posts.created_at", "desc");

    const myLikedPostsId = me
    ? await db("likes").where("user_id", me.id).pluck("post_id")
    : [];
    const postsComLike = posts.map((post) => ({
        ...post,
        liked_by_me: myLikedPostsId.includes(post.id),
    }));
    // transforma a lista nun json de resposta http
    return NextResponse.json(postsComLike);
}