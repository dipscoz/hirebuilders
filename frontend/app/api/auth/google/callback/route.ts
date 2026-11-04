import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND_URL =
  (process.env.BACKEND_URL || "").trim().replace(/\/+$/, "") ||
  (process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "");

const PUBLIC_GOOGLE_ERRORS = new Set([
  "google_config",
  "google_invalid_token",
  "google_invalid_user",
  "google_missing_token",
]);

function redirectToLogin(request: NextRequest, error: string) {
  const destination = new URL("/connexion", request.url);
  destination.searchParams.set("error", error);
  return NextResponse.redirect(destination);
}

export async function GET(request: NextRequest) {
  const handoffToken = request.nextUrl.searchParams.get("token");
  if (!handoffToken) return redirectToLogin(request, "google_missing_token");

  if (!BACKEND_URL) return redirectToLogin(request, "google_config");

  try {
    // The backend verifies its own short-lived handoff token and signs the
    // actual session JWT. Vercel therefore does not need a second JWT secret.
    const exchangeResponse = await fetch(
      `${BACKEND_URL}/api/auth/google/exchange`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: handoffToken }),
        cache: "no-store",
      },
    );

    const exchange = await exchangeResponse.json().catch(() => null);
    if (!exchangeResponse.ok || typeof exchange?.token !== "string") {
      const errorCode = PUBLIC_GOOGLE_ERRORS.has(exchange?.code)
        ? exchange.code
        : "google_exchange_failed";
      return redirectToLogin(request, errorCode);
    }

    const redirectPath = exchange.redirect === "/admin" ? "/admin" : "/";
    const response = NextResponse.redirect(new URL(redirectPath, request.url));
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    response.cookies.set("hirebuilders_token", exchange.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Échange de session Google indisponible:", error);
    return redirectToLogin(request, "google_exchange_failed");
  }
}
