import fp from "fastify-plugin";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL não definido no .env");
}

const adapter = new PrismaBetterSqlite3({ url: DATABASE_URL });
const prismaClient = new PrismaClient({ adapter });

export const prismaPlugin = fp(async (fastify) => {
  fastify.decorate("prisma", prismaClient);
  fastify.addHook("onClose", async () => {
    await prismaClient.$disconnect();
  });
});
