import { PrismaClient } from "@prisma/client";
import { JWT } from "@fastify/jwt";
import { OAuth2Namespace } from "@fastify/oauth2";
import "@fastify/jwt"

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    jwt: JWT;
    googleOAuth2: OAuth2Namespace;
    githubOAuth2: OAuth2Namespace;
    facebookOAuth2: OAuth2Namespace;
    instagramOAuth2: OAuth2Namespace;
  }

  interface FastifyRequest {
    user: {
      id: string;
      email: string;
    };
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string; email: string }
    user: { id: string; email: string }
  }
}
