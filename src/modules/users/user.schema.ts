export const userSchema = {
  tags: ["Users"],
  summary: "Retorna dados do usuário",
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Dados do usuário",
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
      description: "Usuário não encontrado",
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

export const updateProfileSchema = {
  tags: ["Users"],
  summary: "Atualiza dados do usuário",
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["currentPassword"],
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      currentPassword: { type: "string" },
      newPassword: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Dados atualizados",
      type: "object",
      properties: {
        message: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
            provider: { type: "string" },
            providerId: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
      },
    },
    400: {
      description: "Usuário não encontrado",
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
