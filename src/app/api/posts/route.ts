import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const posts = await db("posts")
    .join("users", "posts.user_id", "users.id")
    .select(
        "posts.id",
        "posts.image_url",
        "posts.caption",
        "users.username",
        "users.id as author_id",
    )
    .orderBy("posts.created_at", "desc");
    // transforma a lista nun json de resposta http
    return NextResponse.json(posts);
}