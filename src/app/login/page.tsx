import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

async function login(formData: FormData) {
  "use server";

  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=1");
    }
    throw error;
  }
}

async function loginGoogle() {
  "use server";
  await signIn("google", { redirectTo: "/" });
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

    return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-brand text-5xl text-center mb-6">Captura</h1>

        <div className="bg-card border rounded-lg p-6 flex flex-col gap-4">
          {params.error && (
            <p className="text-destructive text-sm text-center">
              Email ou senha inválidos.
            </p>
          )}

          <form action={login} className="flex flex-col gap-3">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              name="password"
              type="password"
              placeholder="Senha"
              required
              className="border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground rounded-md py-2 font-semibold"
            >
              Entrar
            </button>
          </form>

          {/* divisor "ou" */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 border-t" />
            ou
            <div className="flex-1 border-t" />
          </div>

          <form action={loginGoogle}>
            <button
              type="submit"
              className="w-full border rounded-md py-2 font-semibold hover:bg-secondary"
            >
              Entrar com Google
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Não tem conta?{" "}
          <Link href="/signup" className="text-primary font-semibold">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )};
