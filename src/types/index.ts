/* ============================================================
   Domain types — single source of truth for the data layer.
   Swapping mock data for a real API later only touches src/data.
   ============================================================ */

export interface Price {
  /** Optional — API omits it; formatPrice falls back to "$". */
  currency?: string;
  amount: number;
  frequency: string;
}

export interface ServicePackage {
  /** Mongo id from the API — used as the booking's `service` reference. */
  _id?: string;
  /** URL slug for mock/static data; API records may not have one. */
  slug?: string;
  title: string;
  tagline: string;
  price: Price;
  features: string[];
  /** Highlight the card with extra glow (e.g. "most popular"). */
  featured?: boolean;
  /** API extras (present on real records). */
  image?: string;
  longDescription?: string;
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

export interface VendorProfile {
  jobTitle: string;
  contactNo: string;
  bio: string;
  expertise: string[];
  yearsExperience: string;
  degree?: string;
  linkedin?: string;
  /** Numeric hourly rate (starting from), e.g. 100. */
  hourlyRate: number;
  availability: string;
  consultationTypes: string[];
  applicationStatus?: string;
}

/** Vendor / expert record as returned by GET /vendor. */
export interface Vendor {
  _id: string;
  name: string;
  /** Account role from the API, e.g. "VENDOR". */
  role: string;
  email: string;
  image?: string | null;
  status?: string;
  rejectionReason?: string | null;
  verified?: boolean;
  company?: string;
  vendorProfile: VendorProfile;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
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

/* ------------------------------------------------------------------ *
 * Membership
 * ------------------------------------------------------------------ */
export type BillingCycle = "monthly" | "yearly";

export interface MembershipPlan {
  id: string;
  name: string;
  tagline: string;
  /** Per-month price when billed monthly. */
  priceMonthly: number;
  /** Per-month price when billed yearly (i.e. the discounted rate). */
  priceYearly: number;
  currency: string;
  features: string[];
  /** Visually elevate this plan as the recommended tier. */
  featured?: boolean;
  /** Short ribbon label, e.g. "Most popular". */
  highlight?: string;
}

/* ------------------------------------------------------------------ *
 * Store — books
 * ------------------------------------------------------------------ */
export interface BookReview {
  reviewerName: string;
  reviewerTitle: string;
  rating: number;
  date: string;
  text: string;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  currency: string;
  /** Social proof — number of shares. */
  shares: number;
  description: string;
  /** Real cover image, when available. */
  coverImage?: string;
  /** Two-stop gradient [from, to] for the procedural cover / 3D spine. */
  accent: [string, string];
  /** Downloadable file, unlocked after purchase. */
  fileUrl: string;
  details: {
    publisher: string;
    firstPublish: string;
    edition: string;
    pages: number;
  };
  rating: {
    average: number;
    totalReviews: number;
    reviews: BookReview[];
  };
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

/* ------------------------------------------------------------------ *
 * Store — tangible products
 * ------------------------------------------------------------------ */
export interface TangibleProduct {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  currency: string;
  shares: number;
  description: string;
  coverImage: string;
  rating: {
    average: number;
    totalReviews: number;
    reviews: BookReview[];
  };
  details: {
    material?: string;
    dimensions?: string;
    weight?: string;
    inStock: boolean;
  };
}

/* ------------------------------------------------------------------ *
 * Cart
 * ------------------------------------------------------------------ */
export interface CartItem {
  id: string; // The product id
  title: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}
