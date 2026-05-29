import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

async function signup(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const password_hash = await bcrypt.hash(password, 10);

  try {
    await db("users").insert({
      name,
      username,
      email,
      password_hash,
    });
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "23505") {
      redirect("/signup?error=duplicado");
    }

    throw error;
  }

  redirect("/login");
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  
  return (
    <div>
      <h1>Criar conta</h1>

      {params.error === "duplicado" && (
        <p style={{ color: "red" }}>Esse email ou username já está em uso.</p>
      )}
      <form action={signup}>
        <input name="name" placeholder="Nome" required />
        <input name="username" placeholder="@username" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Senha" required />
        <button type="submit">Criar conta</button>
      </form>
    </div>
  );
}
