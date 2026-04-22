import { FastifyRequest, FastifyReply } from "fastify";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    console.log(request.headers)
    await request.jwtVerify();
  } catch (error) {
    return reply.status(401).send({ message: "Não autorizado" });
  }
}
