import { FastifyRequest, FastifyReply } from "fastify";
import { createAuthService } from "./auth.service";
import type {
  Register,
  Login,
  OauthLogin,
  InstagramUser,
  RefreshToken,
  User,
} from "@/types";
import { OAuth2Namespace } from "@fastify/oauth2";

export function createAuthController(
  service: ReturnType<typeof createAuthService>,
  oauth: {
    google: OAuth2Namespace;
    github: OAuth2Namespace;
    facebook: OAuth2Namespace;
    instagram: OAuth2Namespace;
  },
) {
  async function register(
    request: FastifyRequest<{ Body: Register }>,
    reply: FastifyReply,
  ) {
    // 1. extrair os dados do request.body
    const data = request.body;
    // 2. chamar service.registerUser(...)
    try {
      const newUser = await service.registerUser(data);
      console.log(newUser)
      // 3. devolver status 201 com o usuário criado
      reply
        .status(201)
        .send({ ...newUser, message: "Usuário criado com sucesso" });
    } catch (error) {
      // 4. tratar erros com try/catch
      const message = error instanceof Error ? error.message : "Erro interno";
      return reply.status(400).send({ message: message });
    }
  }

  async function login(
    request: FastifyRequest<{ Body: Login }>,
    reply: FastifyReply,
  ) {
    // 1. extrair os dados do request.body
    const data = request.body;
    // 2. chamar service.loginUser(...)
    try {
      const user = await service.loginUser(data);
      // 3. devolver status 200 com o token
      return reply
        .status(200)
        .send({ ...user, message: "Login efetuado com sucesso" });
    } catch (error) {
      // 4. tratar erros com try/catch
      const message = error instanceof Error ? error.message : "Erro interno";
      return reply.status(400).send({ message: message });
    }
  }

  async function googleCallBack(
    request: FastifyRequest<{ Body: OauthLogin }>,
    reply: FastifyReply,
  ) {
    try {
      // 1. Trocar o "code" pelo token do Google
      const googleToken =
        await oauth.google.getAccessTokenFromAuthorizationCodeFlow(request);
      console.log("TOKEN COMPLETO:", JSON.stringify(googleToken, null, 2));
      // 2. Buscar o perfil do usuário no Google
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${googleToken.token.access_token}`,
          },
        },
      );
      const data = (await response.json()) as OauthLogin;
      // 3. Chamar service.handleOAuthUser(...)
      const user = await service.handleOAuthUser({
        email: data.email,
        name: data.name,
        providerId: data.id,
        provider: "google",
      });
      // 4. Gerar e retornar o JWT
      const token = user.credentials.token;
      return reply
        .status(200)
        .send({ token: token, message: "Login efetuado com sucesso" });
    } catch (error) {
      console.log("ERRO COMPLETO:", error);
      const message = error instanceof Error ? error.message : "Erro interno";
      return reply.status(400).send({ message: message });
    }
  }

  async function githubCallBack(
    request: FastifyRequest<{ Body: OauthLogin }>,
    reply: FastifyReply,
  ) {
    try {
      // 1. Trocar o "code" pelo token do Github
      const githubToken =
        await oauth.github.getAccessTokenFromAuthorizationCodeFlow(request);
      //console.log("TOKEN COMPLETO:", JSON.stringify(googleToken, null, 2));
      // 2. Buscar o perfil do usuário no Google
      const response = await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${githubToken.token.access_token}`,
          "User-Agent": "auth-api",
        },
      });
      const data = (await response.json()) as OauthLogin;
      // 3. Chamar service.handleOAuthUser(...)
      const user = await service.handleOAuthUser({
        email: data.email,
        name: data.name,
        providerId: data.id,
        provider: "github",
      });
      // 4. Gerar e retornar o JWT
      const token = user.credentials.token;
      return reply
        .status(200)
        .send({ token: token, message: "Login efetuado com sucesso" });
    } catch (error) {
      // console.log("ERRO COMPLETO:", error);
      const message = error instanceof Error ? error.message : "Erro interno";
      return reply.status(400).send({ message: message });
    }
  }

  async function facebookCallBack(
    request: FastifyRequest<{ Body: OauthLogin }>,
    reply: FastifyReply,
  ) {
    try {
      // 1. Trocar o "code" pelo token do Github
      const facebookToken =
        await oauth.facebook.getAccessTokenFromAuthorizationCodeFlow(request);
      //console.log("TOKEN COMPLETO:", JSON.stringify(googleToken, null, 2));
      // 2. Buscar o perfil do usuário no Google
      const response = await fetch(
        "https://graph.facebook.com/me?fields=id,name,email",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${facebookToken.token.access_token}`,
          },
        },
      );
      const data = (await response.json()) as OauthLogin;
      // 3. Chamar service.handleOAuthUser(...)
      const user = await service.handleOAuthUser({
        email: data.email,
        name: data.name,
        providerId: data.id,
        provider: "facebook",
      });
      // 4. Gerar e retornar o JWT
      const token = user.credentials.token;
      return reply
        .status(200)
        .send({ token: token, message: "Login efetuado com sucesso" });
    } catch (error) {
      // console.log("ERRO COMPLETO:", error);
      const message = error instanceof Error ? error.message : "Erro interno";
      return reply.status(400).send({ message: message });
    }
  }

  async function instagramCallBack(
    request: FastifyRequest<{ Body: InstagramUser }>,
    reply: FastifyReply,
  ) {
    try {
      // 1. Trocar o "code" pelo token do Github
      const instagramToken =
        await oauth.instagram.getAccessTokenFromAuthorizationCodeFlow(request);
      //console.log("TOKEN COMPLETO:", JSON.stringify(googleToken, null, 2));
      // 2. Buscar o perfil do usuário no Google
      const response = await fetch(
        "https://graph.instagram.com/me?fields=id,username",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${instagramToken.token.access_token}`,
          },
        },
      );
      const data = (await response.json()) as InstagramUser;
      // 3. Chamar service.handleOAuthUser(...)
      const user = await service.handleOAuthUser({
        email: `${data.id}@instagram.com`,
        name: data.username,
        providerId: data.id,
        provider: "instagram",
      });
      // 4. Gerar e retornar o JWT
      const token = user.credentials.token;
      return reply
        .status(200)
        .send({ token: token, message: "Login efetuado com sucesso" });
    } catch (error) {
      // console.log("ERRO COMPLETO:", error);
      const message = error instanceof Error ? error.message : "Erro interno";
      return reply.status(400).send({ message: message });
    }
  }

  async function refreshToken(
    request: FastifyRequest<{ Body: RefreshToken }>,
    reply: FastifyReply,
  ) {
    try {
      const { refreshToken } = request.body;
      const newTokens = await service.refreshUserToken(refreshToken);
      return reply.status(200).send(newTokens);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não autorizado";
      return reply.status(403).send({ message: message });
    }
  }

  async function logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.user;
      const response = await service.logoutUser({ id });
      return reply.status(200).send(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não autorizado";
      return reply.status(403).send({ message: message });
    }
  }

  return {
    register,
    login,
    googleCallBack,
    githubCallBack,
    facebookCallBack,
    instagramCallBack,
    refreshToken,
    logout,
  };
}
