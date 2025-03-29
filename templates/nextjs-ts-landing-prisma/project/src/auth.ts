/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getUserFromDb } from "./actions/user-actions";
import { db } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        // logic to salt and hash password
        // const pwHash = saltAndHashPassword(credentials.password)

        // logic to verify if user exists
        user = await getUserFromDb(credentials.email as string, credentials.password as string);

        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error("User not found.");
        }

        if (!user.success) {
          throw new Error(user.message);
        }

        // return user object with the their profile data
        return user.data as unknown as User;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.surname = user.surname;
        token.dni = user.dni;
        token.phone = user.phone;
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.surname = token.surname;
        session.user.dni = token.dni;
        session.user.phone = token.phone;
        session.user.id = token.id;
      }

      return session;
    },
  },
});
