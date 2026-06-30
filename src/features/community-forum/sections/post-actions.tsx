"use client";

import { Heart, MessageCircle, Share2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useForum } from "@/features/community-forum/forum-context";

/**
 * Like / comment / share action row for a post. The like button is
 * fully functional (optimistic toggle via the forum context); the
 * comment button focuses or expands the thread via `onComment`.
 */
export function PostActions({
  postId,
  likes,
  likedByMe,
  commentCount,
  onComment,
  className,
}: {
  postId: string;
  likes: number;
  likedByMe: boolean;
  commentCount: number;
  onComment?: () => void;
  className?: string;
}) {
  const { toggleLike, isLoggedIn } = useForum();

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-sm text-mist",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => isLoggedIn && toggleLike(postId)}
        disabled={!isLoggedIn}
        aria-pressed={likedByMe}
        aria-label={likedByMe ? "Unlike" : "Like"}
        className={cn(
          "group inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-medium transition-colors",
          "hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60",
          likedByMe ? "text-rose-400" : "hover:text-cloud",
        )}
      >
        <Heart
          className={cn(
            "h-[18px] w-[18px] transition-transform group-active:scale-90",
            likedByMe && "fill-rose-400",
          )}
        />
        <span className="tabular-nums">{likes}</span>
      </button>

      <button
        type="button"
        onClick={onComment}
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-medium transition-colors hover:bg-white/[0.05] hover:text-cloud"
      >
        <MessageCircle className="h-[18px] w-[18px]" />
        <span className="tabular-nums">{commentCount}</span>
      </button>

      <span className="ml-auto">
        <span className="inline-flex cursor-default items-center gap-2 rounded-full px-3 py-1.5 font-medium text-faint">
          <Share2 className="h-[18px] w-[18px]" />
          <span className="hidden sm:inline">Share</span>
        </span>
      </span>
    </div>
  );
}
