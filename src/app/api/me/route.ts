import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// dados do usuário logado (pra pré-preencher o formulário de edição)
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }
  const me = await db("users")
    .where({ email: session.user.email })
    .select("id", "username", "name", "bio", "avatar_url")
    .first();
  return NextResponse.json(me);
}

// atualiza bio + username do usuário logado
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }
  const me = await db("users").where({ email: session.user.email }).first();
  const { username, bio } = await request.json();

  const novoUsername = (username ?? "").trim();
  if (novoUsername.length < 3) {
    return NextResponse.json({ error: "username muito curto" }, { status: 400 });
  }

  try {
    await db("users").where({ id: me.id }).update({
      username: novoUsername,
      bio: (bio ?? "").trim(),
    });
  } catch (error) {
    // username já existe? (a coluna é unique → erro 23505 do Postgres)
    const code = (error as { code?: string }).code;
    if (code === "23505") {
      return NextResponse.json({ error: "username já está em uso" }, { status: 409 });
    }
    throw error;
  }

  return NextResponse.json({ ok: true });
}
