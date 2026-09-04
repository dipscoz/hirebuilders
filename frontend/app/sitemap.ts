import type { MetadataRoute } from "next";

const BASE_URL =
  "https://hirebuilders-tn8k.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified =
    new Date();

  return [
    {
      url: `${BASE_URL}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: `${BASE_URL}/employes`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.95,
    },

    {
      url: `${BASE_URL}/categories`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/categories/metier`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/services`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },

    {
      url: `${BASE_URL}/apropos`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${BASE_URL}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${BASE_URL}/postuler-employe`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    },
  ];
}