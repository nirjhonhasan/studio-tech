import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { client, db } from "./mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: { 
    enabled: true, 
  }, 

  // Google sign-in activates automatically once you add GOOGLE_CLIENT_ID and
  // GOOGLE_CLIENT_SECRET to .env.local (Google Cloud Console → OAuth client,
  // redirect URI: {BETTER_AUTH_URL}/api/auth/callback/google).
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          },
        }
      : {}),
  },
});