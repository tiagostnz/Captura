"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

// o schema do pedaço 1
const signupSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  username: z
    .string()
    .min(3, "O username precisa de pelo menos 3 caracteres")
    .max(50, "O username pode ter no máximo 50 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Use só letras, números e _ (sem espaços)"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "A senha precisa de pelo menos 6 caracteres"),
});

//o "formato" do que a action devolve pra tela (os erros por campo)
type SignupState = {
  errors?: {
    name?: string[];
    username?: string[];
    email?: string[];
    password?: string[];
  };
};

export async function signup(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  //valida o que veio do formulário
  const result = signupSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  //deu inválido? devolve os erros por campo e para aqui (não insere nada)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  //a partir daqui os dados são confiáveis (result.data já validado)
  const { name, username, email, password } = result.data;
  const password_hash = await bcrypt.hash(password, 10);

  //insere ainda tratando o duplicado,mas agora devolvendo o erro, não via URL
  try {
    await db("users").insert({ name, username, email, password_hash });
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "23505") {
      return { errors: { email: ["Esse email ou username já está em uso."] } };
    }
    throw error;
  }

  //tudo certo → vai pro login
  redirect("/login");
}
