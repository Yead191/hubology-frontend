"use client";

import * as React from "react";

export interface MockUser {
  name: string;
  email: string;
  avatar: string;
  /** Customers are "member"; verified vendors are "expert". */
  role: "member" | "expert";
}

interface AuthContextValue {
  user: MockUser | null;
  isLoggedIn: boolean;
  /** UI-only toggle so you can preview both nav states. */
  toggleAuth: () => void;
  logout: () => void;
}

const DEMO_USER: MockUser = {
  name: "Helena Thorne",
  email: "helena@thornetax.com",
  avatar: "https://i.pravatar.cc/200?img=5",
  role: "member",
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

/**
 * Frontend-only auth stand-in. Defaults to logged-in so the profile +
 * notification UI is visible out of the box (per the brief). Swap this
 * provider for a real session provider when a backend exists.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<MockUser | null>(DEMO_USER);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      isLoggedIn: user !== null,
      toggleAuth: () => setUser((u) => (u ? null : DEMO_USER)),
      logout: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
