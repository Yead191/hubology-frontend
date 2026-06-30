"use client";

import * as React from "react";

import type { ForumAuthor, ForumCategory, ForumPost } from "@/types";
import { useAuth } from "@/components/auth/auth-context";
import { SEED_POSTS } from "@/data/forum";

interface NewPostInput {
  category: ForumCategory;
  content: string;
}

interface ForumContextValue {
  posts: ForumPost[];
  /** The signed-in viewer mapped to a forum author, or null if logged out. */
  currentUser: ForumAuthor | null;
  isLoggedIn: boolean;

  getPost: (id: string) => ForumPost | undefined;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  addPost: (input: NewPostInput) => ForumPost | null;
  updatePost: (postId: string, input: NewPostInput) => void;
  deletePost: (postId: string) => void;
  /** True when the given post was authored by the current user. */
  isOwnPost: (post: ForumPost) => boolean;

  /** Posts authored by the current user. */
  myPosts: ForumPost[];
  /** Posts the current user has liked. */
  likedPosts: ForumPost[];
  /** Posts the current user has commented on. */
  commentedPosts: ForumPost[];
  stats: { posts: number; comments: number; likes: number };
}

const ForumContext = React.createContext<ForumContextValue | null>(null);

let commentSeq = 0;
let postSeq = 0;

export function ForumProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [posts, setPosts] = React.useState<ForumPost[]>(SEED_POSTS);

  // The demo auth user is a founder/member by default.
  const currentUser = React.useMemo<ForumAuthor | null>(
    () =>
      user
        ? { name: user.name, avatarUrl: user.avatar, role: "member" }
        : null,
    [user],
  );

  const getPost = React.useCallback(
    (id: string) => posts.find((p) => p.id === id),
    [posts],
  );

  const toggleLike = React.useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likes: p.likes + (p.likedByMe ? -1 : 1),
            }
          : p,
      ),
    );
  }, []);

  const addComment = React.useCallback(
    (postId: string, text: string) => {
      const trimmed = text.trim();
      if (!currentUser || !trimmed) return;
      const comment = {
        id: `comment-new-${++commentSeq}`,
        author: currentUser,
        text: trimmed,
        timeAgo: "Just now",
      };
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: [...p.comments, comment] } : p,
        ),
      );
    },
    [currentUser],
  );

  const addPost = React.useCallback(
    ({ category, content }: NewPostInput) => {
      const trimmed = content.trim();
      if (!currentUser || !trimmed) return null;
      const post: ForumPost = {
        id: `post-new-${++postSeq}`,
        author: currentUser,
        category,
        content: trimmed,
        timeAgo: "Just now",
        likes: 0,
        likedByMe: false,
        comments: [],
      };
      setPosts((prev) => [post, ...prev]);
      return post;
    },
    [currentUser],
  );

  const updatePost = React.useCallback(
    (postId: string, { category, content }: NewPostInput) => {
      const trimmed = content.trim();
      if (!trimmed) return;
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, category, content: trimmed, timeAgo: "Edited just now" }
            : p,
        ),
      );
    },
    [],
  );

  const deletePost = React.useCallback((postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const isOwnPost = React.useCallback(
    (post: ForumPost) => !!currentUser && post.author.name === currentUser.name,
    [currentUser],
  );

  const { myPosts, likedPosts, commentedPosts, stats } = React.useMemo(() => {
    const name = currentUser?.name;
    const mine = name ? posts.filter((p) => p.author.name === name) : [];
    const liked = posts.filter((p) => p.likedByMe);
    const commented = name
      ? posts.filter((p) => p.comments.some((c) => c.author.name === name))
      : [];
    const commentCount = name
      ? posts.reduce(
          (sum, p) =>
            sum + p.comments.filter((c) => c.author.name === name).length,
          0,
        )
      : 0;
    return {
      myPosts: mine,
      likedPosts: liked,
      commentedPosts: commented,
      stats: { posts: mine.length, comments: commentCount, likes: liked.length },
    };
  }, [posts, currentUser]);

  const value = React.useMemo<ForumContextValue>(
    () => ({
      posts,
      currentUser,
      isLoggedIn,
      getPost,
      toggleLike,
      addComment,
      addPost,
      updatePost,
      deletePost,
      isOwnPost,
      myPosts,
      likedPosts,
      commentedPosts,
      stats,
    }),
    [
      posts,
      currentUser,
      isLoggedIn,
      getPost,
      toggleLike,
      addComment,
      addPost,
      updatePost,
      deletePost,
      isOwnPost,
      myPosts,
      likedPosts,
      commentedPosts,
      stats,
    ],
  );

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>;
}

export function useForum() {
  const ctx = React.useContext(ForumContext);
  if (!ctx) throw new Error("useForum must be used within a ForumProvider");
  return ctx;
}
