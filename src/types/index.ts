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
  /** Admin grant: directory access without an active subscription. */
  isProfileVisible?: boolean;
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

/** Testimonial as returned by GET /testimonial. */
export interface Testimonial {
  _id: string;
  name: string;
  quote: string;
  role: string;
  company: string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------------------------------------------------------ *
 * Community forum
 * ------------------------------------------------------------------ */
export type ForumCategory =
  | "Networking"
  | "Legal"
  | "Taxation"
  | "Marketing"
  | "Finance & Accounting"
  | "Operation & HR"
  | "The Water Cooler"
  | "Other";

/** Whether a post/comment author is a founder (member) or an expert (vendor). */
export type ForumAuthorRole = "member" | "vendor";

export interface ForumAuthor {
  /** API author `_id` when available. */
  id?: string;
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
  createdAt?: string;
}

export interface ForumPost {
  id: string;
  author: ForumAuthor;
  category: ForumCategory;
  content: string;
  timeAgo: string;
  createdAt?: string;
  likes: number;
  /** True when the current viewer has liked this post. */
  likedByMe: boolean;
  /** Total comment count from the API (`totalComments`). */
  commentCount: number;
  /** Loaded on the detail page via GET /comment/:postId. */
  comments?: ForumComment[];
}

export type ForumTab = "feed" | "posts" | "comments" | "likes";

export interface ForumStats {
  posts: number;
  comments: number;
  likes: number;
}

/* ------------------------------------------------------------------ *
 * Membership
 * ------------------------------------------------------------------ */
/** API query / plan field: `week` | `month` | `year`. */
export type MembershipRecurring = "week" | "month" | "year";

/** @deprecated Prefer MembershipRecurring — kept for older UI labels. */
export type BillingCycle = "monthly" | "yearly";

/** Membership package as returned by GET /membership?recurring=… */
export interface MembershipPlan {
  _id: string;
  name: string;
  tagline: string;
  type?: string;
  price: number;
  recurring: MembershipRecurring;
  interval?: number;
  featured?: boolean;
  highlight?: string;
  features: string[];
  productId?: string;
  priceId?: string;
  /** Stripe payment link — open when the user chooses this plan. */
  paymentUrl?: string;
  /** Plan offers a free trial for eligible users. */
  has_trial?: boolean;
  trial_period_days?: number;
  /** When true, subscriber can choose auto-renew before checkout. */
  is_auto_renew?: boolean;
}

/** Active subscription nested on GET /user/profile. */
export interface UserSubscription {
  _id: string;
  name: string;
  start_date: string;
  end_date: string;
  status?: string;
  plan?: string;
  user?: string;
  recuring?: MembershipRecurring | string;
  price?: number;
  features?: string[];
  payment_intent_id?: string;
  trxId?: string;
  is_trial?: boolean;
  trial_period_days?: number;
  trial_end_date?: string;
  auto_renew?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** GET /subscription/trial-eligibility */
export interface TrialEligibility {
  isEligible: boolean;
  hasTakenTrial: boolean;
}

/** FAQ as returned by GET /faq?audience=USER|VENDOR. */
export interface Faq {
  _id: string;
  question: string;
  answer: string;
  audience: "USER" | "VENDOR";
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

/** Book / digital / office product as returned by GET /books. */
export interface Book {
  _id: string;
  type?: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  currency?: string;
  image?: string | null;
  /** Two-stop gradient for procedural / 3D covers. */
  accent?: [string, string] | string[];
  /** Downloadable file path (PDF), unlocked after purchase. */
  file?: string | null;
  details?: {
    publisher?: string;
    firstPublish?: string;
    edition?: string;
    status?: string;
    inStock?: boolean;
    pages?: number;
    /** Office / tangible product fields */
    material?: string;
    dimensions?: string;
    weight?: string;
  };
  /** Optional — not always present on API records. */
  shares?: number;
  rating?: {
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
 * Cart (API)
 * ------------------------------------------------------------------ */
export interface CartProductRef {
  _id: string;
  title: string;
  image?: string | null;
}

export interface ApiCartLine {
  _id: string;
  product: CartProductRef;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CartPriceBreakdown {
  products_price: number;
  serviceFee: number;
  delivery_charge: number;
  discount_amount: number;
  total_price: number;
  tax: number;
  subtotal: number;
}

/** Shape of `data` from GET /cart. */
export interface CartData {
  cart: ApiCartLine[];
  price_breakdown: CartPriceBreakdown;
}

/* ------------------------------------------------------------------ *
 * Contact inquiry — POST /inquiry
 * ------------------------------------------------------------------ */
export const PROJECT_BUDGETS = [
  "UNDER_100",
  "100_300",
  "300_500",
  "600_1000",
  "ABOVE_1000",
] as const;

export type ProjectBudget = (typeof PROJECT_BUDGETS)[number];

export interface Inquiry {
  name: string;
  email: string;
  projectDescription: string;
  budget: ProjectBudget;
}

/* ------------------------------------------------------------------ *
 * Cart (legacy localStorage — checkout still uses this)
 * ------------------------------------------------------------------ */
export interface CartItem {
  id: string; // The product id
  title: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}
