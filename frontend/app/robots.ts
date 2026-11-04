import type { MetadataRoute } from "next";

const BASE_URL =
  "https://hirebuilders-tn8k.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",

        disallow: [
          "/admin",
          "/api/",
          "/profil",
          "/reservations",
          "/notifications",
          "/connexion",
          "/service-en-preparation",
        ],
      },
    ],

    sitemap:
      `${BASE_URL}/sitemap.xml`,
  };
}
