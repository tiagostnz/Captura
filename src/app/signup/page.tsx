"use client";

import { useActionState } from "react";
import { signup } from "./actions";
import Link from "next/link";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, {});

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <h1 className="font-brand text-5xl text-center mb-6">Captura</h1>

        <div className="bg-card border rounded-lg p-6">
          <form action={formAction} className="flex flex-col gap-3">
            <div>
              <input
                name="name"
                placeholder="Nome"
                required
                className="w-full border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {state.errors?.name && (
                <p className="text-destructive text-xs mt-1">{state.errors.name[0]}</p>
              )}
            </div>

            <div>
              <input
                name="username"
                placeholder="@username"
                required
                className="w-full border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {state.errors?.username && (
                <p className="text-destructive text-xs mt-1">{state.errors.username[0]}</p>
              )}
            </div>

            <div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="w-full border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {state.errors?.email && (
                <p className="text-destructive text-xs mt-1">{state.errors.email[0]}</p>
              )}
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="Senha"
                required
                className="w-full border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {state.errors?.password && (
                <p className="text-destructive text-xs mt-1">{state.errors.password[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="bg-primary text-primary-foreground rounded-md py-2 font-semibold disabled:opacity-60"
            >
              {isPending ? "Criando..." : "Criar conta"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Já tem conta?{" "}
          <Link href="/login" className="text-primary font-semibold">Entrar</Link>
        </p>
      </div>
    </div>
  );
}