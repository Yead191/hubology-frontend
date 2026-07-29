"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useForum } from "@/features/community-forum/forum-context";
import { toggleForumLike } from "@/helpers/next-fetch/forumActions";

/**
 * Like / comment / share action row. Like hits POST /like/:postId.
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
  const router = useRouter();
  const { isLoggedIn } = useForum();
  const [pending, setPending] = React.useState(false);
  const [liked, setLiked] = React.useState(likedByMe);
  const [likeCount, setLikeCount] = React.useState(likes);

  React.useEffect(() => {
    setLiked(likedByMe);
    setLikeCount(likes);
  }, [likedByMe, likes]);

  async function handleLike() {
    if (!isLoggedIn || pending) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((c) => c + (nextLiked ? 1 : -1));
    setPending(true);
    try {
      const res = await toggleForumLike(postId);
      if (!res.success) {
        setLiked(!nextLiked);
        setLikeCount((c) => c + (nextLiked ? -1 : 1));
        toast.error(res.message || "Could not update like.", { id: "like" });
        return;
      }
      router.refresh();
    } catch {
      setLiked(!nextLiked);
      setLikeCount((c) => c + (nextLiked ? -1 : 1));
      toast.error("Network error. Please try again.", { id: "like" });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={cn("flex items-center gap-1 text-sm text-mist", className)}>
      <button
        type="button"
        onClick={handleLike}
        disabled={!isLoggedIn || pending}
        aria-pressed={liked}
        aria-label={liked ? "Unlike" : "Like"}
        className={cn(
          "group inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-medium transition-colors",
          "hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60",
          liked ? "text-rose-400" : "hover:text-cloud",
        )}
      >
        {pending ? (
          <Loader2 className="h-[18px] w-[18px] animate-spin" />
        ) : (
          <Heart
            className={cn(
              "h-[18px] w-[18px] transition-transform group-active:scale-90",
              liked && "fill-rose-400",
            )}
          />
        )}
        <span className="tabular-nums">{likeCount}</span>
      </button>

      <button
        type="button"
        onClick={onComment}
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-medium transition-colors hover:bg-white/5 hover:text-cloud"
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
