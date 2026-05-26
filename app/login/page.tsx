import { signIn } from "@/auth";

async function login(formData: FormData) {
  "use server";

  await signIn("credentials", {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    redirectTo: "/",
  });
}

export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <form action={login}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Senha" required />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
