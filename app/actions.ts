"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function toggleFollow(formData: FormData) {
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

  // atualiza o feed e as páginas de perfil
  revalidatePath("/");
  revalidatePath("/perfil/[username]", "page");
}
