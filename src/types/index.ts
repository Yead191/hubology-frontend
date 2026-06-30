/* ============================================================
   Domain types — single source of truth for the data layer.
   Swapping mock data for a real API later only touches src/data.
   ============================================================ */

export interface Price {
  currency: string;
  amount: number;
  frequency: string;
}

export interface ServicePackage {
  slug: string;
  title: string;
  tagline: string;
  price: Price;
  features: string[];
  /** Highlight the card with extra glow (e.g. "most popular"). */
  featured?: boolean;
}

export interface ServiceDetail {
  slug: string;
  title: string;
  category: string;
  overview: string;
  longDescription: string;
  image: string;
  highlights: string[];
}

export interface Vendor {
  id: string;
  serviceSlug: string;
  profile: string;
  name: string;
  role: string;
  description: string;
  startingPrice: number;
  rating: number;
  reviews: number;
  location: string;
  contact: {
    email: string;
    phone: string;
  };
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
}

/* ------------------------------------------------------------------ *
 * Community forum
 * ------------------------------------------------------------------ */
export type ForumCategory =
  | "Taxation"
  | "Audit"
  | "Funding"
  | "Legal"
  | "Hiring"
  | "Others";

/** Whether a post/comment author is a founder (member) or an expert (vendor). */
export type ForumAuthorRole = "member" | "vendor";

export interface ForumAuthor {
  name: string;
  avatarUrl: string;
  role: ForumAuthorRole;
  /** Optional one-line headline, e.g. "Tax Strategist". */
  headline?: string;
}

export interface ForumComment {
  id: string;
  author: ForumAuthor;
  text: string;
  timeAgo: string;
}

export interface ForumPost {
  id: string;
  author: ForumAuthor;
  category: ForumCategory;
  content: string;
  timeAgo: string;
  likes: number;
  /** True when the current viewer has liked this post. */
  likedByMe: boolean;
  comments: ForumComment[];
}

export type RegisterRole = "member" | "expert";

export interface RegistrationOption {
  id: string;
  role: RegisterRole;
  icon: string;
  title: string;
  description: string;
  features: string[];
  button: {
    text: string;
    variant: "solid" | "outline";
  };
}
