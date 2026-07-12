import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Role, Permission } from "@tradehubuae/config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role ?? "CUSTOMER";
        token.permissions = (user as any).permissions ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      (session.user as any).role = token.role;
      (session.user as any).permissions = token.permissions;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
});

export function hasPermission(
  userPermissions: Permission[],
  requiredPermission: Permission,
): boolean {
  return userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(
  userPermissions: Permission[],
  requiredPermissions: Permission[],
): boolean {
  return requiredPermissions.some((p) => userPermissions.includes(p));
}

export function hasAllPermissions(
  userPermissions: Permission[],
  requiredPermissions: Permission[],
): boolean {
  return requiredPermissions.every((p) => userPermissions.includes(p));
}

export type { Role, Permission };
export { NextAuth };
