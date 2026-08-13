import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // lê o ?q= da URL
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  // busca vazia → devolve lista vazia (não traz todo mundo)
  if (!q) {
    return NextResponse.json([]);
  }

  // procura o name ou username que contenha qualquer parte do nome ou username pesquisado (case insensitive)
  const users = await db("users")
    .where("username", "ilike", `%${q}%`)// é oq ignora maiúsculas e minúsculas, e o % é tipo um curinga, então se pesquisar ti pode aparecer Tiago ou TIGAS ou qualquer coisa do tipo
    .orWhere("name", "ilike", `%${q}%`)
    .select("id", "username", "name", "avatar_url")
    .limit(20);

  return NextResponse.json(users);
}
