import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwtLib from "jsonwebtoken";

export function createAuthService(
  prisma: PrismaClient,
  jwt: { sign: (payload: { id: string; email: string }) => string },
) {
  async function registerUser(data: {
    email: string;
    password: string;
    name: string;
  }) {
    // 1. verificar se email já existe
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error("E-mail já cadastrado");
    }
    // 2. criptografar a senha → bcrypt.hash(senha, 10)
    const passwordHash = await bcrypt.hash(data.password, 10);
    // 3. criar o usuário no banco → prisma.user.create(...)

    const { password: _, ...userWithoutPassword } = await prisma.user.create({
      data: { ...data, password: passwordHash },
    });
    // 4. retornar o usuário sem a senha
    const tokens = await generateAndSaveTokens({
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
    });
    return {...userWithoutPassword, ...tokens};
  }

  async function loginUser(data: { email: string; password: string }) {
    // 1. verificar se email já existe
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.password) {
      throw new Error("Credenciais inválidas");
    }

    // 2. Comparar a senha → bcrypt.compare(senhaDigitada, hash)
    const match = await bcrypt.compare(data.password, user.password);

    if (!match) {
      throw new Error("Credenciais inválidas");
    }

    const tokens = await generateAndSaveTokens({
      id: user.id,
      email: user.email,
    });
    const { password: _, ...userWithoutPassword } = user;

    return { ...userWithoutPassword, ...tokens };
  }

  async function handleOAuthUser(data: {
    // 1. Receber os dados do perfil do provider (email, name, providerId, provider)
    email: string;
    name: string;
    providerId: string;
    provider: string;
  }) {
    // 2. Verificar se já existe um usuário com aquele providerId
    const existingUserWithProviderId = await prisma.user.findFirst({
      where: { providerId: data.providerId, provider: data.provider },
    });
    // 3. Se existir → retornar o usuário
    if (existingUserWithProviderId) {
      const { password: _, ...userWithoutPassword } =
        existingUserWithProviderId;

      return {
        user: userWithoutPassword,
        credentials: await generateAndSaveTokens(userWithoutPassword),
      };
    } else {
      // 4. Se não existir → verificar se existe um usuário com aquele email
      const existingUSer = await prisma.user.findUnique({
        where: { email: data.email },
      });
      // 5. Se existir pelo email → vincular o provider ao usuário existente
      if (existingUSer) {
        const { password: _, ...updateUser } = await prisma.user.update({
          where: { email: data.email },
          data: { ...data },
        });

        return {
          user: updateUser,
          credentials: await generateAndSaveTokens(updateUser),
        };
      } else {
        // 6. Se não existir → criar um novo usuário sem senha
        const { password: _, ...newUser } = await prisma.user.create({
          data: { ...data },
        });

        return {
          user: newUser,
          credentials: await generateAndSaveTokens(newUser),
        };
      }
    }
  }

  async function generateAndSaveTokens(user: { id: string; email: string }) {
    const token = jwt.sign({ id: user.id, email: user.email });
    const refreshToken = jwtLib.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );
    await prisma.user.update({
      where: { email: user.email },
      data: { refreshToken },
    });

    return { token, refreshToken };
  }

  async function refreshUserToken(refreshToken: string) {
    const foundUser = await prisma.user.findUnique({
      where: { refreshToken: refreshToken },
    });

    console.log("foundUser:", foundUser);

    if (!foundUser) {
      throw new Error("Token inválido");
    }

    try {
      const decoded = jwtLib.verify(
        refreshToken,
        process.env.JWT_SECRET!,
      ) as jwtLib.JwtPayload;

      const credentials = await generateAndSaveTokens({
        id: decoded.id,
        email: decoded.email,
      });

      return credentials;
    } catch (error) {
      throw new Error("Token expirado ou inválido");
    }
  }

  async function logoutUser(user: { id: string }) {
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: null },
    });

    return { message: "Logout efetuado com sucesso" };
  }

  return {
    registerUser,
    loginUser,
    handleOAuthUser,
    refreshUserToken,
    logoutUser,
  };
}
