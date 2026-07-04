import type { TangibleProduct } from "@/types";

export const officeSupplies: TangibleProduct[] = [
  {
    id: "tangible-01",
    slug: "premium-leather-binder",
    title: "Premium Leather Binder",
    subtitle: "Organize your startup documents in style.",
    price: 45,
    currency: "USD",
    shares: 1240,
    description:
      "A premium, handcrafted leather binder designed specifically for founders. Keep your term sheets, cap tables, and incorporation documents organized in one place. Features durable rings, multiple pockets for business cards, and a sleek minimalist design that looks great on any desk.",
    coverImage: "/assets/tangible/binders.jpeg",
    rating: {
      average: 4.8,
      totalReviews: 45,
      reviews: [
        {
          reviewerName: "Alex Chen",
          reviewerTitle: "Founder",
          rating: 5,
          date: "05/12/2026",
          text: "Absolutely love the quality. It feels premium and is exactly what I needed for my physical documents.",
        },
      ],
    },
    details: {
      material: "Full-grain Leather",
      dimensions: "10 x 12 inches",
      weight: "1.2 lbs",
      inStock: true,
    },
  },
  {
    id: "tangible-02",
    slug: "founder-notebook-set",
    title: "Founder's Notebook Set",
    subtitle: "Capture ideas before they disappear.",
    price: 28,
    currency: "USD",
    shares: 890,
    description:
      "A set of three high-quality, dot-grid notebooks designed for brainstorming, sketching wireframes, and jotting down late-night ideas. Lay-flat binding and fountain pen friendly paper ensure a smooth writing experience.",
    coverImage: "/assets/tangible/binders.jpeg",
    rating: {
      average: 4.6,
      totalReviews: 82,
      reviews: [
        {
          reviewerName: "Sarah M.",
          reviewerTitle: "Product Designer",
          rating: 5,
          date: "06/02/2026",
          text: "The paper quality is fantastic. No bleeding through even with my heavy ink pens.",
        },
      ],
    },
    details: {
      material: "Acid-free paper (120gsm)",
      dimensions: "5.5 x 8.5 inches",
      weight: "0.8 lbs",
      inStock: true,
    },
  },
  {
    id: "tangible-03",
    slug: "vision-board-kit",
    title: "Startup Vision Board Kit",
    subtitle: "Map out your next big pivot.",
    price: 65,
    currency: "USD",
    shares: 512,
    description:
      "Everything you need to visualize your company's future. Includes a large magnetic dry-erase board, premium markers, sticky notes in 5 colors, and a guide on effective brainstorming techniques for teams.",
    coverImage: "/assets/tangible/binders.jpeg",
    rating: {
      average: 4.9,
      totalReviews: 28,
      reviews: [
        {
          reviewerName: "David Kim",
          reviewerTitle: "CEO",
          rating: 5,
          date: "04/18/2026",
          text: "This kit brought our team off-site to the next level. So much better than just using a digital whiteboard.",
        },
      ],
    },
    details: {
      material: "Aluminum, Glass, Paper",
      dimensions: "24 x 36 inches (Board)",
      weight: "4.5 lbs",
      inStock: true,
    },
  },
];

export function getAllTangibleProducts(): TangibleProduct[] {
  return officeSupplies;
}

export function getTangibleProductBySlug(slug: string): TangibleProduct | undefined {
  return officeSupplies.find((p) => p.slug === slug);
}
