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

const BLOG_CATEGORY_TO_DIETA_SECTION: Record<string, string> = {
  "dieta-na-mase": "na-mase",
  "dieta-na-redukcje": "na-redukcje",
  "dieta-na-utrzymanie-wagi": "na-utrzymanie-wagi",
  "przepisy-dietetyczne": "przepisy",
};

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/dieta/diety") {
    const url = request.nextUrl.clone();
    url.pathname = "/dieta";
    return NextResponse.redirect(url, 301);
  }

  // Legacy blog -> dieta redirects (SEO migration).
  if (pathname === "/blog") {
    const url = request.nextUrl.clone();
    url.pathname = "/dieta";
    return NextResponse.redirect(url, 301);
  }

  const blogCategoryMatch = pathname.match(/^\/blog\/([^/]+)$/);
  if (blogCategoryMatch) {
    const legacy = blogCategoryMatch[1];
    const mapped = BLOG_CATEGORY_TO_DIETA_SECTION[legacy] ?? legacy;
    const url = request.nextUrl.clone();
    url.pathname = `/dieta/${mapped}`;
    return NextResponse.redirect(url, 301);
  }

  const blogPostMatch = pathname.match(/^\/blog\/post\/([^/]+)$/);
  if (blogPostMatch) {
    const slug = blogPostMatch[1];
    const url = request.nextUrl.clone();
    url.pathname = `/dieta/post/${slug}`;
    return NextResponse.redirect(url, 301);
  }

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
    "/dieta/diety",
    "/blog",
    "/blog/:path*",
    "/blog/post/dieta-na-mase-:path*",
    "/blog/post/dieta-redukcyjna-:path*",
    "/blog/post/dieta-:path*",
  ],
};
