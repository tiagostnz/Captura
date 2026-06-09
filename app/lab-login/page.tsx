import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

// ⚠️⚠️⚠️ LABORATÓRIO — CÓDIGO VULNERÁVEL DE PROPÓSITO ⚠️⚠️⚠️
// NUNCA escreva login assim na vida real. Isto existe só pra estudar o ataque.
async function labLogin(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // busca o usuário só pelo EMAIL (Knex parametriza — sem risco de injection)
  const user = await db("users").where({ email }).first();

  // não existe, ou é conta sem senha (ex: login via Google)?
  if (!user || !user.password_hash) {
    redirect("/lab-login?result=fail");
  }

  // compara a senha digitada com o HASH guardado (bcrypt re-embaralha e confere)
  const senhaOk = await bcrypt.compare(password, user.password_hash);

  if (!senhaOk) {
    redirect("/lab-login?result=fail");
  }

  // passou em tudo → sucesso
  redirect(`/lab-login?result=ok&user=${user.username}`);
}

export default async function LabLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ result?: string; user?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="max-w-md mx-auto py-6 px-3">
      <h1 className="text-xl font-bold mb-1">🧪 Lab Login (VULNERÁVEL)</h1>
      <p className="text-sm text-gray-600 mb-4">
        Login inseguro de propósito — laboratório de SQL injection.
      </p>

      {params.result === "ok" && (
        <p className="text-green-600 mb-2">✅ Entrou como: {params.user}</p>
      )}
      {params.result === "fail" && (
        <p className="text-red-500 mb-2">❌ Login falhou.</p>
      )}

      <form action={labLogin} className="flex flex-col gap-3">
        <input name="email" placeholder="Email" className="border p-2 rounded" />
        <input name="password" placeholder="Senha" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  );
}
