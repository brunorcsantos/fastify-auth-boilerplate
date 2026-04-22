import { describe, it, expect, vi } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { createAuthService } from "./auth.service";
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
const service = createAuthService(prisma, jwt);

// Register Tests
describe("registerUser", () => {
  it("deve retornar erro com credenciais inválidas", async () => {
    // Arrange — prepara os dados
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
    // Act — executa a função
    await expect(
      service.registerUser({
        name: "Usuário",
        email: "usuario@teste.com.br",
        password: "123456",
      }),
    ).rejects.toThrow("E-mail já cadastrado");
  });

  it("deve registrar o usuário e retornar sem a senha", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: "2",
      email: "novo@teste.com.br",
      name: "Novo Usuário",
      password: "hash_qualquer",
      provider: "local",
      providerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      refreshToken: null,
    });
    const result = await service.registerUser({
      name: "Novo Usuário",
      email: "novo@teste.com.br",
      password: "123456",
    });
    expect(result).not.toHaveProperty("password"); // Por que não houve await como no teste anterior?
  });
});

// Login Tests
describe("loginUser", () => {
  it("deve retornar erro com credenciais inválidas para usuário não encontrado", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(
      service.loginUser({
        email: "usuario@teste.com.br",
        password: "senha incorreta",
      }),
    ).rejects.toThrow("Credenciais inválidas");
  });

  it("deve retornar erro com credenciais inválidas para senha inválida", async () => {
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

    await expect(
      service.loginUser({
        email: "usuario@teste.com.br",
        password: "senha incorreta",
      }),
    ).rejects.toThrow("Credenciais inválidas");
  });

  it("deve retornar token e refresh token", async () => {
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

    const result = await service.loginUser({
      email: "usuario@teste.com.br",
      password: "123456",
    });

    prisma.user.update.mockResolvedValue({
      id: "1",
      email: "usuario@teste.com.br",
      name: "teste",
      password: "123456",
      provider: "local",
      providerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      refreshToken: "refresh_fake",
    });

    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("refreshToken");
  });
});
