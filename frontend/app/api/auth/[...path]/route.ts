import {
  NextRequest,
  NextResponse,
} from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "http://localhost:5000";

async function proxy(
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

    const target =
      `${BACKEND_URL}/api/auth/${path.join("/")}`;

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

    const session =
      request.cookies.get(
        "hirebuilders_token"
      )?.value;

    if (session) {
      headers.set(
        "authorization",
        `Bearer ${session}`
      );
    }

    let body:
      | ArrayBuffer
      | undefined;

    if (
      request.method !== "GET" &&
      request.method !== "HEAD"
    ) {
      body =
        await request.arrayBuffer();
    }

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

    const contentTypeResponse =
      backendResponse.headers.get(
        "content-type"
      );

    const bodyResponse =
      await backendResponse.arrayBuffer();

    const response =
      new NextResponse(
        bodyResponse,
        {
          status:
            backendResponse.status,
        }
      );

    if (contentTypeResponse) {
      response.headers.set(
        "content-type",
        contentTypeResponse
      );
    }

    if (
      path.join("/") ===
        "login" ||
      path.join("/") ===
        "register"
    ) {
      try {
        const json =
          JSON.parse(
            new TextDecoder().decode(
              bodyResponse
            )
          );

        if (json?.token) {
          response.cookies.set(
            "hirebuilders_token",
            json.token,
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

          return NextResponse.json(
            {
              success:
                json.success,
              message:
                json.message,
              user:
                json.user,
              redirect:
                json.redirect,
            },
            {
              status:
                backendResponse.status,
              headers: {
                "Content-Type":
                  "application/json",
              },
            }
          );
        }
      } catch {
        // Réponse non JSON : on la laisse passer.
      }
    }

    if (
      path.join("/") ===
      "logout"
    ) {
      response.cookies.set(
        "hirebuilders_token",
        "",
        {
          httpOnly: true,
          secure:
            process.env.NODE_ENV ===
            "production",
          sameSite: "lax",
          expires:
            new Date(0),
          maxAge: 0,
          path: "/",
        }
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

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) {
  return proxy(
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
  return proxy(
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
  return proxy(
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
  return proxy(
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
  return proxy(
    request,
    context
  );
}