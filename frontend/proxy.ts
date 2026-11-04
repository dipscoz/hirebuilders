import { NextRequest, NextResponse } from "next/server";

const PAUSED_PAGES = [
  "/contact",
  "/connexion",
  "/employes",
  "/inscription-employe",
  "/notifications",
  "/postuler-employe",
  "/profil",
  "/reservations",
  "/louer",
];

const PAUSED_API_ROOTS = [
  "/api/auth",
  "/api/employee-applications",
  "/api/employees",
  "/api/messages",
  "/api/notifications",
  "/api/reservations",
];

const PAUSE_MESSAGE =
  "Les inscriptions, candidatures, réservations et échanges sont temporairement suspendus pendant la finalisation des formalités et des conditions du service.";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";

  if (PAUSED_API_ROOTS.some((root) => pathname === root || pathname.startsWith(`${root}/`))) {
    return NextResponse.json(
      { success: false, message: PAUSE_MESSAGE },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": "3600",
        },
      },
    );
  }

  if (
    PAUSED_PAGES.some((root) => pathname === root || pathname.startsWith(`${root}/`)) ||
    pathname.startsWith("/louer/")
  ) {
    return NextResponse.redirect(new URL("/service-en-preparation", request.url), 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/contact/:path*",
    "/connexion/:path*",
    "/employes/:path*",
    "/inscription-employe/:path*",
    "/notifications/:path*",
    "/postuler-employe/:path*",
    "/profil/:path*",
    "/reservations/:path*",
    "/louer/:path*",
    "/api/:path*",
  ],
};
