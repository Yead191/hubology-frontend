import type { Metadata } from "next";
import { Crown } from "lucide-react";
import { ComingSoon } from "@/components/sections/coming-soon";

export const metadata: Metadata = {
  title: "Membership",
  description: "Unlock the full Hubology experience — coming soon.",
};

export default function MembershipPage() {
  return (
    <ComingSoon
      icon={Crown}
      eyebrow="Membership · Coming soon"
      title="Everything, in one membership"
      description="One plan that unlocks the expert directory, community forums, private sessions, and the store."
      bullets={[
        "Unlimited access to the verified expert directory",
        "Priority booking for 1-on-1 strategy sessions",
        "Member-only events, pricing, and resources",
      ]}
    />
  );
}
