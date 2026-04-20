import { FastifyReply, FastifyRequest } from "fastify";
import { createUsersService } from "./user.service";
import type { UpdateProfile, User } from "@/types";

export function createUsersController(
  service: ReturnType<typeof createUsersService>, // Explique este trecho
) {
  async function getMe(request: FastifyRequest, reply: FastifyReply) {
    const data = request.user;
    try {
      const response = await service.getMe({ id: data.id });
      return reply.status(200).send(response);
    } catch (error) {
      return reply
        .status(400)
        .send({ message: "Usuário não encontrado", Erro: error });
    }
  }

  async function updateProfile(
    request: FastifyRequest<{ Body: UpdateProfile }>,
    reply: FastifyReply,
  ) {
    const { id } = request.user;
    try {
      const response = await service.updateProfile({ id, ...request.body });
      return reply.status(200).send(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro interno";
      return reply
        .status(400)
        .send({ message: message });
    }
  }

  return { getMe, updateProfile };
}
