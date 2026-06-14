# Current Feature

Database Setup — Prisma 7 ORM + Neon PostgreSQL. Initial schema, NextAuth models, and a migration-based workflow. See @context/features/database-spec.md.

## Status

✅ **COMPLETE** (2026-06-14) — Prisma 7 + Neon PostgreSQL set up, initial migration (`20260614100950_init`) applied to the dev branch (`prisma migrate status` → up to date), and the database seeded (7 system item types always; demo user/collections/items/tags from `mockdata` in non-prod). Schema, config, client singleton, env, and `db:*` scripts all in place; `prisma validate` + lint + build clean. All goals met.

Follow-ups (separate features): wire NextAuth (`@auth/prisma-adapter`) and switch the dashboard off `mockdata` onto real Prisma queries.

## Goals

- Set up Prisma 7 ORM against Neon PostgreSQL (serverless)
- Create the initial schema from the data models in @context/project-overview.md (§5.2) — this will evolve
- Include the NextAuth models (`Account`, `Session`, `VerificationToken`) alongside the extended `User`
- Add appropriate indexes and cascade deletes
- Establish a migration-based workflow: dev branch in `DATABASE_URL`, separate production branch — ALWAYS create migrations, never `prisma db push` unless explicitly specified

## Notes

- **Prisma 7 has breaking changes** from training data — read the full upgrade guide before writing schema/client code: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- Setup reference (Prisma Postgres quickstart): https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
- Rust-free client; generated client output set explicitly to `src/generated/prisma` (see schema in §5.2)
- Migration policy: `prisma migrate dev` in development, `prisma migrate deploy` in production; run `prisma migrate status` before committing
- References:
  - @context/features/database-spec.md
  - @context/project-overview.md (data models §5.2, tech stack §6)
  - @context/coding-standards.md (Database standards)

## History

<!-- Keep this updated. Earliest to latest -->

- **2026-05-25** — Initial Next.js 16 + Tailwind CSS v4 setup via Create Next App
- **2026-06-01** — Started Dashboard UI Phase 1 (ShadCN setup, `/dashboard` route, top bar, sidebar/main placeholders)
- **2026-06-03** — Completed Dashboard UI Phase 1: shadcn/ui initialized (`base-nova` preset → Base UI, neutral base color, lucide icons); added `button` + `input`; dark mode default via `.dark` on `<html>`; Geist wired to `--font-sans`/`--font-mono`; `/dashboard` route with sidebar + sticky top bar shell (search + theme toggle + New Item, display only) and `Sidebar`/`Main` placeholders; `/` redirects to `/dashboard`
- **2026-06-07** — Started Dashboard UI Phase 2 (collapsible sidebar: item types, favorite & recent collections, user avatar area, mobile drawer)
- **2026-06-07** — Completed Dashboard UI Phase 2: built the full sidebar from mock data — `SidebarProvider` (collapse + mobile-drawer state via `useSidebar`, matchMedia breakpoint sync); `SidebarBody` (logo, Item Types with colored dots + count/PRO badges linking to `/items/<type>`, Latest Collections, Library nav, Go Pro upsell, user footer); `Sidebar` responsive shell (collapsible desktop `aside` + Base UI Dialog overlay drawer on mobile); `SidebarTrigger` (`PanelLeft`) wired into the top bar; layout wrapped in `SidebarProvider`. Lint + build clean. Note: matched the reference screenshot's single "Latest Collections" list + "Favorites" library link rather than two separate favorite/recent collection lists
- **2026-06-09** — Started Dashboard UI Phase 3 (main content area: 4 stats cards, recent collections, pinned items, 10 recent items)
- **2026-06-09** — Completed Dashboard UI Phase 3: built the workspace main area from mock data — `StatCard` ×4 (Total Items, Collections, Favorite Items, Favorite Collections; reshaped `WorkspaceStats` to match the spec instead of the screenshot's Tags/Favourites); horizontal `CollectionCard` rail (washed/iconed by dominant type, newest first); `ItemCard` grids for Pinned Items and the 10 most-recent items (type-colored left border, content/link/file preview, tags); shared `SectionHeader` ("View all"); new `src/lib/item-type-styles.ts` (per-type icon + literal Tailwind accent classes) and `formatBytes`/`formatRelativeDate` in `utils.ts`. Expanded `mockdata` to 12 items (4 new) and pinned 4 so the sections populate. Lint + build + TS clean; dashboard renders 200 with all sections
- **2026-06-14** — Started Database Setup: Prisma 7 + Neon PostgreSQL — initial schema from project-overview §5.2, NextAuth models, migration-based dev/prod workflow (see @context/features/database-spec.md)
- **2026-06-14** — Scaffolded Prisma 7: installed `prisma`/`@prisma/client`/`@prisma/adapter-pg`/`pg`/`@types/pg`/`dotenv` (v7.8.0); `prisma/schema.prisma` with §5.2 domain models + Auth.js v5 models (`Account` composite-PK on `[provider, providerAccountId]`, `Session`, `VerificationToken`), generator `prisma-client` → `src/generated/prisma`; datasource `url` moved to `prisma.config.ts` (Prisma 7 change — `dotenv/config` loads `.env` for the CLI); `src/lib/prisma.ts` client singleton via `PrismaPg` adapter; `.env`/`.env.example`; `.gitignore` ignores `src/generated/`; ESLint ignores `src/generated/**`; added `db:*` + `postinstall` scripts. `prisma validate` + `generate` + lint + build all clean
- **2026-06-14** — Two Prisma 7 breaking-change corrections vs the §5.2 snippet: (1) `url` is no longer allowed in the schema datasource (`P1012`) — it lives in `prisma.config.ts`; (2) `prisma.config.ts` reads `process.env.DATABASE_URL` directly instead of the `env()` helper, because `env()` throws eagerly and would break `prisma generate`/`postinstall` on a fresh clone with no `.env`
- **2026-06-14** — Ran initial migration: `prisma migrate dev --name init` → `prisma/migrations/20260614100950_init/` created and applied to the Neon dev branch (over the pooled connection, no shadow-DB issues); all tables, composite PKs, indexes, and cascade FKs match §5.2 (`Item → ItemType` is `RESTRICT`); `prisma migrate status` → "Database schema is up to date". DB layer complete
- **2026-06-14** — Added seeding: installed `tsx`, wired `migrations.seed = "tsx prisma/seed.ts"` in prisma.config.ts + `db:seed` script. `prisma/seed.ts` always upserts the 7 system `ItemType` rows (isSystem, user=null, stable ids from mockdata); outside production it rebuilds demo content scoped to the demo user (idempotent delete+recreate) from `src/lib/mockdata.ts` — mapping type slugs → itemTypeId, `file`/`image` → `ContentType.file` (rest `text`), tags via connectOrCreate, collection membership via `ItemCollection`. Ran `npm run db:seed`: 7 types, 1 user, 8 collections, 12 items, 31 tags, 13 item↔collection joins; verified relations on a sample item. Lint + build clean. Note: DB `ItemType` has no `slug`/`tier`/`contentCategory` (mockdata is richer) — revisit when wiring the dashboard to real queries
