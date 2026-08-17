import type {
  ForumAuthor,
  ForumAuthorRole,
  ForumCategory,
  ForumComment,
  ForumPost,
  UserSubscription,
} from "@/types";
import { getImageUrl } from "@/lib/getImageUrl";
import { CATEGORY_VALUES } from "@/data/forum";

export function normalizeSubscriptionStatus(status?: string | null) {
  return (status ?? "")
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, "-");
}

/** True when the plan still grants access: `active` or `cancel-pending`. */
export function hasActiveSubscription(subscription?: UserSubscription | null) {
  if (!subscription) return false;
  const status = normalizeSubscriptionStatus(subscription.status);
  return status === "active" || status === "cancel-pending";
}

/**
 * Vendor directory access: active subscription OR admin-granted
 * `vendorProfile.isProfileVisible`.
 */
export function canAccessVendorDirectory(user?: {
  subscription?: UserSubscription | null;
  vendorProfile?: { isProfileVisible?: boolean } | null;
} | null) {
  if (!user) return false;
  if (hasActiveSubscription(user.subscription)) return true;
  return user.vendorProfile?.isProfileVisible === true;
}

export function hasForumAccess(
  user: {
    role?: string;
    subscription?: UserSubscription | null;
  } | null,
) {
  if (!user) return false;
  const role = (user.role ?? "").toLowerCase();
  if (role === "expert" || role === "vendor") return true;
  return hasActiveSubscription(user.subscription);
}

export function formatTimeAgo(iso?: string | null): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 45) return "Just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

function mapRole(role?: string): ForumAuthorRole {
  const r = (role ?? "").toLowerCase();
  if (r === "vendor" || r === "expert") return "vendor";
  return "member";
}

function normalizeCategory(raw?: string): ForumCategory {
  if (raw && (CATEGORY_VALUES as string[]).includes(raw)) {
    return raw as ForumCategory;
  }
  return "Other";
}

export function mapForumAuthor(raw: any): ForumAuthor {
  return {
    id: raw?._id ?? raw?.id,
    name: raw?.name ?? "Unknown",
    avatarUrl: getImageUrl(raw?.image) ?? raw?.image ?? "",
    role: mapRole(raw?.role),
    headline: raw?.company || raw?.headline || undefined,
  };
}

/** Normalize a GET /posts (or my-posts / like/my) item into ForumPost. */
export function mapForumPost(raw: any): ForumPost {
  const post = raw?.post && typeof raw.post === "object" ? raw.post : raw;
  return {
    id: String(post?._id ?? post?.id ?? ""),
    author: mapForumAuthor(post?.author ?? {}),
    category: normalizeCategory(post?.category),
    content: post?.content ?? "",
    createdAt: post?.createdAt,
    timeAgo: formatTimeAgo(post?.createdAt),
    likes: Number(post?.totalLikes ?? post?.likes ?? 0),
    likedByMe: Boolean(post?.isLiked ?? post?.isLikeByMe),
    commentCount: Number(post?.totalComments ?? post?.commentCount ?? 0),
    comments: Array.isArray(post?.comments)
      ? post.comments.map(mapForumComment)
      : undefined,
  };
}

export function mapForumComment(raw: any): ForumComment {
  return {
    id: String(raw?._id ?? raw?.id ?? ""),
    author: mapForumAuthor(raw?.author ?? {}),
    text: raw?.text ?? raw?.content ?? "",
    createdAt: raw?.createdAt,
    timeAgo: formatTimeAgo(raw?.createdAt),
  };
}

/**
 * `/comment/my-comments` may return posts or comment wrappers.
 * Prefer posts when present; otherwise map each item as a post-shaped card
 * if it carries post fields.
 */
export function mapMyCommentedItems(rawList: any[] | undefined): ForumPost[] {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .map((item) => {
      if (item?.post && typeof item.post === "object") {
        return mapForumPost({
          ...item.post,
          totalComments: item.post.totalComments ?? item.totalComments,
          totalLikes: item.post.totalLikes ?? item.totalLikes,
          isLiked: item.post.isLiked ?? item.isLiked,
        });
      }
      if (item?.content && item?.category) return mapForumPost(item);
      return null;
    })
    .filter((p): p is ForumPost => Boolean(p?.id));
}
