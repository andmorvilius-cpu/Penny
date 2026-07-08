// Prisma client singleton.
//
// - `server-only` makes the build fail if this file (or anything importing it)
//   ever ends up in a client component, so the database can never leak to the
//   browser bundle.
// - The globalThis caching is the standard Next.js + Prisma pattern: in dev,
//   hot reloading re-runs modules, and without this we'd open a new database
//   connection on every reload.

import "server-only";
import path from "node:path";
import { PrismaClient } from "@/generated/prisma/client";

// The Prisma CLI resolves relative SQLite paths (file:./dev.db) against the
// prisma/ folder, but the bundled runtime client resolves them against
// wherever Next.js put the bundle. Normalizing to an absolute path here makes
// both agree on prisma/dev.db. Non-file URLs (e.g. postgres://) pass through
// untouched, so switching databases later is still just an .env change.
function resolveDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url || !url.startsWith("file:")) return url;
  const filePath = url.slice("file:".length);
  if (path.isAbsolute(filePath)) return url;
  return "file:" + path.resolve(process.cwd(), "prisma", filePath);
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ datasourceUrl: resolveDatabaseUrl() });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
