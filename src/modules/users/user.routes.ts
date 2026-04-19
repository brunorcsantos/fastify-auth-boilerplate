import { FastifyInstance } from "fastify";
import { createUsersService } from "./user.service";
import { createUsersController } from "./user.controller";
import { authenticate } from "@/shared/middlewares/authenticate";

export async function usersRoutes(fastify: FastifyInstance) {
  const service = createUsersService(fastify.prisma);
  const controller = createUsersController(service);

  fastify.register(async (protectedFastify) => {
    protectedFastify.addHook("preHandler", authenticate);
    protectedFastify.get("/me", controller.getMe);
  });
}
