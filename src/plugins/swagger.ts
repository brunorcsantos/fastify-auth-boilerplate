import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export const swaggerPlugin = fp(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "fastify-auth-boilerplate",
        description: "API de autenticação com Fastify e TypeScript",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          }
        }
      }
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/docs", // acesse em http://localhost:3000/docs
  });
});