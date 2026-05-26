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

  await db("users").insert({
    name,
    username,
    email,
    password_hash,
  });

  redirect("/login");
}

export default function SignupPage() {
  return (
    <div>
      <h1>Criar conta</h1>
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
