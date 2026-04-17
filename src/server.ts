import "./config/env";
import Fastify from "fastify";
import { jwtPlugin } from "./plugins/jwt"; // ✅
import { prismaPlugin } from "./plugins/prisma";
import { authRoutes } from "./modules/auth/auth.routes";
import { oauthPlugin } from "./plugins/oauth";


const PORT = Number(process.env.PORT) || 3000;

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    await fastify.register(prismaPlugin);
    await fastify.register(jwtPlugin);
    await fastify.register(oauthPlugin)
    await fastify.register(authRoutes, { prefix: '/auth' })
    await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
