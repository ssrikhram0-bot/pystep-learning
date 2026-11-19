import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Fallback for build time if DATABASE_URL is not yet set in environment variables
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "mysql://root:placeholder@localhost:3306/pystep_db";
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
