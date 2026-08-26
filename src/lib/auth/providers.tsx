"use client";

import { createContext, useContext, ReactNode } from "react";
import { authClient, signIn, signOut } from "./client";

/**
 * Type alias — the session/user we care about in the client.
 * We keep it loose so it works with both the base BetterAuth
 * types and the admin-plugin-extended types.
 */
interface Session {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    impersonatedBy?: string | null;
  };
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null;
    role?: string;
  };
}

interface AuthContextValue {
  session: Session | null;
  user: Session["user"] | null;
  isLoading: boolean;
  signIn: typeof signIn;
  signOut: typeof signOut;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

/**
 * Wraps the app so that `useAuth()` is available in any Client
 * Component.  Under the hood it relies on BetterAuth's `useSession`
 * hook, which reads the session cookie and keeps state in sync.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: sessionData, isPending } = authClient.useSession();
  const session: Session | null = sessionData
    ? {
        session: {
          id: sessionData.session.id,
          createdAt: sessionData.session.createdAt,
          updatedAt: sessionData.session.updatedAt,
          userId: sessionData.session.userId,
          expiresAt: sessionData.session.expiresAt,
          token: sessionData.session.token,
          ipAddress: sessionData.session.ipAddress,
          userAgent: sessionData.session.userAgent,
          impersonatedBy: (
            sessionData.session as { impersonatedBy?: string }
          ).impersonatedBy,
        },
        user: {
          id: sessionData.user.id,
          createdAt: sessionData.user.createdAt,
          updatedAt: sessionData.user.updatedAt,
          email: sessionData.user.email,
          emailVerified: sessionData.user.emailVerified,
          name: sessionData.user.name,
          image: sessionData.user.image,
          role: (
            sessionData.user as { role?: string }
          ).role,
        },
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading: isPending,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
