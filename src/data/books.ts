import type { Book } from "@/types";

/* ------------------------------------------------------------------ *
 * Store catalog — founder books. The "Scaling Fear" sample ships with
 * a real cover; the rest use procedural brand-gradient covers rendered
 * on the 3D shelf and in the 2D fallback. All share the demo PDF.
 * ------------------------------------------------------------------ */
const PDF = "/assets/books/book-1.pdf";

export const books: Book[] = [


  {
    id: "book-01",
    slug: "the-business-plan",
    title: "The Business Plan",
    subtitle: "The founder's psychology guide.",
    price: 220,
    currency: "USD",
    shares: 5062,
    description:
      "The Business Plan is the definitive guide for entrepreneurs navigating the immense psychological pressures of building a startup. From managing imposter syndrome and overcoming the paralyzing fear of failure to maintaining mental clarity during high-stakes decisions, this book provides actionable strategies. Drawing on years of research and interviews with successful founders, it offers a roadmap to harness anxiety as a tool for growth, ensuring you can scale your business without sacrificing your mental health.",
    coverImage: "/assets/images/book/book-cover.png",
    accent: ["#8131f0", "#4a1c8a"],
    fileUrl: PDF,
    details: {
      publisher: "Asad Ujjaman",
      firstPublish: "December 30, 2026",
      edition: "2026",
      pages: 200,
    },
    rating: {
      average: 4.5,
      totalReviews: 120,
      reviews: [
        {
          reviewerName: "Arshad Bhuiyan",
          reviewerTitle: "Entrepreneur",
          rating: 5,
          date: "12/12/2026",
          text: "This book completely changed my perspective on startup anxiety. The chapters on decision fatigue and managing investor expectations are incredibly practical. Highly recommended for any founder feeling overwhelmed.",
        },
        {
          reviewerName: "Marina Cole",
          reviewerTitle: "Seed-stage Founder",
          rating: 4,
          date: "11/28/2026",
          text: "A must-read for any first-time founder. It felt like the author was speaking directly to my daily struggles. The actionable advice on reframing fear into a driving force is worth the price of the book alone.",
        },
      ],
    },
  },
  {
    id: "book-04",
    slug: "signal-and-noise",
    title: "Startup Checklist",
    subtitle: "The no-nonsense guide to launching your startup.",
    price: 200,
    currency: "USD",
    shares: 4207,
    description:
      "A practical checklist for launching your startup. Covers product, legal, hiring, and growth essentials to ensure you avoid common mistakes and set your business up for success.",
    accent: ["#03C1FB", "#136FF4"],
    coverImage: "/assets/images/book/book-cover-2.png",
    fileUrl: "/assets/books/book-2.pdf",
    details: {
      publisher: "Hubology Press",
      firstPublish: "February 2, 2026",
      edition: "2026",
      pages: 192,
    },
    rating: {
      average: 4.4,
      totalReviews: 152,
      reviews: [
        {
          reviewerName: "Sarah Whitfield",
          reviewerTitle: "Growth Lead",
          rating: 4,
          date: "03/21/2026",
          text: "Refreshingly honest about what doesn't work. The channel-durability chapter alone changed our roadmap.",
        },
      ],
    },
  },
];

/* ------------------------------ accessors ------------------------------ */

export function getAllBooks(): Book[] {
  return books;
}

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

export function getBookSlugs(): string[] {
  return books.map((b) => b.slug);
}
