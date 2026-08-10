import {
  Receipt,
  Scale,
  UserPlus,
  Sparkles,
  type LucideIcon,
  Users,
  Megaphone,
  Calculator,
  Coffee,
} from "lucide-react";

import type { ForumCategory } from "@/types";

export interface CategoryMeta {
  value: ForumCategory;
  label: string;
  icon: LucideIcon;
  /** Tailwind text colour for the category accent. */
  accent: string;
  /** Tailwind background tint for chips/badges. */
  tint: string;
}

export const FORUM_CATEGORIES: CategoryMeta[] = [
  {
    value: "Networking",
    label: "Networking",
    icon: Users,
    accent: "text-emerald-300",
    tint: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    value: "Legal",
    label: "Legal",
    icon: Scale,
    accent: "text-amber-300",
    tint: "bg-amber-400/10 border-amber-400/20",
  },
  {
    value: "Taxation",
    label: "Taxation",
    icon: Receipt,
    accent: "text-sky-300",
    tint: "bg-sky-400/10 border-sky-400/20",
  },
  {
    value: "Marketing",
    label: "Marketing",
    icon: Megaphone,
    accent: "text-violet-bright",
    tint: "bg-violet/15 border-violet/25",
  },
  {
    value: "Finance & Accounting",
    label: "Finance & Accounting",
    icon: Calculator,
    accent: "text-cyan-300",
    tint: "bg-cyan-400/10 border-cyan-400/20",
  },
  {
    value: "Operation & HR",
    label: "Operation & HR",
    icon: UserPlus,
    accent: "text-rose-300",
    tint: "bg-rose-400/10 border-rose-400/20",
  },
  {
    value: "The Water Cooler",
    label: "The Water Cooler",
    icon: Coffee,
    accent: "text-orange-300",
    tint: "bg-orange-400/10 border-orange-400/20",
  },
  {
    value: "Other",
    label: "Other",
    icon: Sparkles,
    accent: "text-indigo-300",
    tint: "bg-indigo-400/10 border-indigo-400/20",
  },
];

export const CATEGORY_VALUES = FORUM_CATEGORIES.map((c) => c.value);

export function getCategoryMeta(category: ForumCategory): CategoryMeta {
  return (
    FORUM_CATEGORIES.find((c) => c.value === category) ?? FORUM_CATEGORIES[5]
  );
}
