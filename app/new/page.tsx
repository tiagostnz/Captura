import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import Link from "next/link";


const postSchema = z.object({
  image_url: z.url("Cole um link de imagem válido"),
  caption: z.string().max(2200, "Legenda muito longa"),
});

async function createPost(formData: FormData) {
  "use server";

  //  ve quem está logado(identidade vem do servidor, não do formulário)
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  // valida o que veio do form
  const result = postSchema.safeParse({
    image_url: formData.get("image_url"),
    caption: formData.get("caption"),
  });
  if (!result.success) {
    redirect("/new?error=1");
  }

  // acha o id do usuário logado pelo email
  const user = await db("users").where({ email: session.user.email }).first();

  // insere o post atribuído a esse usuário
  await db("posts").insert({
    user_id: user.id,
    image_url: result.data.image_url,
    caption: result.data.caption,
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
        <p className="text-red-500 mb-2">Cole um link de imagem válido.</p>
      )}

      <form action={createPost} className="flex flex-col gap-3">
        <input
          name="image_url"
          placeholder="URL da imagem (https://...)"
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
