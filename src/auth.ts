import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

function oauthProviders() {
  const providers: NextAuthConfig["providers"] = [];

  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    providers.push(
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
    );
  }

  if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
    providers.push(
      GitHub({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      }),
    );
  }

  return providers;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: oauthProviders(),
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.uid = `${account.provider}:${account.providerAccountId}`;
        token.provider = account.provider;
      }
      if (profile && "name" in profile && profile.name) {
        token.name = profile.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.uid ?? token.sub ?? "oauth");
        session.user.provider = typeof token.provider === "string" ? token.provider : undefined;
      }
      return session;
    },
  },
});
