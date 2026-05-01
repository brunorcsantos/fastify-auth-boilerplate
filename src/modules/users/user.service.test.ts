import { describe, it, expect, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { mockDeep } from "vitest-mock-extended";
import { createUsersService } from "./user.service";
import bcrypt from "bcrypt";

vi.stubEnv("JWT_SECRET", "secret_de_teste");

// Mock do Prisma
const prisma = mockDeep<PrismaClient>();

// Mock do JWT
const jwt = { sign: vi.fn().mockReturnValue("token_fake") };

// Mock do bcrypt
vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password"),
    compare: vi.fn(),
  },
}));

// Service sendo testado
const service = createUsersService(prisma);

describe("getMe", () => {
  // Usuário não encontrado
  it("deve retornar erro para usuário não encontrado", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.getMe({ id: "1" })).rejects.toThrow(
      "Usuário não encontrado",
    );
  });
});

describe("updateProfile", () => {
  // Senha de confirmação incorreta
  it("deve retornar erro de credenciais inválidas para senha incorreta", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "1",
      email: "usuario@teste.com.br",
      name: "teste",
      password: "123456",
      provider: "local",
      providerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      refreshToken: null,
    });

    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    const data = {
      id: "1",
      name: "Usuário",
      currentPassword: "senha",
      newPassword: "nova_senha",
    };
    await expect(service.updateProfile(data)).rejects.toThrow(
      "Credenciais inválidas",
    );
  });

  // Atualização bem sucedida
  it("deve retornar atualização bem sucedida", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "1",
      email: "usuario@teste.com.br",
      name: "teste",
      password: "123456",
      provider: "local",
      providerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      refreshToken: null,
    });
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    prisma.user.update.mockResolvedValue({
      id: "1",
      email: "usuario@teste.com.br",
      name: "Usuário",
      password: "nova_senha_hash",
      provider: "local",
      providerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      refreshToken: null,
    });

    const data = {
      id: "1",
      name: "Usuário",
      currentPassword: "123456",
      newPassword: "nova_senha",
    };

    const result = await service.updateProfile(data);
    expect(result).toHaveProperty("message", "Dados atualizados");
    expect(result).toHaveProperty("user");
    expect(result.user).toHaveProperty("name", "Usuário");
  });
  // Usuário OAuth tentando atualizar
  it("deve retornar erro para usuário OAuth tentando atualizar senha", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "1",
      email: "usuario@teste.com.br",
      name: "teste",
      password: null,
      provider: "local",
      providerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      refreshToken: null,
    });

    const data = {
      id: "1",
      name: "Usuário",
      currentPassword: "senha",
      newPassword: "nova_senha",
    };

    await expect(service.updateProfile(data)).rejects.toThrow(
      "Operação não permitida para contas OAuth",
    );
  });
});
