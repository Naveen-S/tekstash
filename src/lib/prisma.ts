import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Prisma 7 is Rust-free and requires a driver adapter. We use the node-postgres
// adapter against the Neon connection string in DATABASE_URL (Next.js loads
// .env automatically at runtime).
//
// In development, Next.js hot-reload would otherwise create a new client (and a
// new connection pool) on every change, so we cache a single instance on
// globalThis. See https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
