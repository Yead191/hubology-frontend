import type { Metadata } from "next";
import { MessagesSquare } from "lucide-react";
import { ComingSoon } from "@/components/sections/coming-soon";

export const metadata: Metadata = {
  title: "Community Forum",
  description: "Ask questions and get answers from verified experts — coming soon.",
};

export default function ForumPage() {
  return (
    <ComingSoon
      icon={MessagesSquare}
      eyebrow="Community Forum · Coming soon"
      title="Where founders and experts talk"
      description="Secure, focused spaces to ask real questions and get answers from verified experts — not anonymous strangers."
      bullets={[
        "Topic-based rooms across every business need",
        "Verified expert answers, not guesswork",
        "Private threads for sensitive questions",
      ]}
    />
  );
}
