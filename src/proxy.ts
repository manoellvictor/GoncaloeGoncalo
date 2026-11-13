import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy (o antigo middleware) do painel /admin:
 *
 * - renova a sessão do Supabase a cada requisição (cookies);
 * - sem sessão, manda para /admin/login, guardando a página pedida;
 * - marca todas as respostas do painel como noindex e sem cache.
 *
 * É só a primeira triagem: páginas e server actions conferem de novo, no
 * servidor, se a conta é a do escritório (exigirEscritorio).
 */

/** Telas que precisam abrir sem login. */
const PUBLICAS = ["/admin/login", "/admin/esqueci-senha", "/admin/auth/callback"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet, headers) => {
          for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
          for (const [key, value] of Object.entries(headers)) {
            response.headers.set(key, value);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const publica = PUBLICAS.some((rota) => pathname.startsWith(rota));

  if (!user && !publica) {
    const login = request.nextUrl.clone();
    login.pathname = "/admin/login";
    login.search = "";
    login.searchParams.set("proximo", pathname + request.nextUrl.search);
    const redirect = NextResponse.redirect(login);
    redirect.headers.set("X-Robots-Tag", "noindex, nofollow");
    return redirect;
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
