import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { cloudinary } from "@/lib/cloudinary";




async function createPost(formData: FormData) {
  "use server";

  //  ve quem está logado(identidade vem do servidor, não do formulário)
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  // pega o ARQUIVO e a legenda do formulário
  const file = formData.get("image") as File;
  const caption = (formData.get("caption") as string)?.trim() ?? "";

  // valida: tem arquivo? é imagem? (segurança — nunca confiar no upload)
  if (!file || file.size === 0) {
    redirect("/new?error=1");
  }
  if (!file.type.startsWith("image/")) {
    redirect("/new?error=1");
  }

  // converte o arquivo num formato que o Cloudinary aceita (data URI base64)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  // sobe pro Cloudinary e pega a URL pública da imagem
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "captura",
  });

  // acha o id do usuário logado e salva o post com a URL do Cloudinary
  const user = await db("users").where({ email: session.user.email }).first();
  await db("posts").insert({
    user_id: user.id,
    image_url: result.secure_url,
    caption,
  });

  // avisa o Next que a home mudou, e volta pro feed
  revalidatePath("/");
  redirect("/");
}

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="max-w-md mx-auto py-6">
      <h1 className="text-xl font-bold mb-4">Novo post</h1>

      {params.error && (
        <p className="text-red-500 mb-2">Escolha um arquivo de imagem válido.</p>
      )}

      <form action={createPost} className="flex flex-col gap-3">
        <input
          type="file"
          name="image"
          accept="image/*"
          required
          className="border p-2 rounded"
        />
        <textarea
          name="caption"
          placeholder="Escreva uma legenda..."
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Publicar
        </button>
      </form>

      <Link href="/" className="text-blue-500 text-sm mt-3 inline-block">
        ← voltar pro feed
      </Link>
    </div>
  );
}
