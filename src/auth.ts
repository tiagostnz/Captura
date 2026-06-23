import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

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
        // se o user não tem password_hash, é porque só tem login via Google
        if (!user.password_hash) return null;

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

  // callbacks rodam em momentos especificos do fluxo. Aqui usamos o signIn pra salvar o user do Google na tabela users (quando logar pela primeira vez)
  callbacks: {
    async signIn({ user, account }) {
      // só faz essa logica se o login foi via Google (no Credentials o user já vem da tabela)
      if (account?.provider === "google") {
        const existing = await db("users")
          .where({ email: user.email! })
          .first();

        // primeira vez? insere o user (sem password_hash — agora ele aceita NULL)
        if (!existing) {
          await db("users").insert({
            email: user.email!,
            name: user.name!,
            username: user.email!.split("@")[0],
            avatar_url: user.image,
          });
        }
      }
      return true; // libera o login
    },
  },
});
