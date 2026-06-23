import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }

  const me = await db("users").where({ email: session.user.email }).first();
  const { following_id } = await request.json();

  // não dá pra seguir a si mesmo (proteção no back também!)
  if (following_id === me.id) {
    return NextResponse.json({ error: "não pode seguir a si mesmo" }, { status: 400 });
  }

  const existing = await db("follows")
    .where({ follower_id: me.id, following_id })
    .first();

  if (existing) {
    await db("follows").where({ id: existing.id }).del();
  } else {
    await db("follows").insert({ follower_id: me.id, following_id });
  }

  return NextResponse.json({ ok: true });
}
