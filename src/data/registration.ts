import type { RegistrationOption } from "@/types";

/* The two paths on the Join Hub page. */
export const registrationOptions: RegistrationOption[] = [
  {
    id: "register-member",
    role: "member",
    icon: "brain-gear",
    title: "Seek Expert Advice",
    description:
      "For business owners and executives navigating growth and strategy.",
    features: [
      "Ask questions to verified experts in secure forums",
      "Browse an elite expert directory with global reach",
      "Schedule 1-on-1 private strategy sessions",
    ],
    button: { text: "Join as a Member", variant: "outline" },
  },
  {
    id: "register-expert",
    role: "expert",
    icon: "badge-check",
    title: "Share Your Expertise",
    description:
      "For professional consultants and industry veterans looking to monetize.",
    features: [
      "Build your professional brand among high-level executives",
      "Earn through high-value 1-on-1 consultations",
      "Join an elite network of world-class consultants",
    ],
    button: { text: "Apply as an Expert", variant: "solid" },
  },
];

export function getRegistrationOption(role: string) {
  return registrationOptions.find((o) => o.role === role);
}
