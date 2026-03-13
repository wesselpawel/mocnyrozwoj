import { NextRequest, NextResponse } from "next/server";
import {
  getAdminSessionCookieName,
  isAdminAuthConfigured,
  isValidAdminSessionToken,
} from "@/lib/adminAuth";

const ADMIN_LOGIN_PATH = "/admin/login";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
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
  matcher: ["/admin/:path*"],
};
