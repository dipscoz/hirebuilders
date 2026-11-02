import type { MetadataRoute } from "next";
import { tradeCategories } from "./categories/categoryData";

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
      url: `${BASE_URL}/categories`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    ...tradeCategories.map(({ slug }) => ({
      url: `${BASE_URL}/categories/${slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

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

  ];
}
