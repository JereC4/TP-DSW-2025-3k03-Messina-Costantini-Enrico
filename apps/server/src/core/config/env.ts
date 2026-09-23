import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Carga apps/server/.env y, como fallback de desarrollo, packages/database/.env
// (dotenv no pisa variables ya definidas, así que en producción mandan las del hosting).
const here = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(here, "../../../.env"), quiet: true });
config({ path: resolve(here, "../../../../../packages/database/.env"), quiet: true });

const DEV_SECRET = "dev-secret-change-me";

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 3000),
  JWT_SECRET: process.env.JWT_SECRET ?? DEV_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "8h",
  CORS_ORIGIN: (process.env.CORS_ORIGIN ?? "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  // Supabase Storage para la foto de perfil (ver docs/deploy.md § Supabase).
  SUPABASE_URL: process.env.SUPABASE_URL ?? "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  SUPABASE_AVATARS_BUCKET: process.env.SUPABASE_AVATARS_BUCKET ?? "avatars",
};

if (env.NODE_ENV === "production" && env.JWT_SECRET === DEV_SECRET) {
  throw new Error("JWT_SECRET debe definirse en producción");
}
