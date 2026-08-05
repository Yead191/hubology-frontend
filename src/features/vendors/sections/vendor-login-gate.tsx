import Link from "next/link";
import { ArrowRight, BadgeCheck, Lock, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";

const PERKS = [
  "Browse manually verified experts",
  "Filter by expertise, rate, and availability",
  "Reach out directly by phone or email",
];

interface VendorLoginGateProps {
  redirectPath?: string;
  isLoggedIn?: boolean;
  userRole?: string;
}

/** Premium gate shown when a guest or unsubscribed user hits /vendors or a vendor profile. */
export function VendorLoginGate({
  redirectPath = "/vendors",
  isLoggedIn = false,
  userRole,
}: VendorLoginGateProps) {
  const isVendor =
    (userRole ?? "").toLowerCase() === "vendor" ||
    (userRole ?? "").toLowerCase() === "expert";
  const membershipPath = isVendor ? "/membership/vendor" : "/membership";

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-28 pb-20 sm:px-6">
      <Aurora
        animated
        className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-45"
      />

      <Reveal className="relative w-full max-w-lg">
        <div className="border-gradient rounded-3xl bg-panel/80 p-8 text-center shadow-[0_30px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-10">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_40px_-10px_rgba(129,49,240,0.9)]">
            <Lock className="h-7 w-7" />
          </span>

          <p className="eyebrow mt-6">
            {isLoggedIn ? "Subscription required" : "Members only"}
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold text-cloud sm:text-3xl">
            Unlock the expert directory
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-mist">
            {isLoggedIn
              ? "Access to the Hubology vendor directory requires an active subscription. Subscribe to a plan to discover verified experts and connect with top talent."
              : "The Hubology vendor directory is reserved for members. Join the hub to discover verified experts and connect with the right help for your business."}
          </p>

          <ul className="mx-auto mt-7 flex max-w-xs flex-col gap-2.5 text-left">
            {PERKS.map((perk, i) => {
              const Icon = i === 0 ? BadgeCheck : i === 1 ? Sparkles : Users;
              return (
                <li
                  key={perk}
                  className="flex items-center gap-2.5 text-sm text-cloud/85"
                >
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet/15 text-violet-bright">
                    <Icon className="h-3 w-3" />
                  </span>
                  {perk}
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            {isLoggedIn ? (
              <Button asChild size="lg">
                <Link href={membershipPath}>
                  View Membership Plans
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/join">
                    Join Hubology
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link
                    href={`/login?redirect=${encodeURIComponent(redirectPath)}`}
                  >
                    Sign in
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
