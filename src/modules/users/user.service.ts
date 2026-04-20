import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

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

  async function updateProfile(data: {
    id: string;
    name?: string;
    currentPassword: string;
    newPassword?: string;
  }) {
    const user = await prisma.user.findUnique({ where: { id: data.id } });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (!user.password) {
      throw new Error("Operação não permitida para contas OAuth");
    } else {
      const match = await bcrypt.compare(data.currentPassword, user.password);

      if (match) {
        const updateData: { name?: string; password?: string } = {};
        if (data.name) updateData.name = data.name;
        if (data.currentPassword && data.newPassword) {
          const newHashPassword = await bcrypt.hash(data.newPassword, 10);

          updateData.password = newHashPassword;
        }

        await prisma.user.update({
          where: { id: data.id },
          data: updateData,
        });
      } else {
        throw new Error("Credenciais inválidas");
      }
    }

    return { message: "Dados atualizados" };
  }
  return { getMe, updateProfile };
}
