import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";

async function logout() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export default async function Home() {
  const session = await auth();
  const users = await db("users").select("*");
// é oq aparece quando vc loga no sistema
  return (
    <div>
      {session ? (
        <div>
          <p>Logado como: {session.user?.name} ({session.user?.email})</p>
          <form action={logout}> 
            <button type="submit">Sair</button>
          </form>
        </div>
        // é usado o ? para se caso o user não existir, mostrar que n é definido
      ) : (
        <p>
          Não logado. <a href="/login">Fazer login</a>
        </p>
      )}

      <h1>Usuários no banco:</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}
