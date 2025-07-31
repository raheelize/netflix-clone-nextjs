import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import { JWT } from "next-auth/jwt";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("No credentials provided");
          throw new Error("Please provide both email and password");
        }
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) {
          console.log("User not found:", credentials.email);
          throw new Error("No user found with this email");
        }
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          console.log("Invalid password for:", credentials.email);
          throw new Error("Invalid password");
        }
        console.log("User authenticated:", user.email);
        return { id: user.id, email: user.email, name: user.name };
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token && session.user) session.user.id = token.id;
      return session;
    }
  }
};

export default NextAuth(authOptions);