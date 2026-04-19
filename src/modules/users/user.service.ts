import { PrismaClient } from "@prisma/client";

const userSelect = {
  id: true,
  email: true,
  name: true,
  provider: true,
  providerId: true,
  createdAt: true,
  updatedAt: true,
} as const; 

export function createUsersService(prisma: PrismaClient) {
  async function getMe(data: { id: string }) {
    const user = await prisma.user.findUnique({
      where: { id: data.id },
      select: userSelect,
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  }
  return { getMe };
}
