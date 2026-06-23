import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // checa login (mesma coisa do likes)
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }

  const me = await db("users").where({ email: session.user.email }).first();

  // agora o corpo traz post_id E content
  const { post_id, content } = await request.json();

  // valida: comentário vazio? responde 400 (pedido inválido)
  const texto = content?.trim();
  if (!texto) {
    return NextResponse.json({ error: "comentário vazio" }, { status: 400 });
  }

  await db("comments").insert({
    user_id: me.id,
    post_id,
    content: texto,
  });

  return NextResponse.json({ ok: true });
}
