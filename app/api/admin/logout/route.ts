import { NextResponse } from "next/server";
import { getAdminSessionCookieName } from "@/lib/adminAuth";

const clearAdminSessionCookie = (request: Request) => {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.set({
    name: getAdminSessionCookieName(),
    value: "",
    path: "/",
    maxAge: 0,
  });
  return response;
};

export async function GET(request: Request) {
  return clearAdminSessionCookie(request);
}

export async function POST(request: Request) {
  return clearAdminSessionCookie(request);
}
