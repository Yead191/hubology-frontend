import {
  Receipt,
  ClipboardCheck,
  TrendingUp,
  Scale,
  UserPlus,
  Sparkles,
  type LucideIcon,
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
    value: "Taxation",
    label: "Taxation",
    icon: Receipt,
    accent: "text-emerald-300",
    tint: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    value: "Audit",
    label: "Audit",
    icon: ClipboardCheck,
    accent: "text-sky-300",
    tint: "bg-sky-400/10 border-sky-400/20",
  },
  {
    value: "Funding",
    label: "Funding",
    icon: TrendingUp,
    accent: "text-violet-bright",
    tint: "bg-violet/15 border-violet/25",
  },
  {
    value: "Legal",
    label: "Legal",
    icon: Scale,
    accent: "text-amber-300",
    tint: "bg-amber-400/10 border-amber-400/20",
  },
  {
    value: "Hiring",
    label: "Hiring",
    icon: UserPlus,
    accent: "text-rose-300",
    tint: "bg-rose-400/10 border-rose-400/20",
  },
  {
    value: "Others",
    label: "Others",
    icon: Sparkles,
    accent: "text-cyan-300",
    tint: "bg-cyan-400/10 border-cyan-400/20",
  },
];

export const CATEGORY_VALUES = FORUM_CATEGORIES.map((c) => c.value);

export function getCategoryMeta(category: ForumCategory): CategoryMeta {
  return (
    FORUM_CATEGORIES.find((c) => c.value === category) ?? FORUM_CATEGORIES[5]
  );
}
