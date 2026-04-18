import fp from "fastify-plugin";
import jwt from "@fastify/jwt";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não definido no .env");
}

export const jwtPlugin = fp(async (fastify) => {
  fastify.register(jwt, { secret: JWT_SECRET, sign: { expiresIn: "15m" } }); // Nesse trecho
});
