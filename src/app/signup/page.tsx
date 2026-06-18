"use client";

import { useActionState } from "react";
import { signup } from "./actions";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, {});

  return (
    <div>
      <h1>Criar conta</h1>

      <form action={formAction}>
        <input name="name" placeholder="Nome" required />
        {state.errors?.name && (
          <p style={{ color: "red" }}>{state.errors.name[0]}</p>
        )}

        <input name="username" placeholder="@username" required />
        {state.errors?.username && (
          <p style={{ color: "red" }}>{state.errors.username[0]}</p>
        )}

        <input name="email" type="email" placeholder="Email" required />
        {state.errors?.email && (
          <p style={{ color: "red" }}>{state.errors.email[0]}</p>
        )}

        <input name="password" type="password" placeholder="Senha" required />
        {state.errors?.password && (
          <p style={{ color: "red" }}>{state.errors.password[0]}</p>
        )}

        <button type="submit" disabled={isPending}>
          {isPending ? "Criando..." : "Criar conta"}
        </button>
      </form>
    </div>
  );
}
