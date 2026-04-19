import { FastifyInstance } from "fastify";
import { createAuthController } from "./auth.controller";
import { createAuthService } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.schema";

export async function authRoutes(fastify: FastifyInstance) {
  const service = createAuthService(fastify.prisma, fastify.jwt);
  const controller = createAuthController(service, {
    google: fastify.googleOAuth2,
    github: fastify.githubOAuth2,
    facebook: fastify.facebookOAuth2,
    instagram: fastify.instagramOAuth2,
  });

  fastify.post("/register", { schema: registerSchema }, controller.register);
  fastify.post("/login", { schema: loginSchema }, controller.login);
  fastify.post("/refresh", controller.refreshToken);
  
  fastify.get("/google/callback", controller.googleCallBack);
  fastify.get("/github/callback", controller.githubCallBack);
  fastify.get("/facebook/callback", controller.facebookCallBack);
  fastify.get("/instagram/callback", controller.instagramCallBack);
}
