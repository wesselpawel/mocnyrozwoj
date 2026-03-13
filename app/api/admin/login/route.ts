import { NextResponse } from "next/server";
import {
  buildAdminSessionToken,
  getAdminSessionCookieName,
  getAdminSessionMaxAgeSeconds,
  isAdminAuthConfigured,
  isValidAdminCredentials,
} from "@/lib/adminAuth";

export async function POST(request: Request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Admin auth is not configured. Set ADMIN_PASSWORD (and optionally ADMIN_USERNAME, ADMIN_SESSION_SECRET).",
      },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const username = typeof body?.username === "string" ? body.username : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!isValidAdminCredentials(username, password)) {
      const message =
        process.env.NODE_ENV === "development"
          ? "Niepoprawna nazwa użytkownika lub hasło. Jeśli właśnie zmieniłeś `.env.local`, zrestartuj `pnpm run dev`."
          : "Niepoprawna nazwa użytkownika lub hasło.";
      return NextResponse.json(
        { error: message },
        { status: 401 },
      );
    }

    const token = await buildAdminSessionToken();
    if (!token) {
      return NextResponse.json(
        { error: "Nie udało się utworzyć sesji administracyjnej." },
        { status: 500 },
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: getAdminSessionCookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getAdminSessionMaxAgeSeconds(),
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Nieprawidłowe dane logowania." },
      { status: 400 },
    );
  }
}
