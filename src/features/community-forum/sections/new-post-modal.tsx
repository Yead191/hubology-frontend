"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { ForumCategory, ForumPost } from "@/types";
import { FORUM_CATEGORIES } from "@/data/forum";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForum } from "@/features/community-forum/forum-context";
import {
  createForumPost,
  updateForumPost,
} from "@/helpers/next-fetch/forumActions";

const MAX = 1000;

export function NewPostModal({
  open,
  onClose,
  onCreated,
  post,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (postId: string) => void;
  post?: ForumPost;
}) {
  const router = useRouter();
  const { currentUser } = useForum();
  const isEditing = !!post;
  const [category, setCategory] = React.useState<ForumCategory | "">("");
  const [content, setContent] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setCategory(post?.category ?? "");
      setContent(post?.content ?? "");
    }
  }, [open, post]);

  const canSubmit =
    category !== "" && content.trim().length > 0 && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !category) return;

    setSubmitting(true);
    try {
      if (isEditing && post) {
        const res = await updateForumPost(post.id, {
          category: category as ForumCategory,
          content: content.trim(),
        });
        if (!res.success) {
          toast.error(res.message || "Could not update post.", {
            id: "forum-post",
          });
          return;
        }
        toast.success("Post updated", { id: "forum-post" });
        onClose();
        router.refresh();
        return;
      }

      const res = await createForumPost({
        category: category as ForumCategory,
        content: content.trim(),
      });
      if (!res.success) {
        toast.error(res.message || "Could not publish post.", {
          id: "forum-post",
        });
        return;
      }
      toast.success("Post published", { id: "forum-post" });
      const createdId =
        typeof res.data === "object" && res.data && "_id" in res.data
          ? String((res.data as { _id: string })._id)
          : typeof res.data === "string"
            ? res.data
            : undefined;
      onClose();
      router.refresh();
      if (createdId) onCreated?.(createdId);
    } catch {
      toast.error("Network error. Please try again.", { id: "forum-post" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit post" : "Start a discussion"}
      description={
        isEditing
          ? "Update your category or revise what you shared."
          : "Ask a question or share something useful with the community."
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {currentUser ? (
          <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-white/3 px-4 py-3">
            <Avatar className="h-9 w-9 ring-1 ring-hairline-strong">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback className="text-xs">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-cloud">
                Posting as {currentUser.name}
              </p>
              <p className="text-xs text-faint">
                {currentUser.role === "vendor" ? "Verified expert" : "Member"}
              </p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-cloud">Category</label>
          <Select
            value={category || undefined}
            onValueChange={(v) => setCategory(v as ForumCategory)}
          >
            <SelectTrigger aria-label="Select a category">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent className="z-130">
              {FORUM_CATEGORIES.map((c) => {
                const Icon = c.icon;
                return (
                  <SelectItem key={c.value} value={c.value}>
                    <span className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${c.accent}`} />
                      {c.label}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="post-content"
            className="text-sm font-medium text-cloud"
          >
            Description
          </label>
          <Textarea
            id="post-content"
            value={content}
            maxLength={MAX}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share the details, context, or your question…"
            className="min-h-36"
          />
          <span className="self-end text-xs text-faint tabular-nums">
            {content.length}/{MAX}
          </span>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : isEditing ? (
              "Save changes"
            ) : (
              "Publish post"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
