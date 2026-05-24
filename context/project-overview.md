# TekStash — Project Overview

> One fast, searchable, AI-enhanced hub for all developer knowledge and resources.

TekStash gives developers a single home for the essentials they currently scatter across VS Code, Notion, chat histories, bookmarks, gists, and random folders. Snippets, prompts, commands, notes, links, and files all live in one searchable, taggable, collection-based workspace — with AI features layered on top for paid users.

---

## 1. Problem

Developers keep their essentials scattered across too many tools:

| Where it lives today | What it is |
| --- | --- |
| VS Code / Notion | Code snippets |
| AI chat histories | Prompts |
| Buried project folders | Context files |
| Browser bookmarks | Useful links |
| Random folders | Docs |
| `.txt` files | Commands |
| GitHub gists | Project templates |
| Bash history | Terminal commands |

The result is constant context switching, lost knowledge, and inconsistent workflows. **TekStash consolidates all of this into one place.**

---

## 2. Target Users

| Persona | Primary need |
| --- | --- |
| 🧑‍💻 **Everyday Developer** | Fast way to grab snippets, prompts, commands, links |
| 🤖 **AI-first Developer** | Save prompts, contexts, workflows, system messages |
| 🎓 **Content Creator / Educator** | Store code blocks, explanations, course notes |
| 🏗️ **Full-stack Builder** | Collect patterns, boilerplates, API examples |

---

## 3. Core Concepts

### 3.1 Items & Item Types

An **item** is the atomic unit of TekStash. Every item has a **type**. Users will eventually be able to create custom types (Pro, later), but the app ships with a fixed set of **system types** that cannot be edited or deleted.

| Type | Content kind | Tier | Color | Icon (lucide) | Route |
| --- | --- | --- | --- | --- | --- |
| `snippet` | text | Free | `#3b82f6` 🟦 blue | `Code` | `/items/snippets` |
| `prompt` | text | Free | `#8b5cf6` 🟪 purple | `Sparkles` | `/items/prompts` |
| `note` | text | Free | `#fde047` 🟨 yellow | `StickyNote` | `/items/notes` |
| `command` | text | Free | `#f97316` 🟧 orange | `Terminal` | `/items/commands` |
| `link` | url | Free | `#10b981` 🟩 emerald | `Link` | `/items/links` |
| `file` | file | **Pro** | `#6b7280` ⬜ gray | `File` | `/items/files` |
| `image` | file | **Pro** | `#ec4899` 🩷 pink | `Image` | `/items/images` |

**Content categories** (drives storage + rendering):

- **text** → `snippet`, `prompt`, `note`, `command` (Markdown editor, syntax highlighting)
- **url** → `link`
- **file** → `file`, `image` (uploaded to Cloudflare R2)

Items should be **quick to create and open** via a drawer rather than full page navigation.

### 3.2 Collections

Collections group items of **any type**. An item can belong to **multiple collections** simultaneously (many-to-many) — e.g. a React snippet can sit in both *React Patterns* and *Interview Prep*.

Examples: *React Patterns* (snippets, notes), *Context Files* (files), *Python Snippets* (snippets).

### 3.3 Search

Powerful search across **content, tags, titles, and types**.

### 3.4 Tags

Lightweight, reusable labels for cross-cutting organization, independent of collections.

---

## 4. Feature List

### Core
- ✅ Create / read / update / delete items across all system types
- ✅ Collections with many-to-many item membership
- ✅ Add / remove items to/from multiple collections
- ✅ View which collections an item belongs to
- ✅ Search across content, tags, titles, types
- ✅ Favorites for both collections and items
- ✅ Pin items to top
- ✅ Recently used
- ✅ Import code from a file
- ✅ Markdown editor for text types
- ✅ Syntax highlighting for code blocks
- ✅ Export data (JSON / ZIP)
- ✅ Dark mode (default), light mode optional

### Authentication
- Email / password
- GitHub OAuth

### File handling (Pro)
- File upload for `file` / `image` types → Cloudflare R2

### AI Features (Pro)
- 🤖 AI auto-tag suggestions
- 🤖 AI summaries
- 🤖 AI "Explain This Code"
- 🤖 Prompt optimizer

---

## 5. Data Model

### 5.1 Entity Relationships

```
                          ┌──────────────┐
                          │     User     │
                          │  (NextAuth)  │
                          └──────┬───────┘
                                 │ 1
              ┌──────────────────┼──────────────────┐
              │ N                │ N                 │ N
        ┌─────▼──────┐    ┌──────▼──────┐     ┌──────▼──────┐
        │    Item    │    │ Collection  │     │  ItemType   │
        └─────┬──────┘    └──────┬──────┘     │ (custom)    │
              │ N                │ N           └─────────────┘
              │                  │                   ▲
              │   ┌──────────────▼──────────┐        │ N
              └──►│     ItemCollection       │◄───────┘ (system types: user = null)
                  │       (join table)       │
                  └──────────────────────────┘
              │ N
        ┌─────▼──────┐
        │    Tag     │   (Item ↔ Tag many-to-many)
        └────────────┘
```

**Relationship summary**

- `User` **1—N** `Item`, `Collection`, custom `ItemType`
- `Item` **N—N** `Collection` via `ItemCollection` join table (tracks `addedAt`)
- `Item` **N—N** `Tag`
- `Item` **N—1** `ItemType`
- System `ItemType` rows have `user = null` and `isSystem = true` (shared by everyone)

### 5.2 Prisma Schema

> **⚠️ Migration policy:** Never use `prisma db push` or modify the database structure directly. All schema changes go through migrations (`prisma migrate dev` in development, then applied to production).

```prisma
// schema.prisma
// Prisma 7 — Rust-free client, ESM, generated client output set explicitly.

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// Auth — extends NextAuth base models
// ─────────────────────────────────────────────
model User {
  id                   String       @id @default(cuid())
  name                 String?
  email                String?      @unique
  emailVerified        DateTime?
  image                String?

  // Billing / entitlements
  isPro                Boolean      @default(false)
  stripeCustomerId     String?      @unique
  stripeSubscriptionId String?      @unique

  // Relations
  accounts             Account[]
  sessions             Session[]
  items                Item[]
  collections          Collection[]
  itemTypes            ItemType[]   // custom (user-owned) types only

  createdAt            DateTime     @default(now())
  updatedAt            DateTime     @updatedAt
}

// ─────────────────────────────────────────────
// Domain
// ─────────────────────────────────────────────
enum ContentType {
  text
  file
}

model Item {
  id          String           @id @default(cuid())
  title       String
  contentType ContentType
  content     String?          // text content, or null when file-backed
  fileUrl     String?          // R2 URL, or null for text
  fileName    String?          // original filename
  fileSize    Int?             // bytes
  url         String?          // for link types
  description String?
  language    String?          // optional, for code highlighting
  isFavorite  Boolean          @default(false)
  isPinned    Boolean          @default(false)

  // Relations
  userId      String
  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  itemTypeId  String
  itemType    ItemType         @relation(fields: [itemTypeId], references: [id])
  collections ItemCollection[]
  tags        Tag[]            @relation("ItemTags")

  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  @@index([userId])
  @@index([itemTypeId])
}

model ItemType {
  id       String  @id @default(cuid())
  name     String
  icon     String
  color    String
  isSystem Boolean @default(false)

  // user is null for system types, set for custom types
  userId   String?
  user     User?   @relation(fields: [userId], references: [id], onDelete: Cascade)
  items    Item[]

  @@index([userId])
}

model Collection {
  id            String           @id @default(cuid())
  name          String
  description   String?
  isFavorite    Boolean          @default(false)
  defaultTypeId String?          // default type for new/empty collections

  userId        String
  user          User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  items         ItemCollection[]

  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  @@index([userId])
}

// Join table — Item ↔ Collection (many-to-many)
model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime   @default(now())

  item         Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
  @@index([collectionId])
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  items Item[] @relation("ItemTags")
}
```

**Notes on the schema**

- The original spec gave `Tag` only `id` + `name`. Kept minimal, with `name` unique so tags are reusable across items. If tags should be per-user instead of global, add `userId` + a compound `@@unique([userId, name])`.
- `defaultTypeId` on `Collection` is left as a loose `String?` rather than a relation, matching the spec's "default type for new collections" intent. Promote it to a real relation to `ItemType` if you want referential integrity.
- `onDelete: Cascade` is set so deleting a user cleans up their items/collections, and deleting an item clears its join rows. Adjust if you prefer soft deletes.
- NextAuth's `Account`, `Session`, and `VerificationToken` models are assumed (standard Prisma adapter set) — only `User` is shown extended here.

---

## 6. Tech Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| **Framework** | Next.js 16 / React 19 | SSR pages with dynamic components; API routes for backend (items, uploads, AI). One repo. |
| **Language** | TypeScript | Type safety end to end. |
| **Database** | Neon (PostgreSQL) | Cloud Postgres. |
| **ORM** | Prisma 7 | Rust-free client, WASM query compiler on the JS thread. **Always fetch the latest Prisma 7 docs.** |
| **Caching** | Redis *(maybe)* | Optional; Prisma 7 also ships a Client-level caching layer (7.4+) worth evaluating before adding Redis. |
| **File storage** | Cloudflare R2 | For `file` / `image` uploads. |
| **Auth** | NextAuth (Auth.js) v5 | Email/password + GitHub OAuth. |
| **AI** | OpenAI `gpt-5-nano` | Auto-tagging, summaries, code explanation, prompt optimizer. |
| **Styling** | Tailwind CSS v4 + shadcn/ui | — |

> 💡 **Prisma 7 heads-up:** because the query compiler now runs as WASM on the main JS thread (no separate Rust engine process), heavy query workloads can block the event loop. This is exactly why Prisma added a Client caching layer in 7.4 — evaluate it before reaching for Redis.

### Useful links
- Prisma 7 announcement — https://www.prisma.io/blog/announcing-prisma-orm-7-0-0
- Prisma upgrade guide & changelog — https://www.prisma.io/changelog
- Neon — https://neon.tech
- Cloudflare R2 — https://developers.cloudflare.com/r2/
- Auth.js (NextAuth v5) — https://authjs.dev
- Next.js — https://nextjs.org/docs
- shadcn/ui — https://ui.shadcn.com
- Tailwind CSS v4 — https://tailwindcss.com

---

## 7. Monetization (Freemium)

| | **Free** | **Pro — $8/mo or $72/yr** |
| --- | --- | --- |
| Items | 50 total | Unlimited |
| Collections | 3 | Unlimited |
| System types | All except `file` / `image` | All |
| File & image uploads | ❌ | ✅ |
| Custom types | ❌ | ✅ *(later)* |
| Search | Basic | Basic |
| AI auto-tagging | ❌ | ✅ |
| AI code explanation | ❌ | ✅ |
| AI prompt optimizer | ❌ | ✅ |
| AI summaries | ❌ | ✅ |
| Export (JSON/ZIP) | ❌ | ✅ |
| Support | — | Priority |

> 🛠️ **Build note:** Set up the entitlement foundation (the `isPro` flag, Stripe fields, gating helpers) now, but **during development all users can access everything.** Flip the gates on closer to launch.

---

## 8. UI / UX

**General direction:** modern, minimal, developer-focused. Dark mode by default, light optional. Clean typography, generous whitespace, subtle borders and shadows. References: **Notion, Linear, Raycast.** Syntax highlighting on all code blocks.

### Layout

```
┌────────────┬─────────────────────────────────────────────┐
│  SIDEBAR   │  MAIN CONTENT                                │
│ (collaps.) │                                              │
│            │  ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│ Item types │  │Collection │ │Collection │ │Collection │   │
│ • Snippets │  │  card     │ │  card     │ │  card     │   │
│ • Commands │  │ (bg color │ │           │ │           │   │
│ • Prompts  │  │  = most-  │ └───────────┘ └───────────┘   │
│ • …        │  │  held     │                               │
│            │  │  type)    │  ┌────────┐ ┌────────┐        │
│ Latest     │  └───────────┘  │ Item   │ │ Item   │  …     │
│ collections│                 │ (border│ │ card   │        │
│            │                 │  color │ └────────┘        │
│            │                 │ = type)│                   │
│            │                 └────────┘                   │
└────────────┴─────────────────────────────────────────────┘
                                   │
                                   ▼  (item click)
                        ┌────────────────────┐
                        │   Item Drawer       │  ← quick open/create
                        └────────────────────┘
```

- **Sidebar:** item types (each links to that type's items, e.g. `/items/snippets`) + latest collections. Collapsible.
- **Main:** grid of **collection cards**, background-colored by the type they hold most of. Items render as cards with a **border color** matching their type.
- **Item drawer:** individual items open in a fast drawer for viewing/creating — no full page reload.

### Responsive
- Desktop-first, mobile usable.
- Sidebar collapses into a drawer on mobile.

### Micro-interactions
- Smooth transitions
- Hover states on cards
- Toast notifications for actions
- Loading skeletons

---

## 9. Open Questions / Decisions to Confirm

A few things in the notes are worth nailing down before building:

1. **Tags scope** — global (reusable across all users) or per-user? The schema currently assumes global with a unique name.
2. **`defaultTypeId`** — keep as a loose string, or make it a proper relation to `ItemType` for integrity?
3. **Redis vs Prisma caching** — the spec marks Redis as "maybe." Given Prisma 7's built-in caching layer, decide whether Redis is needed at all for v1.
4. **Basic search for both tiers** — the monetization table lists "Basic search" for Free and no separate search tier for Pro. Is advanced/AI-powered search a future Pro differentiator, or intentionally the same for everyone?
5. **Deletes** — hard delete (current cascade behavior) vs soft delete (recoverable trash, which pairs well with an export feature).
6. **`gpt-5-nano`** — confirm the exact model identifier against OpenAI's current model list at implementation time.
