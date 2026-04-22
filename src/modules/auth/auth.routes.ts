import { FastifyInstance } from "fastify";
import { createAuthController } from "./auth.controller";
import { createAuthService } from "./auth.service";
import { registerSchema, loginSchema, refreshSchema, logoutSchema, googleAuthSchema, githubAuthSchema, facebookAuthSchema, instagramAuthSchema } from "./auth.schema";
import { authenticate } from "@/shared/middlewares/authenticate";

export async function authRoutes(fastify: FastifyInstance) {
  const service = createAuthService(fastify.prisma, fastify.jwt);
  const controller = createAuthController(service, {
    google: fastify.googleOAuth2,
    github: fastify.githubOAuth2,
    facebook: fastify.facebookOAuth2,
    instagram: fastify.instagramOAuth2,
  });

  fastify.register(async (protectedFastify) => {
    protectedFastify.addHook("preHandler", authenticate);
    protectedFastify.post("/logout", { schema: logoutSchema }, controller.logout);
  });

  fastify.post("/register", { schema: registerSchema }, controller.register);
  fastify.post("/login", { schema: loginSchema }, controller.login);
  fastify.post("/refresh", { schema: refreshSchema }, controller.refreshToken);

  fastify.get("/google/callback", { schema: googleAuthSchema },controller.googleCallBack);
  fastify.get("/github/callback", { schema: githubAuthSchema },controller.githubCallBack);
  fastify.get("/facebook/callback", { schema: facebookAuthSchema },controller.facebookCallBack);
  fastify.get("/instagram/callback", { schema: instagramAuthSchema },controller.instagramCallBack);
}
