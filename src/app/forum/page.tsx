import type { Metadata } from "next";

import type { ForumCategory, ForumPost, ForumTab, Pagination } from "@/types";
import { CATEGORY_VALUES } from "@/data/forum";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import getProfile from "@/helpers/next-fetch/getProfile";
import {
  hasForumAccess,
  mapForumPost,
  mapMyCommentedItems,
} from "@/lib/forum";
import CommunityForum from "@/features/community-forum";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Community Forum for Founders",
  description:
    "Join the Hubology community forum — ask questions, share playbooks, and get answers from verified experts and fellow founders.",
  path: "/forum",
  keywords: [
    "founder community forum",
    "entrepreneur discussion board",
    "ask business experts",
    "startup Q&A community",
    "verified expert forum",
    "business peer network",
  ],
});

/** Always re-run list fetches when ?tab= / filters change. */
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    searchTerm?: string;
    category?: string;
    page?: string;
    limit?: string;
    tab?: string;
  }>;
}

function parseTab(raw?: string): ForumTab {
  if (raw === "posts" || raw === "comments" || raw === "likes") return raw;
  return "feed";
}

function parseCategory(raw?: string): ForumCategory | "All" {
  if (raw && (CATEGORY_VALUES as string[]).includes(raw)) {
    return raw as ForumCategory;
  }
  return "All";
}

function buildListUrl(
  tab: ForumTab,
  filters: { searchTerm: string; category: string; page: number; limit: number },
) {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  if (tab === "feed") {
    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
    if (filters.category && filters.category !== "All") {
      params.set("category", filters.category);
    }
    return `/posts?${params.toString()}`;
  }
  if (tab === "posts") return `/posts/my-posts?${params.toString()}`;
  if (tab === "likes") return `/like/my?${params.toString()}`;
  return `/comment/my-comments?${params.toString()}`;
}

export default async function ForumPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const user = await getProfile();
  const unlocked = hasForumAccess(user);
  const tab = parseTab(sp.tab);
  const filters = {
    searchTerm: sp.searchTerm?.trim() ?? "",
    category: parseCategory(sp.category),
    page: Math.max(1, Number(sp.page) || 1),
    limit: Math.max(1, Number(sp.limit) || 10),
  };

  let posts: ForumPost[] = [];
  let pagination: Pagination | undefined;

  if (unlocked) {
    // Personal tabs require auth — fall back to feed data shape if logged out.
    const effectiveTab =
      !user && tab !== "feed" ? "feed" : tab;
    const url = buildListUrl(effectiveTab, {
      searchTerm: filters.searchTerm,
      category: filters.category,
      page: filters.page,
      limit: filters.limit,
    });

    const res = await nextFetch<any[]>(url, {
      method: "GET",
      cache: "no-store",
      // Tab-specific tag so one list doesn't collide with another in the cache.
      tags: [`forum-posts`, `forum-tab-${effectiveTab}`],
    });

    if (res.success) {
      pagination = res.pagination;
      const raw = Array.isArray(res.data) ? res.data : [];
      posts =
        effectiveTab === "comments"
          ? mapMyCommentedItems(raw)
          : raw.map(mapForumPost).filter((p) => Boolean(p.id));
    }
  }

  return (
    <CommunityForum
      key={`${tab}-${filters.page}-${filters.searchTerm}-${filters.category}`}
      hasForumAccess={unlocked}
      isLoggedIn={Boolean(user)}
      posts={posts}
      pagination={pagination}
      tab={tab}
      filters={filters}
    />
  );
}
