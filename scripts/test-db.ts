/**
 * Database connectivity test — run via `npm run db:test`.
 *
 * Verifies that the app can reach the Neon database through the Prisma 7
 * driver adapter, then prints a row count per table and a sample item with its
 * relations so you can eyeball that the schema and seed data look right.
 *
 * Note: tsx does not resolve the `@/*` tsconfig alias, so imports here are
 * relative (same as prisma/seed.ts). dotenv loads DATABASE_URL from .env.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set — check your .env file.");
  }

  console.log("Connecting to the database...");
  await prisma.$connect();
  console.log("✔ Connection established.\n");

  const [users, itemTypes, collections, items, tags, itemCollections] =
    await Promise.all([
      prisma.user.count(),
      prisma.itemType.count(),
      prisma.collection.count(),
      prisma.item.count(),
      prisma.tag.count(),
      prisma.itemCollection.count(),
    ]);

  console.log("Row counts:");
  console.table({
    users,
    itemTypes,
    collections,
    items,
    tags,
    itemCollections,
  });

  // Pull one item with its relations to confirm joins resolve correctly.
  const sample = await prisma.item.findFirst({
    include: {
      itemType: true,
      tags: true,
      collections: { include: { collection: true } },
    },
  });

  if (sample) {
    console.log("\nSample item with relations:");
    console.log({
      id: sample.id,
      title: sample.title,
      type: sample.itemType.name,
      tags: sample.tags.map((t) => t.name),
      collections: sample.collections.map((c) => c.collection.name),
    });
  } else {
    console.log("\nNo items found — run `npm run db:seed` to populate demo data.");
  }

  console.log("\n✔ Database test passed.");
}

main()
  .catch((e) => {
    console.error("Database test failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
