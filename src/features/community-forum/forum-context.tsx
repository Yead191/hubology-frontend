"use client";

import * as React from "react";

import type { ForumAuthor, ForumAuthorRole, ForumPost, ForumStats } from "@/types";
import { getImageUrl } from "@/lib/getImageUrl";

interface ForumContextValue {
  currentUser: ForumAuthor | null;
  isLoggedIn: boolean;
  userId: string | null;
  stats: ForumStats;
  isOwnPost: (post: ForumPost) => boolean;
}

const ForumContext = React.createContext<ForumContextValue | null>(null);

function mapRole(role?: string): ForumAuthorRole {
  const r = (role ?? "").toLowerCase();
  if (r === "vendor" || r === "expert") return "vendor";
  return "member";
}

function toForumAuthor(user: {
  _id?: string;
  name?: string;
  image?: string;
  role?: string;
  company?: string;
  interest?: string;
} | null): ForumAuthor | null {
  if (!user?.name) return null;
  return {
    id: user._id,
    name: user.name,
    avatarUrl: getImageUrl(user.image) ?? user.image ?? "",
    role: mapRole(user.role),
    headline: user.company || user.interest || undefined,
  };
}

export function ForumProvider({
  children,
  user = null,
  stats = { posts: 0, comments: 0, likes: 0 },
}: {
  children: React.ReactNode;
  user?: {
    _id?: string;
    name?: string;
    image?: string;
    role?: string;
    company?: string;
    interest?: string;
  } | null;
  stats?: ForumStats;
}) {
  const isLoggedIn = Boolean(user);
  const currentUser = React.useMemo(() => toForumAuthor(user), [user]);
  const userId = user?._id ?? null;

  const isOwnPost = React.useCallback(
    (post: ForumPost) =>
      Boolean(userId && post.author.id && post.author.id === userId),
    [userId],
  );

  const value = React.useMemo<ForumContextValue>(
    () => ({
      currentUser,
      isLoggedIn,
      userId,
      stats,
      isOwnPost,
    }),
    [currentUser, isLoggedIn, userId, stats, isOwnPost],
  );

  return (
    <ForumContext.Provider value={value}>{children}</ForumContext.Provider>
  );
}

export function useForum() {
  const ctx = React.useContext(ForumContext);
  if (!ctx) throw new Error("useForum must be used within a ForumProvider");
  return ctx;
}
