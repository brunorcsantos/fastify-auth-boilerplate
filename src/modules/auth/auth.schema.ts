export const registerSchema = {
  tags: ["Auth"],
  summary: "Cadastro de novo usuário",
  body: {
    type: "object",
    required: ["email", "password", "name"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
      name: { type: "string", minLength: 2 },
    },
  },
  response: {
    201: {
      description: "Usuário criado com sucesso",
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        name: { type: "string" },
        provider: { type: "string" },
        providerId: { type: "string" },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
        token: { type: "string" },
        refreshToken: { type: "string" },
        message: { type: "string" },
      },
    },
    400: {
      description: "E-mail já cadastrado",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

export const loginSchema = {
  tags: ["Auth"],
  summary: "Login no sistema",
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Login efetuado com sucesso",
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        name: { type: "string" },
        provider: { type: "string" },
        providerId: { type: "string" },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
        token: { type: "string" },
        refreshToken: { type: "string" },
        message: { type: "string" },
      },
    },
    400: {
      description: "Credenciais inválidas",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

export const refreshSchema = {
  tags: ["Auth"],
  summary: "Atualiza o refresh token no banco de dados",
  body: {
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Login efetuado com sucesso",
      type: "object",
      properties: {
        token: { type: "string" },
        refreshToken: { type: "string" },
      },
    },
    403: {
      description: "Token expirado ou inválido",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

export const logoutSchema = {
  tags: ["Auth"],
  summary: "Exclui o refresh token do banco de dados",
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Logout efetuado com sucesso",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    403: {
      description: "Não autorizado",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

export const googleAuthSchema = {
  tags: ["OAuth"],
  summary: "Inicia o fluxo de autenticação com o Google",
  response: {
    302: {
      description: "Redireciona para o Google",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

export const facebookAuthSchema = {
  tags: ["OAuth"],
  summary: "Inicia o fluxo de autenticação com o Facebook",
  response: {
    302: {
      description: "Redireciona para o Facebook",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

export const githubAuthSchema = {
  tags: ["OAuth"],
  summary: "Inicia o fluxo de autenticação com o Github",
  response: {
    302: {
      description: "Redireciona para o Github",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

export const instagramAuthSchema = {
  tags: ["OAuth"],
  summary: "Inicia o fluxo de autenticação com o Instagram",
  response: {
    302: {
      description: "Redireciona para o Instagram",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};
