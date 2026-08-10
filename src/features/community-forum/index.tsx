"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MessageSquareDashed, SearchX } from "lucide-react";

import type {
  ForumCategory,
  ForumPost,
  ForumTab,
  Pagination,
} from "@/types";
import { Aurora } from "@/components/ui/aurora";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  ForumSidebar,
} from "@/features/community-forum/sections/forum-sidebar";
import {
  FeedToolbar,
  type CategoryFilter,
} from "@/features/community-forum/sections/feed-toolbar";
import { PostCard } from "@/features/community-forum/sections/post-card";
import { NewPostModal } from "@/features/community-forum/sections/new-post-modal";
import { EmptyState } from "@/features/community-forum/sections/empty-state";
import { ForumLockCard } from "@/features/membership/sections/forum-lock";

const TAB_EMPTY: Record<ForumTab, { title: string; message: string }> = {
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

export interface ForumFilters {
  searchTerm: string;
  category: ForumCategory | "All";
  page: number;
  limit: number;
}

function buildForumHref(
  tab: ForumTab,
  filters: Partial<ForumFilters>,
) {
  const params = new URLSearchParams();
  if (tab !== "feed") params.set("tab", tab);
  // Search / category only apply to the community feed.
  if (tab === "feed") {
    const search = (filters.searchTerm ?? "").trim();
    if (search) params.set("searchTerm", search);
    if (filters.category && filters.category !== "All") {
      params.set("category", filters.category);
    }
  }
  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }
  if (filters.limit && filters.limit !== 10) {
    params.set("limit", String(filters.limit));
  }
  const qs = params.toString();
  return qs ? `/forum?${qs}` : "/forum";
}

export default function CommunityForum({
  hasForumAccess,
  isLoggedIn,
  posts,
  pagination,
  tab,
  filters,
}: {
  hasForumAccess: boolean;
  isLoggedIn: boolean;
  posts: ForumPost[];
  pagination?: Pagination;
  tab: ForumTab;
  filters: ForumFilters;
}) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState(filters.searchTerm);

  React.useEffect(() => {
    setSearchInput(filters.searchTerm);
  }, [filters.searchTerm]);

  const push = React.useCallback(
    (next: { tab?: ForumTab } & Partial<ForumFilters>) => {
      const nextTab = next.tab ?? tab;
      const href = buildForumHref(nextTab, {
        searchTerm:
          nextTab === "feed"
            ? (next.searchTerm ?? filters.searchTerm)
            : "",
        category:
          nextTab === "feed" ? (next.category ?? filters.category) : "All",
        page: next.page ?? 1,
        limit: next.limit ?? filters.limit,
      });
      router.push(href);
      // Soft-nav between ?tab= values can reuse a stale RSC payload —
      // refresh forces the matching list endpoint to re-run.
      router.refresh();
    },
    [router, tab, filters],
  );

  // Debounced search only applies on the community feed.
  React.useEffect(() => {
    if (tab !== "feed") return;
    if (searchInput === filters.searchTerm) return;
    const timer = setTimeout(() => {
      push({ tab: "feed", searchTerm: searchInput, page: 1 });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, filters.searchTerm, push, tab]);

  const empty = TAB_EMPTY[tab];
  const isSearching =
    Boolean(filters.searchTerm.trim()) || filters.category !== "All";

  const header = (
    <header className="max-w-2xl">
      <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-cloud sm:text-4xl">
        The Hubology <span className="text-gradient">Forum</span>
      </h1>
      <p className="mt-3 text-pretty text-mist">
        Founders and verified experts, in one room. Ask questions, share wins,
        and learn from people who&apos;ve done it before.
      </p>
    </header>
  );

  if (!hasForumAccess) {
    return (
      <section className="relative min-h-screen overflow-hidden pt-28 pb-20">
        <Aurora
          animated
          className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-40"
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {header}
          <div className="relative mt-10 flex justify-center pt-8 sm:pt-16">
            <ForumLockCard isLoggedIn={isLoggedIn} />
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

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ForumSidebar
              active={tab}
              onChange={(next) => push({ tab: next, page: 1 })}
              onNewPost={() => setModalOpen(true)}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            {tab === "feed" ? (
              <FeedToolbar
                query={searchInput}
                onQueryChange={setSearchInput}
                category={filters.category as CategoryFilter}
                onCategoryChange={(c) =>
                  push({ category: c, searchTerm: searchInput, page: 1 })
                }
              />
            ) : null}

            {posts.length === 0 ? (
              isSearching && tab === "feed" ? (
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
              <div key={tab} className="flex flex-col gap-5">
                {posts.map((post) => (
                  <PostCard key={`${tab}-${post.id}`} post={post} />
                ))}
              </div>
            )}

            {pagination && pagination.totalPage > 1 ? (
              <PaginationControls
                pagination={pagination}
                onPageChange={(page) => push({ page })}
              />
            ) : null}
          </div>
        </div>
      </div>

      <NewPostModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
