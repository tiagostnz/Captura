import { db } from "@/lib/db";

export default async function Home() {
  const users = await db("users").select("*");

  return (
    <div>
      <h1>Usuários no banco:</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}