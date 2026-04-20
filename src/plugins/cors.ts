import fp from "fastify-plugin";
import cors from "@fastify/cors";

const FRONTEND_URL = process.env.FRONTEND_URL;

if (!FRONTEND_URL) {
  throw new Error("FRONTEND_URL não definida no .env");
}

export const corsPlugin = fp(async (fastify) => {
  fastify.register(cors, { origin: FRONTEND_URL });
});
