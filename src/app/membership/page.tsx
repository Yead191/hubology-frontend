import type { Metadata } from "next";

import Membership from "@/features/membership";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Unlock the Hubology community forum, verified experts, and member perks. Simple plans, cancel anytime.",
};

export default function MembershipPage() {
  return <Membership />;
}
