import getProfile from "@/helpers/next-fetch/getProfile";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { ForumProvider } from "@/features/community-forum/forum-context";
import type { ForumStats } from "@/types";

async function fetchStatTotal(url: string) {
  const res = await nextFetch(url, {
    method: "GET",
    cache: "no-store",
    tags: ["forum-posts"],
  });
  return res.success ? (res.pagination?.total ?? 0) : 0;
}

/**
 * Wraps all /forum routes. Auth + activity stats come from getProfile
 * and the my-* endpoints.
 */
export default async function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getProfile();

  let stats: ForumStats = { posts: 0, comments: 0, likes: 0 };
  if (user) {
    const [posts, comments, likes] = await Promise.all([
      fetchStatTotal("/posts/my-posts?page=1&limit=1"),
      fetchStatTotal("/comment/my-comments?page=1&limit=1"),
      fetchStatTotal("/like/my?page=1&limit=1"),
    ]);
    stats = { posts, comments, likes };
  }

  return (
    <ForumProvider user={user} stats={stats}>
      {children}
    </ForumProvider>
  );
}
