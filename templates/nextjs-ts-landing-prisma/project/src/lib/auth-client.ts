import { createAuthClient } from "better-auth/react";
import { emailOTPClient, adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [emailOTPClient(), adminClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
