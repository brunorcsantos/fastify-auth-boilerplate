import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

export function createAuthService(
  prisma: PrismaClient,
  jwt: { sign: (payload: object) => string },
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
      throw new Error("Email já cadastrado");
    }
    // 2. criptografar a senha → bcrypt.hash(senha, 10)
    const passwordHash = await bcrypt.hash(data.password, 10);
    // 3. criar o usuário no banco → prisma.user.create(...)

    const { password: _, ...userWithoutPassword } = await prisma.user.create({
      data: { ...data, password: passwordHash },
    });
    // 4. retornar o usuário sem a senha
    return userWithoutPassword;
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

    const token = jwt.sign({ id: user.id, email: user.email });
    return token;
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
        const token = jwt.sign(userWithoutPassword);
      return {user: userWithoutPassword, token};
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
        const token = jwt.sign(updateUser)
        return {user: updateUser, token};
      } else {
        // 6. Se não existir → criar um novo usuário sem senha
        const { password: _, ...newUser } = await prisma.user.create({
          data: { ...data },
        });
        const token = jwt.sign(newUser);
        return {user: newUser, token};
      }
    }
  }

  return { registerUser, loginUser, handleOAuthUser };
}
