export type Register = {
  email: string;
  password: string;
  name: string;
};

export type Login = {
  email: string;
  password: string;
};

export type OauthLogin = {
  id: string;
  email: string;
  name: string | "";
};

export type InstagramUser = { // precisei criar para corrigir conflitos de tipo.
  id: string;
  username: string; 
};

export type RefreshToken = {
  refreshToken: string
}

export type User = {
  id: string
}

export type UpdateProfile = {
  name?: string;
  currentPassword: string;
  newPassword?: string;
}