import fp from "fastify-plugin";
import oauth2 from "@fastify/oauth2";

export const oauthPlugin = fp(async (fastify) => {
  // Google
  fastify.register(oauth2, {
    name: "googleOAuth2",
    scope: ["profile", "email"],
    credentials: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID!,
        secret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      auth: oauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: "/auth/google",
    callbackUri: "http://localhost:3000/auth/google/callback",
  });

  // Github
  fastify.register(oauth2, {
    name: "githubOAuth2",
    scope: ["user:email"],
    credentials: {
      client: {
        id: process.env.GITHUB_CLIENT_ID!,
        secret: process.env.GITHUB_CLIENT_SECRET!,
      },
      auth: oauth2.GITHUB_CONFIGURATION,
    },
    startRedirectPath: "/auth/github",
    callbackUri: "http://localhost:3000/auth/github/callback",
  });

  // Facebook / Instagram
  fastify.register(oauth2, {
    name: "facebookOAuth2",
    scope: ["email", "public_profile"],
    credentials: {
      client: {
        id: process.env.FACEBOOK_CLIENT_ID!,
        secret: process.env.FACEBOOK_CLIENT_SECRET!,
      },
      auth: oauth2.FACEBOOK_CONFIGURATION,
    },
    startRedirectPath: "/auth/facebook",
    callbackUri: "http://localhost:3000/auth/facebook/callback",
  });

  fastify.register(oauth2, {
  name: "instagramOAuth2",
  scope: ["user_profile", "user_media"],
  credentials: {
    client: {
      id: process.env.INSTAGRAM_CLIENT_ID!,
      secret: process.env.INSTAGRAM_CLIENT_SECRET!,
    },
    auth: {
      authorizeHost: "https://api.instagram.com",
      authorizePath: "/oauth/authorize",
      tokenHost: "https://api.instagram.com",
      tokenPath: "/oauth/access_token",
    },
  },
  startRedirectPath: "/auth/instagram",
  callbackUri: "http://localhost:3000/auth/instagram/callback",
})

  
});
