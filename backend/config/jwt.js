// Centralized JWT signing/verification secret.
// Production must never fall back to a known development secret.
const configuredSecret = String(process.env.JWT_SECRET || "").trim();

const isProduction =
  process.env.NODE_ENV === "production" ||
  Boolean(process.env.RENDER_SERVICE_ID) ||
  Boolean(process.env.VERCEL);

if (!configuredSecret && isProduction) {
  throw new Error("JWT_SECRET doit être défini en production.");
}

if (!configuredSecret) {
  console.warn("ATTENTION: JWT_SECRET absent; utilisation du secret local de développement.");
}

module.exports = configuredSecret || "hirebuilders-dev-only-secret-change-me";
