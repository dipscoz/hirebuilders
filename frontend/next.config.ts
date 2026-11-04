import type { NextConfig } from "next";

// Les appels navigateur /api/* passent par les Route Handlers Next.js.
// Ceux-ci transmettent la session HTTP-only à Render côté serveur.
// Ne pas ajouter de rewrite direct vers Render ici : cela contournerait le proxy.
const nextConfig: NextConfig = {};

export default nextConfig;
