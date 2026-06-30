"use client";

import * as React from "react";

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

const MAX = 1000;

/**
 * Modal form for composing or editing a post (category + description).
 * Pass `post` to open in edit mode; omit it to create a new post.
 */
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
  const { currentUser, addPost, updatePost } = useForum();
  const isEditing = !!post;
  const [category, setCategory] = React.useState<ForumCategory | "">("");
  const [content, setContent] = React.useState("");

  // Seed the form from the edited post (or clear it) on each open.
  React.useEffect(() => {
    if (open) {
      setCategory(post?.category ?? "");
      setContent(post?.content ?? "");
    }
  }, [open, post]);

  const canSubmit = category !== "" && content.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (isEditing && post) {
      updatePost(post.id, { category: category as ForumCategory, content });
      onClose();
      return;
    }
    const created = addPost({ category: category as ForumCategory, content });
    onClose();
    if (created) onCreated?.(created.id);
  };

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
        {/* Posting-as identity (profile info captured on submit) */}
        {currentUser && (
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
        )}

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
          <label htmlFor="post-content" className="text-sm font-medium text-cloud">
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
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            {isEditing ? "Save changes" : "Publish post"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
