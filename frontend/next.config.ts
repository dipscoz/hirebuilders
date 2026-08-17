import type { NextConfig } from "next";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "http://localhost:5000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source:
          "/api/notifications/:path*",
        destination:
          `${BACKEND_URL}/api/notifications/:path*`,
      },

      {
        source:
          "/api/reservations/:path*",
        destination:
          `${BACKEND_URL}/api/reservations/:path*`,
      },

      {
        source:
          "/api/messages/:path*",
        destination:
          `${BACKEND_URL}/api/messages/:path*`,
      },

      {
        source:
          "/api/employees/:path*",
        destination:
          `${BACKEND_URL}/api/employees/:path*`,
      },

      {
        source:
          "/api/employee-applications/:path*",
        destination:
          `${BACKEND_URL}/api/employee-applications/:path*`,
      },
    ];
  },
};

export default nextConfig;