"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useForum } from "@/features/community-forum/forum-context";
import { CategoryBadge } from "./category-badge";
import { AuthorByline } from "./author-byline";
import { PostActions } from "./post-actions";
import { CommentItem } from "./comment-item";
import { CommentComposer } from "./comment-composer";
import { PostMenu } from "./post-menu";

/** Full-page view of a single post with its complete comment thread. */
export function PostDetail({ postId }: { postId: string }) {
  const router = useRouter();
  const { getPost } = useForum();
  const post = getPost(postId);

  const backLink = (
    <Link
      href="/forum"
      className="inline-flex items-center gap-2 text-sm font-medium text-mist transition-colors hover:text-cloud"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to forum
    </Link>
  );

  if (!post) {
    return (
      <section className="relative min-h-screen pt-28 pb-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          {backLink}
          <div className="border-gradient mt-6 rounded-3xl bg-panel/40 px-6 py-16 text-center">
            <h1 className="font-display text-xl font-semibold text-cloud">
              Post not found
            </h1>
            <p className="mt-2 text-sm text-mist">
              This post may have been removed, or the link is no longer valid.
            </p>
            <Button asChild className="mt-6">
              <Link href="/forum">Return to the feed</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {backLink}

        <article className="border-gradient mt-6 rounded-3xl bg-panel/40 p-5 sm:p-7">
          <header className="flex items-start justify-between gap-3">
            <AuthorByline author={post.author} timeAgo={post.timeAgo} />
            <div className="flex items-center gap-1">
              <CategoryBadge category={post.category} />
              <PostMenu post={post} onDeleted={() => router.push("/forum")} />
            </div>
          </header>

          <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-cloud/90">
            {post.content}
          </p>

          <div className="mt-5 border-t border-hairline pt-3">
            <PostActions
              className="w-full"
              postId={post.id}
              likes={post.likes}
              likedByMe={post.likedByMe}
              commentCount={post.comments.length}
            />
          </div>
        </article>

        {/* Comments */}
        <div className="mt-6">
          <h2 className="flex items-center gap-2 px-1 font-display text-lg font-semibold text-cloud">
            <MessageCircle className="h-5 w-5 text-violet-bright" />
            {post.comments.length}{" "}
            {post.comments.length === 1 ? "Comment" : "Comments"}
          </h2>

          <div className="mt-4 border-gradient rounded-3xl bg-panel/40 p-5 sm:p-6">
            <CommentComposer postId={post.id} />

            {post.comments.length > 0 && (
              <ul className="mt-6 flex flex-col gap-5 border-t border-hairline pt-6">
                {post.comments.map((c) => (
                  <CommentItem key={c.id} comment={c} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
