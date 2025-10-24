import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP, admin } from "better-auth/plugins";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { env } from "./env";

const prisma = new PrismaClient();
const resend = new Resend(env.RESEND_API_KEY);

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      prompt: "select_account",
    },
  },
  user: {
    additionalFields: {
      lastName: {
        type: "string",
        required: false,
      },
      username: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
      },
    },
  },
  plugins: [
    admin({
      defaultBanReason: "Has sido baneado por violación de nuestros términos y condiciones",
    }),
  ],
});
