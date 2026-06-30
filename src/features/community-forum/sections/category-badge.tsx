import { cn } from "@/lib/utils";
import type { ForumCategory } from "@/types";
import { getCategoryMeta } from "@/data/forum";

/** Pill showing a category's icon + label in its accent colour. */
export function CategoryBadge({
  category,
  className,
}: {
  category: ForumCategory;
  className?: string;
}) {
  const meta = getCategoryMeta(category);
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        meta.tint,
        meta.accent,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}
