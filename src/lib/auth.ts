import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { client, db } from "./mongodb";

export const auth = betterAuth({

  session: {
    cookieCache: {
      enabled: true,       // ✅ এটি true করলে তবেই session_data কুকি তৈরি হবে
      maxAge: 7 * 24 * 60 * 60, // ৭ দিন
      strategy: "jwt",     // বা "compact" / "jwe"
    },
  },
  plugins: [
    jwt()
  ],

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },


});