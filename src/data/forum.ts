import {
  Receipt,
  ClipboardCheck,
  TrendingUp,
  Scale,
  UserPlus,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import type { ForumCategory, ForumPost } from "@/types";

/* ------------------------------------------------------------------ *
 * Community forum — categories + seed posts.
 * Mock data only; swapping for a real API later touches this file
 * and the ForumProvider (src/features/community-forum/forum-context).
 * Avatars use i.pravatar.cc placeholders to match the rest of the app.
 * ------------------------------------------------------------------ */

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
  { value: "Taxation", label: "Taxation", icon: Receipt, accent: "text-emerald-300", tint: "bg-emerald-400/10 border-emerald-400/20" },
  { value: "Audit", label: "Audit", icon: ClipboardCheck, accent: "text-sky-300", tint: "bg-sky-400/10 border-sky-400/20" },
  { value: "Funding", label: "Funding", icon: TrendingUp, accent: "text-violet-bright", tint: "bg-violet/15 border-violet/25" },
  { value: "Legal", label: "Legal", icon: Scale, accent: "text-amber-300", tint: "bg-amber-400/10 border-amber-400/20" },
  { value: "Hiring", label: "Hiring", icon: UserPlus, accent: "text-rose-300", tint: "bg-rose-400/10 border-rose-400/20" },
  { value: "Others", label: "Others", icon: Sparkles, accent: "text-cyan-300", tint: "bg-cyan-400/10 border-cyan-400/20" },
];

export const CATEGORY_VALUES = FORUM_CATEGORIES.map((c) => c.value);

export function getCategoryMeta(category: ForumCategory): CategoryMeta {
  return (
    FORUM_CATEGORIES.find((c) => c.value === category) ?? FORUM_CATEGORIES[5]
  );
}

const pravatar = (img: number) => `https://i.pravatar.cc/200?img=${img}`;

/**
 * Seed feed. Includes posts authored by the demo user
 * ("Helena Thorne") and one she liked / commented on so the
 * "My Posts / Comments / Likes" tabs are populated out of the box.
 */
export const SEED_POSTS: ForumPost[] = [
  {
    id: "post-01",
    author: { name: "Alex Babu", avatarUrl: pravatar(11), role: "member" },
    category: "Taxation",
    content:
      "Just incorporated my SaaS in Delaware but I'm based in Australia. Trying to understand how the US–AU tax treaty affects withholding on the income I draw. Has anyone navigated this without double-taxation surprises? Looking for a CPA who actually understands cross-border SaaS.",
    timeAgo: "2 hours ago",
    likes: 4,
    likedByMe: true,
    comments: [
      {
        id: "comment-01",
        author: { name: "Sarah Jenkins", avatarUrl: pravatar(47), role: "vendor", headline: "Cross-border CPA" },
        text: "The treaty caps withholding at 5% on most service income — but you must file a W-8BEN-E first. Happy to walk you through it.",
        timeAgo: "1 hour ago",
      },
      {
        id: "comment-02",
        author: { name: "Marcus Thorne", avatarUrl: pravatar(33), role: "member" },
        text: "Went through this exact thing last year. Get the EIN sorted before you draw anything — saved me a painful amendment.",
        timeAgo: "44 minutes ago",
      },
    ],
  },
  {
    id: "post-02",
    author: { name: "Priya Nair", avatarUrl: pravatar(45), role: "vendor", headline: "Audit & Assurance Lead" },
    category: "Audit",
    content:
      "PSA for early-stage founders: keep your contractor agreements and invoices in one place from day one. The number of seed-stage companies that scramble during their first audit because receipts live across three inboxes is staggering. A simple folder structure saves weeks.",
    timeAgo: "5 hours ago",
    likes: 18,
    likedByMe: false,
    comments: [
      {
        id: "comment-03",
        author: { name: "Helena Thorne", avatarUrl: "https://i.pravatar.cc/200?img=5", role: "member" },
        text: "This is gold. We adopted a shared drive convention after our first messy quarter and it changed everything.",
        timeAgo: "3 hours ago",
      },
    ],
  },
  {
    id: "post-03",
    author: { name: "Helena Thorne", avatarUrl: "https://i.pravatar.cc/200?img=5", role: "member" },
    category: "Funding",
    content:
      "We're raising a pre-seed round and I keep getting conflicting advice on SAFE vs priced rounds. For a sub-$1M raise with angels, is a post-money SAFE genuinely the cleaner path, or am I setting up a messy cap table for later? Would love to hear from anyone who's been on both sides.",
    timeAgo: "1 day ago",
    likes: 9,
    likedByMe: false,
    comments: [
      {
        id: "comment-04",
        author: { name: "Daniel Osei", avatarUrl: pravatar(60), role: "vendor", headline: "Startup Counsel" },
        text: "Post-money SAFEs are cleaner for small angel rounds — just track your total SAFE dilution carefully so the priced round doesn't shock you.",
        timeAgo: "20 hours ago",
      },
    ],
  },
  {
    id: "post-04",
    author: { name: "Daniel Osei", avatarUrl: pravatar(60), role: "vendor", headline: "Startup Counsel" },
    category: "Legal",
    content:
      "Reminder that your founder vesting schedule should be in place before you take outside money, not after. Retrofitting vesting once there's an investor on the cap table is awkward and sometimes triggers tax events. Four-year vest, one-year cliff is still the sensible default.",
    timeAgo: "2 days ago",
    likes: 27,
    likedByMe: true,
    comments: [],
  },
  {
    id: "post-05",
    author: { name: "Mia Fontaine", avatarUrl: pravatar(24), role: "member" },
    category: "Hiring",
    content:
      "First engineering hire question: do you go contract-to-hire or permanent from the start? We're 6 months in, revenue-positive but lean. Worried a full-time offer too early boxes us in, but contractors rarely feel like owners. How did you decide?",
    timeAgo: "3 days ago",
    likes: 12,
    likedByMe: false,
    comments: [
      {
        id: "comment-05",
        author: { name: "Alex Babu", avatarUrl: pravatar(11), role: "member" },
        text: "We did a 2-month paid trial framed as a project. Both sides knew it could convert. Lowered the stakes massively.",
        timeAgo: "2 days ago",
      },
    ],
  },
  {
    id: "post-06",
    author: { name: "Helena Thorne", avatarUrl: "https://i.pravatar.cc/200?img=5", role: "member" },
    category: "Others",
    content:
      "What's the one tool or workflow that quietly made running your business easier this year? Not the obvious ones — the small, underrated thing nobody talks about. I'll start: a shared 'decisions log' doc so we stop re-litigating the same calls every month.",
    timeAgo: "4 days ago",
    likes: 31,
    likedByMe: false,
    comments: [
      {
        id: "comment-06",
        author: { name: "Priya Nair", avatarUrl: pravatar(45), role: "vendor", headline: "Audit & Assurance Lead" },
        text: "A weekly 15-minute 'numbers review' habit. Tiny commitment, caught two billing errors before they compounded.",
        timeAgo: "3 days ago",
      },
    ],
  },
];
