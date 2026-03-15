import { NextRequest, NextResponse } from "next/server";
import {
  getAdminSessionCookieName,
  isAdminAuthConfigured,
  isValidAdminSessionToken,
} from "@/lib/adminAuth";

const ADMIN_LOGIN_PATH = "/admin/login";

/** 301: /blog/post/{programmatic-diet-slug} → /dieta/{slug} */
const PROGRAMMATIC_DIET_REGEX =
  /^\/blog\/post\/(dieta-na-mase-\d+-kcal-jadlospis-\d+-posil(?:ki|kow)|dieta-redukcyjna-\d+-kcal-jadlospis-\d+-posil(?:ki|kow)|dieta-\d+-kcal-utrzymanie-wagi-jadlospis-\d+-posil(?:ki|kow))$/;

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const dietMatch = pathname.match(PROGRAMMATIC_DIET_REGEX);
  if (dietMatch) {
    const slug = dietMatch[1];
    const url = request.nextUrl.clone();
    url.pathname = `/dieta/${slug}`;
    return NextResponse.redirect(url, 301);
  }

  const isAdminRoute = pathname.startsWith("/admin");
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  if (!isAdminAuthConfigured()) {
    if (pathname === ADMIN_LOGIN_PATH) {
      return NextResponse.next();
    }

    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
    loginUrl.searchParams.set("error", "config");
    return NextResponse.redirect(loginUrl);
  }

  const cookieToken = request.cookies.get(getAdminSessionCookieName())?.value;
  const isLoggedIn = await isValidAdminSessionToken(cookieToken);

  if (pathname === ADMIN_LOGIN_PATH) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
    const nextPath = `${pathname}${search}`;
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/blog/post/dieta-na-mase-:path*",
    "/blog/post/dieta-redukcyjna-:path*",
    "/blog/post/dieta-:path*",
  ],
};
