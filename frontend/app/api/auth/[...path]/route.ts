import {
  NextRequest,
  NextResponse,
} from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "http://localhost:5000";


// =========================================================
// PROXY AUTHENTIFICATION
// =========================================================

async function proxyAuth(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  try {
    const { path } =
      await context.params;

    const route =
      path.join("/");

    const target =
      `${BACKEND_URL}/api/auth/${route}`;


    // =======================================================
    // HEADERS
    // =======================================================

    const headers =
      new Headers();

    const contentType =
      request.headers.get(
        "content-type"
      );

    if (contentType) {
      headers.set(
        "content-type",
        contentType
      );
    }


    // Cookie stocké sur le domaine frontend
    const token =
      request.cookies.get(
        "hirebuilders_token"
      )?.value;

    if (token) {
      headers.set(
        "Authorization",
        `Bearer ${token}`
      );
    }


    // =======================================================
    // BODY
    // =======================================================

    let body:
      | ArrayBuffer
      | undefined =
      undefined;

    if (
      request.method !== "GET" &&
      request.method !== "HEAD"
    ) {
      body =
        await request.arrayBuffer();
    }


    // =======================================================
    // APPEL BACKEND
    // =======================================================

    const backendResponse =
      await fetch(
        target,
        {
          method:
            request.method,

          headers,

          body,

          redirect:
            "manual",

          cache:
            "no-store",
        }
      );


    // =======================================================
    // GOOGLE : VRAIE REDIRECTION
    // =======================================================

    if (
      route === "google" &&
      backendResponse.status >=
        300 &&
      backendResponse.status <
        400
    ) {
      const location =
        backendResponse.headers.get(
          "location"
        );

      if (!location) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Google n'a pas fourni d'URL de redirection.",
          },
          {
            status: 502,
          }
        );
      }

      return NextResponse.redirect(
        location,
        backendResponse.status
      );
    }


    // =======================================================
    // GOOGLE CALLBACK
    // =======================================================

    if (
      route ===
      "google/callback"
    ) {
      // Le backend peut rediriger
      // vers Vercel après authentification.
      const location =
        backendResponse.headers.get(
          "location"
        );

      if (
        location &&
        backendResponse.status >=
          300 &&
        backendResponse.status <
          400
      ) {
        const response =
          NextResponse.redirect(
            location,
            backendResponse.status
          );

        return response;
      }
    }


    // =======================================================
    // LOGIN / REGISTER
    // =======================================================

    if (
      route === "login" ||
      route === "register"
    ) {
      const data =
        await backendResponse
          .json()
          .catch(
            () => null
          );


      if (!backendResponse.ok) {
        return NextResponse.json(
          data || {
            success: false,
            message:
              "Erreur d'authentification.",
          },
          {
            status:
              backendResponse.status,
          }
        );
      }


      const response =
        NextResponse.json(
          {
            success:
              data?.success,

            message:
              data?.message,

            user:
              data?.user,

            redirect:
              data?.redirect,
          },
          {
            status:
              backendResponse.status,
          }
        );


      // Cookie de session sur Vercel
      if (data?.token) {
        response.cookies.set(
          "hirebuilders_token",
          data.token,
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
      }


      return response;
    }


    // =======================================================
    // ME
    // =======================================================

    if (
      route === "me"
    ) {
      const data =
        await backendResponse
          .json()
          .catch(
            () => null
          );

      return NextResponse.json(
        data || {
          success: false,
          message:
            "Session invalide.",
        },
        {
          status:
            backendResponse.status,
        }
      );
    }


    // =======================================================
    // LOGOUT
    // =======================================================

    if (
      route === "logout"
    ) {
      const data =
        await backendResponse
          .json()
          .catch(
            () => null
          );

      const response =
        NextResponse.json(
          data || {
            success: true,
          },
          {
            status:
              backendResponse.status,
          }
        );

      response.cookies.set(
        "hirebuilders_token",
        "",
        {
          httpOnly: true,

          secure:
            process.env.NODE_ENV ===
            "production",

          sameSite:
            "lax",

          maxAge: 0,

          expires:
            new Date(0),

          path: "/",
        }
      );

      return response;
    }


    // =======================================================
    // AUTRES ROUTES
    // =======================================================

    const responseBody =
      await backendResponse
        .arrayBuffer();

    const response =
      new NextResponse(
        responseBody,
        {
          status:
            backendResponse.status,
        }
      );


    const responseType =
      backendResponse.headers.get(
        "content-type"
      );

    if (responseType) {
      response.headers.set(
        "content-type",
        responseType
      );
    }


    return response;

  } catch (error) {
    console.error(
      "Erreur proxy auth :",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Serveur HireBuilders inaccessible.",
      },
      {
        status: 503,
      }
    );
  }
}


// =========================================================
// HTTP METHODS
// =========================================================

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  return proxyAuth(
    request,
    context
  );
}


export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  return proxyAuth(
    request,
    context
  );
}


export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  return proxyAuth(
    request,
    context
  );
}


export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  return proxyAuth(
    request,
    context
  );
}


export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  return proxyAuth(
    request,
    context
  );
}