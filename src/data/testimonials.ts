import type { Testimonial } from "@/types";

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    quote:
      "Hubology connected me with a tax strategist in 48 hours. We restructured before year-end and saved more than the platform will ever cost me.",
    name: "Elena Marsh",
    role: "Founder",
    company: "Northwind Studio",
    avatar: "https://i.pravatar.cc/200?img=45",
  },
  {
    id: "t-2",
    quote:
      "Every expert I spoke to was actually vetted. No tire-kickers, no fluff — just senior people who had solved my exact problem before.",
    name: "Tobias Reyer",
    role: "CEO",
    company: "Cadence Labs",
    avatar: "https://i.pravatar.cc/200?img=33",
  },
  {
    id: "t-3",
    quote:
      "I booked a one-on-one with a growth lead and walked away with a funnel plan we are still executing a year later. Worth every minute.",
    name: "Maya Olsen",
    role: "Co-founder",
    company: "Brightseed",
    avatar: "https://i.pravatar.cc/200?img=20",
  },
  {
    id: "t-4",
    quote:
      "Having formation, legal, and fundraising experts in one trusted place meant I stopped stitching together advice from ten different chats.",
    name: "Daniel Okonkwo",
    role: "Founder",
    company: "Loop Mobility",
    avatar: "https://i.pravatar.cc/200?img=58",
  },
];

export function getTestimonials(): Testimonial[] {
  return testimonials;
}
