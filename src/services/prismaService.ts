import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Env } from "../types";

export function createPrismaClient(env: Env) {
  const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());

  return prisma;
}

export type PrismaClientType = ReturnType<typeof createPrismaClient>;
