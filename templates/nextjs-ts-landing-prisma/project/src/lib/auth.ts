import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP, admin } from "better-auth/plugins";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY!);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
