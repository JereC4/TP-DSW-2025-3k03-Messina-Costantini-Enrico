/**
 * Exporta el documento OpenAPI a docs/api/openapi.json (raíz del repo).
 * Uso: pnpm --filter server docs:export
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateOpenApiDocument } from "../src/core/docs/openapi.js";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../../../docs/api/openapi.json");

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(generateOpenApiDocument("https://tp-dsw-2025-3k03-messina-costantini.onrender.com"), null, 2) + "\n");
console.log(`OpenAPI exportado a ${out}`);
