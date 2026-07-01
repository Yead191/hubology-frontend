import type { Book } from "@/types";

/* ------------------------------------------------------------------ *
 * Store catalog — founder books. The "Scaling Fear" sample ships with
 * a real cover; the rest use procedural brand-gradient covers rendered
 * on the 3D shelf and in the 2D fallback. All share the demo PDF.
 * ------------------------------------------------------------------ */
const PDF = "/assets/books/book-1.pdf";

export const books: Book[] = [

  {
    id: "book-02",
    slug: "the-quiet-runway",
    title: "The Quiet Runway",
    subtitle: "Fundraising without losing yourself.",
    price: 180,
    currency: "USD",
    shares: 3184,
    description:
      "The Quiet Runway reframes fundraising as a craft rather than a performance. It walks founders through building a narrative investors believe, running a tight process, and negotiating terms that protect the company's future — all without burning out or compromising the vision. Practical templates, real term-sheet breakdowns, and calm, contrarian advice make this the fundraising companion founders actually keep on their desk.",
    accent: ["#136FF4", "#03C1FB"],
    fileUrl: PDF,
    details: {
      publisher: "Hubology Press",
      firstPublish: "March 14, 2026",
      edition: "2026",
      pages: 248,
    },
    rating: {
      average: 4.7,
      totalReviews: 88,
      reviews: [
        {
          reviewerName: "Daniel Osei",
          reviewerTitle: "Startup Counsel",
          rating: 5,
          date: "04/02/2026",
          text: "The clearest explanation of SAFEs and priced rounds I've read. I've handed copies to three founders already.",
        },
      ],
    },
  },
  {
    id: "book-03",
    slug: "margin-of-trust",
    title: "Margin of Trust",
    subtitle: "Leadership that compounds.",
    price: 160,
    currency: "USD",
    shares: 2751,
    description:
      "Margin of Trust argues that the highest-leverage asset a leader owns is trust — and that it compounds or erodes with every decision. Through frameworks for delegation, hard conversations, and building teams that move without you, this book gives operators a practical system for leading at scale while staying human. It's a field guide for the messy middle between founder-led chaos and real organizational maturity.",
    accent: ["#9a55ff", "#6e22e6"],
    fileUrl: PDF,
    details: {
      publisher: "Hubology Press",
      firstPublish: "June 9, 2026",
      edition: "2026",
      pages: 216,
    },
    rating: {
      average: 4.6,
      totalReviews: 64,
      reviews: [
        {
          reviewerName: "Priya Nair",
          reviewerTitle: "Advisor",
          rating: 5,
          date: "07/18/2026",
          text: "Delegation finally clicked for me after chapter four. Warm, direct, and immediately useful.",
        },
      ],
    },
  },
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
    title: "Signal & Noise",
    subtitle: "Growth for people who hate hype.",
    price: 140,
    currency: "USD",
    shares: 4207,
    description:
      "Signal & Noise cuts through growth-hacking folklore to focus on what actually moves the needle: understanding your customer, building durable channels, and measuring the few metrics that matter. It's a pragmatic playbook for founders and operators who want compounding growth without the vanity dashboards, tuned to real unit economics rather than applause.",
    accent: ["#03C1FB", "#136FF4"],
    fileUrl: PDF,
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
  {
    id: "book-05",
    slug: "the-founders-ledger",
    title: "The Founder's Ledger",
    subtitle: "Finance you can feel in your gut.",
    price: 175,
    currency: "USD",
    shares: 1988,
    description:
      "The Founder's Ledger demystifies startup finance for people who never trained in it. From reading your own P&L to modeling runway, pricing with confidence, and knowing which numbers to watch weekly, it turns finance from a source of anxiety into a decision-making superpower. Clear, jargon-free, and built around the questions founders actually ask at 2am.",
    accent: ["#5b2bd6", "#2a1668"],
    fileUrl: PDF,
    details: {
      publisher: "Hubology Press",
      firstPublish: "September 5, 2026",
      edition: "2026",
      pages: 224,
    },
    rating: {
      average: 4.8,
      totalReviews: 73,
      reviews: [
        {
          reviewerName: "Helena Thorne",
          reviewerTitle: "Tax Strategist",
          rating: 5,
          date: "10/11/2026",
          text: "I recommend this to every founder client. It builds real financial intuition, not just spreadsheet literacy.",
        },
      ],
    },
  },
  {
    id: "book-06",
    slug: "cold-start-clarity",
    title: "Cold Start Clarity",
    subtitle: "From blank page to first traction.",
    price: 150,
    currency: "USD",
    shares: 3620,
    description:
      "Cold Start Clarity is for the earliest, foggiest stage — when there's nothing but an idea and a hunch. It offers a calm, structured path from problem discovery to a validated first version, helping founders avoid the classic traps of building too much, too soon. Full of prompts, decision frameworks, and stories of messy beginnings that worked out.",
    accent: ["#7c3aed", "#3b1785"],
    fileUrl: PDF,
    details: {
      publisher: "Hubology Press",
      firstPublish: "January 20, 2026",
      edition: "2026",
      pages: 208,
    },
    rating: {
      average: 4.5,
      totalReviews: 96,
      reviews: [
        {
          reviewerName: "Mia Fontaine",
          reviewerTitle: "Founder",
          rating: 5,
          date: "02/14/2026",
          text: "Exactly what I needed at day zero. It gave me permission to start small and a map for what to do next.",
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
