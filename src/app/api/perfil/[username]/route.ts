import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params; // o username da URL

  const user = await db("users").where({ username }).first();
  if (!user) {
    return NextResponse.json({ error: "usuário não encontrado" }, { status: 404 });
  }

  // posts desse usuário
  const posts = await db("posts")
    .where({ user_id: user.id })
    .select("id", "image_url", "caption")
    .orderBy("created_at", "desc");

  // contadores
  const followers = await db("follows").where({ following_id: user.id });
  const following = await db("follows").where({ follower_id: user.id });

  // quem está vendo o perfil
  const session = await auth();
  const me = session?.user?.email
    ? await db("users").where({ email: session.user.email }).first()
    : null;

  const isMe = !!me && me.id === user.id;
  const isFollowing = me
    ? !!(await db("follows")
        .where({ follower_id: me.id, following_id: user.id })
        .first())
    : false;

  return NextResponse.json({
    user: { id: user.id, username: user.username, name: user.name, bio: user.bio },
    posts,
    followersCount: followers.length,
    followingCount: following.length,
    isMe,
    isFollowing,
  });
}
