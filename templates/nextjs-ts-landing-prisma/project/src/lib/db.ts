import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  db: PrismaClient | undefined;
};

// Optimized Prisma configuration
const createPrismaClient = () => {
  return new PrismaClient({
    log: [],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

const db = globalForPrisma.db ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;

// Graceful shutdown handling
process.on("beforeExit", () => {
  void db.$disconnect();
});

export default db;
