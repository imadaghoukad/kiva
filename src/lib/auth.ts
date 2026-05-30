import type { DefaultSession, DefaultUser, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongoose";
import { User } from "@/models/User";

type UserPlan = "free" | "pro";
type UserRole = "user" | "admin";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      plan: UserPlan;
      role: UserRole;
    };
  }

  interface User extends DefaultUser {
    plan?: UserPlan;
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    plan?: UserPlan;
    role?: UserRole;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          plan: user.plan || "free",
          role: user.role || "user",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider !== "credentials") {
        await connectToDatabase();
        if (!user.email) {
          throw new Error("No email provided by OAuth provider.");
        }
        // Check if user exists
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          // Create new user
          const newUser = await User.create({
            email: user.email,
            name: user.name || "",
          });
          user.id = newUser._id?.toString() || newUser.id;
          user.plan = newUser.plan || "free";
          user.role = newUser.role || "user";
        } else {
          user.id = existingUser._id?.toString() || existingUser.id;
          user.plan = existingUser.plan || "free";
          user.role = existingUser.role || "user";
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.plan = user.plan || "free";
        token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id || "";
        session.user.plan = token.plan || "free";
        session.user.role = token.role || "user";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development",
};
