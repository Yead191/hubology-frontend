"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { ForumPost } from "@/types";
import { CategoryBadge } from "./category-badge";
import { AuthorByline } from "./author-byline";
import { PostActions } from "./post-actions";
import { CommentComposer } from "./comment-composer";
import { PostMenu } from "./post-menu";

/**
 * A post in the feed. Content clamps with expand; comments live on the
 * detail page (API returns counts on the list, not nested comments).
 */
export function PostCard({ post }: { post: ForumPost }) {
  const [expanded, setExpanded] = React.useState(false);
  const [showComposer, setShowComposer] = React.useState(false);

  const longContent = post.content.length > 280;

  return (
    <article className="border-gradient rounded-3xl bg-panel/40 p-5 transition-colors duration-300 hover:bg-panel/60 sm:p-6">
      <header className="flex items-start justify-between gap-3">
        <AuthorByline author={post?.author} timeAgo={post?.timeAgo} />
        <div className="flex items-center gap-1">
          <CategoryBadge category={post?.category || "Other"} />
          <PostMenu post={post} />
        </div>
      </header>

      <div className="mt-4">
        <p
          className={cn(
            "text-[15px] leading-relaxed text-cloud/90",
            !expanded && longContent && "line-clamp-4",
          )}
        >
          {post.content}
        </p>
        {longContent && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1.5 text-sm font-medium text-violet-bright transition-colors hover:text-violet"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      <div className="mt-4 border-t border-hairline pt-3">
        <PostActions
          className="w-full"
          postId={post.id}
          likes={post.likes}
          likedByMe={post.likedByMe}
          commentCount={post.commentCount}
          onComment={() => setShowComposer((v) => !v)}
        />
      </div>

      <Link
        href={`/forum/${post.id}`}
        className="mt-2 inline-flex text-sm font-medium text-violet-bright/80 transition-colors hover:text-violet-bright"
      >
        View full thread →
      </Link>

      {showComposer ? (
        <div className="mt-4 flex flex-col gap-3">
          {post.commentCount > 0 ? (
            <Link
              href={`/forum/${post.id}`}
              className="text-sm font-medium text-mist transition-colors hover:text-cloud"
            >
              View all {post.commentCount} comments
            </Link>
          ) : null}
          <CommentComposer postId={post.id} autoFocus />
        </div>
      ) : null}
    </article>
  );
}
