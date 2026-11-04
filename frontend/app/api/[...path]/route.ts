import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_API_ROOTS = new Set([
  "employees",
  "employee-applications",
  "reservations",
  "notifications",
  "messages",
  "health",
]);

const FORWARDED_RESPONSE_HEADERS = [
  "content-type",
  "content-disposition",
  "retry-after",
  "www-authenticate",
];

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyApi(request: NextRequest, context: RouteContext) {
  try {
    const backendBase = (process.env.BACKEND_URL || "").trim().replace(/\/+$/, "");
    if (!backendBase) {
      console.error("BACKEND_URL absent dans l'environnement serveur Vercel.");
      return NextResponse.json(
        { success: false, message: "Le service API n'est pas configuré." },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }

    const { path } = await context.params;
    if (!Array.isArray(path) || path.length === 0 || !ALLOWED_API_ROOTS.has(path[0])) {
      return NextResponse.json(
        { success: false, message: "Route API introuvable." },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    // Reject traversal and malformed path segments before constructing the upstream URL.
    if (path.some((segment) => !segment || segment === "." || segment === ".." || /[\\/]/.test(segment))) {
      return NextResponse.json(
        { success: false, message: "Chemin API invalide." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const encodedPath = path.map((segment) => encodeURIComponent(segment)).join("/");
    const target = `${backendBase}/api/${encodedPath}${request.nextUrl.search}`;

    const headers = new Headers();
    const contentType = request.headers.get("content-type");
    const accept = request.headers.get("accept");
    if (contentType) headers.set("content-type", contentType);
    if (accept) headers.set("accept", accept);

    // The browser cookie belongs to Vercel. Read it server-side and pass only
    // the signed session token to Render as a Bearer token; never expose it to JS.
    const sessionToken = request.cookies.get("hirebuilders_token")?.value;
    const incomingAuthorization = request.headers.get("authorization");
    if (sessionToken) {
      headers.set("authorization", `Bearer ${sessionToken}`);
    } else if (incomingAuthorization?.startsWith("Bearer ")) {
      headers.set("authorization", incomingAuthorization);
    }

    const method = request.method.toUpperCase();
    const body = method === "GET" || method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

    const upstream = await fetch(target, {
      method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });

    const responseHeaders = new Headers({ "Cache-Control": "no-store" });
    for (const name of FORWARDED_RESPONSE_HEADERS) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }

    const responseBody = method === "HEAD" || upstream.status === 204 || upstream.status === 304
      ? null
      : await upstream.arrayBuffer();

    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Erreur proxy API HireBuilders:", error);
    return NextResponse.json(
      { success: false, message: "Le serveur API est momentanément inaccessible." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyApi(request, context);
}

export async function HEAD(request: NextRequest, context: RouteContext) {
  return proxyApi(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyApi(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyApi(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyApi(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyApi(request, context);
}
