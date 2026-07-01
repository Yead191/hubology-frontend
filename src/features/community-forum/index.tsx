"use client";

import * as React from "react";
import { MessageSquareDashed, SearchX } from "lucide-react";

import type { ForumPost } from "@/types";
import { Aurora } from "@/components/ui/aurora";
import { useForum } from "@/features/community-forum/forum-context";
import {
  ForumSidebar,
  type ForumTab,
} from "@/features/community-forum/sections/forum-sidebar";
import {
  FeedToolbar,
  type CategoryFilter,
} from "@/features/community-forum/sections/feed-toolbar";
import { PostCard } from "@/features/community-forum/sections/post-card";
import { NewPostModal } from "@/features/community-forum/sections/new-post-modal";
import { EmptyState } from "@/features/community-forum/sections/empty-state";
import { useMembership } from "@/features/membership/membership-context";
import { ForumLockCard } from "@/features/membership/sections/forum-lock";

const TAB_EMPTY: Record<
  ForumTab,
  { title: string; message: string }
> = {
  feed: {
    title: "No posts yet",
    message: "Be the first to start a discussion with the community.",
  },
  posts: {
    title: "You haven't posted yet",
    message: "Share a question or insight — your posts will appear here.",
  },
  comments: {
    title: "No comments yet",
    message: "Posts you comment on will show up here for quick access.",
  },
  likes: {
    title: "Nothing liked yet",
    message: "Tap the heart on posts you find useful to save them here.",
  },
};

export default function CommunityForum() {
  const { posts, myPosts, likedPosts, commentedPosts } = useForum();
  const { hasForumAccess } = useMembership();

  const [tab, setTab] = React.useState<ForumTab>("feed");
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<CategoryFilter>("All");
  const [modalOpen, setModalOpen] = React.useState(false);

  // 1) Pick the base list from the active sidebar tab.
  const base: ForumPost[] = React.useMemo(() => {
    switch (tab) {
      case "posts":
        return myPosts;
      case "likes":
        return likedPosts;
      case "comments":
        return commentedPosts;
      default:
        return posts;
    }
  }, [tab, posts, myPosts, likedPosts, commentedPosts]);

  // 2) Apply category + search filters.
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return base.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.content.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [base, category, query]);

  const isSearching = query.trim() !== "" || category !== "All";
  const empty = TAB_EMPTY[tab];

  const header = (
    <header className="max-w-2xl">
      <span className="eyebrow">Community</span>
      <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-cloud sm:text-4xl">
        The Hubology <span className="text-gradient">Forum</span>
      </h1>
      <p className="mt-3 text-pretty text-mist">
        Founders and verified experts, in one room. Ask questions, share wins,
        and learn from people who&apos;ve done it before.
      </p>
    </header>
  );

  // Members-only gate: show a blurred preview behind the lock card.
  if (!hasForumAccess) {
    return (
      <section className="relative min-h-screen overflow-hidden pt-28 pb-20">
        <Aurora
          animated
          className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-40"
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {header}

          <div className="relative mt-10">
            {/* Decorative, non-interactive preview of the real feed */}
            <div
              aria-hidden
              className="pointer-events-none select-none blur-[7px] mask-[linear-gradient(to_bottom,black,transparent_80%)]"
            >
              <div className="mx-auto flex max-w-2xl flex-col gap-5 opacity-70">
                {posts.slice(0, 3).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 flex items-start justify-center pt-8 sm:pt-16">
              <ForumLockCard />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-28 pb-20">
      <Aurora
        animated
        className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-40"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {header}

        {/* Two-column workspace */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr] lg:gap-8">
          {/* Left rail */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ForumSidebar
              active={tab}
              onChange={setTab}
              onNewPost={() => setModalOpen(true)}
            />
          </div>

          {/* Feed */}
          <div className="flex flex-col gap-5">
            <FeedToolbar
              query={query}
              onQueryChange={setQuery}
              category={category}
              onCategoryChange={setCategory}
            />

            {filtered.length === 0 ? (
              isSearching ? (
                <EmptyState
                  icon={SearchX}
                  title="No matching posts"
                  message="Try a different search term or clear the category filter."
                />
              ) : (
                <EmptyState
                  icon={MessageSquareDashed}
                  title={empty.title}
                  message={empty.message}
                />
              )
            ) : (
              <div className="flex flex-col gap-5">
                {filtered.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <NewPostModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
