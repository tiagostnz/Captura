import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // 1) checa login — a API responde com STATUS (401), não redireciona
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }

  const me = await db("users").where({ email: session.user.email }).first();

  // 2) lê o corpo do pedido (o front vai mandar { post_id })
  const { post_id } = await request.json();

  // 3) toggle: já curti esse post? apaga. senão, cria.
  const existing = await db("likes")
    .where({ user_id: me.id, post_id })
    .first();

  if (existing) {
    await db("likes").where({ id: existing.id }).del();
  } else {
    await db("likes").insert({ user_id: me.id, post_id });
  }

  return NextResponse.json({ ok: true });
}
