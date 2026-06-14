import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 no longer auto-loads .env — `dotenv/config` above handles that for
// CLI commands (migrate, generate, studio), and the datasource `url` is no
// longer allowed in schema.prisma, so it's supplied here for Migrate.
//
// We read `process.env.DATABASE_URL` directly rather than the `env()` helper
// from prisma/config: `env()` throws when the var is missing (evaluated eagerly
// at config load), which would break `prisma generate` / `postinstall` on a
// fresh clone with no .env. `process.env` yields `undefined` instead, which is
// fine for commands that don't connect (generate); migrate gets the real value.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
