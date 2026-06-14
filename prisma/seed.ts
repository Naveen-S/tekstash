/**
 * Database seed — run via `npm run db:seed` (Prisma 7: `prisma db seed`, wired
 * through `migrations.seed` in prisma.config.ts).
 *
 * - System `ItemType` rows (isSystem = true, user = null) are ALWAYS upserted —
 *   the app depends on them existing in every environment.
 * - Demo content (a user, collections, items, tags) is seeded only outside
 *   production, sourced from src/lib/mockdata.ts so the dashboard has real rows
 *   to query. It is scoped to the demo user and rebuilt on each run, so the
 *   seed is idempotent.
 *
 * Note: tsx does not resolve the `@/*` tsconfig alias, so imports here are
 * relative.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { ContentType, PrismaClient } from "../src/generated/prisma/client";
import {
  collections as mockCollections,
  currentUser as mockUser,
  items as mockItems,
  itemTypes as mockItemTypes,
} from "../src/lib/mockdata";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// The DB ContentType enum is text|file; file-backed types map to `file`, the
// rest (snippet/prompt/note/command/link) to `text`.
const FILE_SLUGS = new Set(["file", "image"]);

async function seedSystemItemTypes(): Promise<number> {
  for (const t of mockItemTypes) {
    await prisma.itemType.upsert({
      where: { id: t.id },
      update: { name: t.name, icon: t.icon, color: t.color, isSystem: true, userId: null },
      create: { id: t.id, name: t.name, icon: t.icon, color: t.color, isSystem: true },
    });
  }
  return mockItemTypes.length;
}

async function seedDemoData(): Promise<{ collections: number; items: number }> {
  const typeIdBySlug = new Map(mockItemTypes.map((t) => [t.slug, t.id]));

  await prisma.user.upsert({
    where: { id: mockUser.id },
    update: {
      name: mockUser.name,
      email: mockUser.email,
      image: mockUser.image,
      isPro: mockUser.isPro,
    },
    create: {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      image: mockUser.image,
      isPro: mockUser.isPro,
    },
  });

  // Rebuild the demo user's content from scratch (cascades drop the join rows),
  // so re-running the seed is idempotent.
  await prisma.item.deleteMany({ where: { userId: mockUser.id } });
  await prisma.collection.deleteMany({ where: { userId: mockUser.id } });

  await prisma.collection.createMany({
    data: mockCollections.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      isFavorite: c.isFavorite,
      defaultTypeId: typeIdBySlug.get(c.dominantTypeSlug) ?? null,
      userId: mockUser.id,
    })),
  });

  for (const item of mockItems) {
    const itemTypeId = typeIdBySlug.get(item.typeSlug);
    if (!itemTypeId) throw new Error(`Unknown item type slug: ${item.typeSlug}`);

    await prisma.item.create({
      data: {
        id: item.id,
        title: item.title,
        contentType: FILE_SLUGS.has(item.typeSlug) ? ContentType.file : ContentType.text,
        content: item.content,
        fileUrl: item.fileUrl,
        fileName: item.fileName,
        fileSize: item.fileSize,
        url: item.url,
        description: item.description,
        language: item.language,
        isFavorite: item.isFavorite,
        isPinned: item.isPinned,
        userId: mockUser.id,
        itemTypeId,
        tags: {
          connectOrCreate: item.tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
        collections: {
          create: item.collectionIds.map((collectionId) => ({
            collection: { connect: { id: collectionId } },
          })),
        },
      },
    });
  }

  return { collections: mockCollections.length, items: mockItems.length };
}

async function main(): Promise<void> {
  const env = process.env.NODE_ENV ?? "development";
  console.log(`Seeding database (NODE_ENV=${env})...`);

  const typeCount = await seedSystemItemTypes();
  console.log(`✔ System item types upserted: ${typeCount}`);

  if (env === "production") {
    console.log("Production — skipping demo data (system types only).");
    return;
  }

  const demo = await seedDemoData();
  console.log(
    `✔ Demo data seeded: 1 user, ${demo.collections} collections, ${demo.items} items`,
  );
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
