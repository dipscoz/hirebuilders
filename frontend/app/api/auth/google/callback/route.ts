import {
  NextRequest,
  NextResponse,
} from "next/server";

import jwt from "jsonwebtoken";

const GOOGLE_HANDOFF_SECRET =
  process.env.GOOGLE_HANDOFF_SECRET ||
  process.env.JWT_SECRET;

export async function GET(
  request: NextRequest
) {
  try {
    if (
      !GOOGLE_HANDOFF_SECRET
    ) {
      return NextResponse.redirect(
        new URL(
          "/connexion?error=google_config",
          request.url
        )
      );
    }

    const token =
      request.nextUrl.searchParams.get(
        "token"
      );

    const redirectParam =
      request.nextUrl.searchParams.get(
        "redirect"
      ) || "/";

    if (!token) {
      return NextResponse.redirect(
        new URL(
          "/connexion?error=google_missing_token",
          request.url
        )
      );
    }

    let decoded: jwt.JwtPayload;

    try {
      decoded =
        jwt.verify(
          token,
          GOOGLE_HANDOFF_SECRET
        ) as jwt.JwtPayload;
    } catch (error) {
      console.error(
        "Jeton Google invalide :",
        error
      );

      return NextResponse.redirect(
        new URL(
          "/connexion?error=google_invalid_token",
          request.url
        )
      );
    }

    if (
      decoded.type !==
      "google_handoff"
    ) {
      return NextResponse.redirect(
        new URL(
          "/connexion?error=google_invalid_token",
          request.url
        )
      );
    }

    if (!decoded.id) {
      return NextResponse.redirect(
        new URL(
          "/connexion?error=google_invalid_user",
          request.url
        )
      );
    }

    const redirect =
      redirectParam === "/admin"
        ? "/admin"
        : "/";

    const response =
      NextResponse.redirect(
        new URL(
          redirect,
          request.url
        )
      );

    // -------------------------------------------------------
    // CREATION DE LA SESSION VERCEL
    // -------------------------------------------------------

    response.cookies.set(
      "hirebuilders_token",
      createSessionToken(decoded),
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        maxAge:
          7 *
          24 *
          60 *
          60,

        path: "/",
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Erreur callback Google Vercel :",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/connexion?error=google_callback_failed",
        request.url
      )
    );
  }
}


// =========================================================
// CREATION DU JWT DE SESSION
// =========================================================
//
// Ici on crée le vrai token utilisé par /api/auth/me.
// Le secret doit être identique à celui du backend.
//

function createSessionToken(
  decoded: jwt.JwtPayload
) {
  const sessionSecret =
    process.env.JWT_SECRET ||
    GOOGLE_HANDOFF_SECRET!;

  return jwt.sign(
    {
      id: Number(
        decoded.id
      ),

      email:
        decoded.email,

      role:
        decoded.role,

      firstName:
        "",

      lastName:
        "",
    },
    sessionSecret,
    {
      expiresIn: "7d",
    }
  );
}