import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import Google from "next-auth/providers/google";

// esse bloco chama a função NextAuth que devolve um objeto com 4 funções e exporta todas de uma vez usando destructuring assignment, ou seja, pega as 4 funções do objeto e exporta cada uma com seu nome, pra usar em outras partes do app
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
  credentials: {
    email: {},
    password: {},
  },

//basicamente procura na tabela users alguém com aquele email
  async authorize(credentials) {
    const user = await db("users")
      .where({ email: credentials.email as string })
      .first();

    if (!user) return null;
// o bcrpt.compare pega a senha que o usuário digitou e compara com a senha criptografada que tá no banco de dados, devolve true se for igual ou false se for diferente
    const senhaOk = await bcrypt.compare(
      credentials.password as string,
      user.password_hash
    );

    if (!senhaOk) return null;
// se ambos estivem ok, devolve um objeto com as informações do usuário
    return {
      id: String(user.id),
      email: user.email,
      name: user.name,
    };
  },
}),
  ],
});
