import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// páginas que não exigem login
const PUBLICAS = ["/login", "/signup"]; // não dá pra exigir login de algo que faz login, se não n funciona, logo é pública

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // rota pública? deixa passar
  if (PUBLICAS.includes(pathname)) {
    return NextResponse.next();
  }

  // tem algum cookie de sessão? (nome contém "session-token")
  const temSessao = req.cookies
    .getAll()
    .some((c) => c.name.includes("session-token"));

  // se não tem 
  // manda pro login
  if (!temSessao) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // se tem 
  // segue normal
  return NextResponse.next();
}

// onde o porteiro atua (exclui api, arquivos estáticos, etc.)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
