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
    currentPassword?: string;
    newPassword?: string;
  }) {
    const user = await prisma.user.findUnique({ where: { id: data.id } });
    const updateData: { name?: string; password?: string } = {};

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (data.name) {
      updateData.name = data.name;

    }

    if (data.newPassword) {
      if (!user.password) {
        throw new Error("Operação não permitida para contas OAuth");
      }
      const match = await bcrypt.compare(data.currentPassword!, user.password);

      if (!match) {
        throw new Error("Credenciais inválidas");
      }
      const newHashPassword = await bcrypt.hash(data.newPassword, 10);

      updateData.password = newHashPassword;

    }
    const updatedUser = await prisma.user.update({
      where: { id: data.id },
      data: updateData,
    });

    return { message: "Dados atualizados", user: updatedUser };
  }
  return { getMe, updateProfile };
}
