import { auth } from "@/auth";
import { db } from "@/lib/db";
import { cloudinary } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }

  // aqui o corpo é um arquivo
  const formData = await request.formData();
  const file = formData.get("avatar") as File;

  if (!file || file.size === 0 || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "imagem inválida" }, { status: 400 });
  }

  // mesmo padrão de criar post
  const bytes = await file.arrayBuffer();
  const dataUri = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, { folder: "captura/avatars" });

  const me = await db("users").where({ email: session.user.email }).first();
  await db("users").where({ id: me.id }).update({ avatar_url: result.secure_url });

  return NextResponse.json({ avatar_url: result.secure_url });
}
