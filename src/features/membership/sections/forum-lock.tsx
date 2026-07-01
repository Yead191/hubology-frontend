"use client";

import Link from "next/link";
import { Lock, Crown, ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import { useMembership } from "@/features/membership/membership-context";

const PERKS = [
  "Ask founders & verified experts",
  "Give likes, comment, and post",
  "Search every topic and category",
];

/**
 * Premium "members-only" gate shown over the forum when the viewer
 * lacks access. Handles both the logged-out and no-membership states,
 * and offers a one-click demo unlock so the flow is never a dead end.
 */
export function ForumLockCard() {
  const { isLoggedIn } = useAuth();
  const { subscribe } = useMembership();

  if (!isLoggedIn) {
    return (
      <LockShell
        icon={<Lock className="h-7 w-7" />}
        title="Sign in to join the community"
        subtitle="The Hubology forum is where founders and verified experts trade real advice. Sign in to take part."
      >
        <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/login">
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/join">Create an account</Link>
          </Button>
        </div>
      </LockShell>
    );
  }

  return (
    <LockShell
      icon={<Crown className="h-7 w-7" />}
      title="This is a members-only space"
      subtitle="A Hubology membership is your key to the community forum — plus the expert directory, private sessions, and more."
    >
      <ul className="mx-auto mb-6 flex max-w-xs flex-col gap-2.5 text-left">
        {PERKS.map((perk) => (
          <li key={perk} className="flex items-center gap-2.5 text-sm text-cloud/85">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet/15 text-violet-bright">
              <Check className="h-3 w-3" />
            </span>
            {perk}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href="/membership">
            View membership plans
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" onClick={() => subscribe("pro")}>
          Preview as member (demo)
        </Button>
      </div>
    </LockShell>
  );
}

function LockShell({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-gradient w-full max-w-lg rounded-3xl bg-panel/80 p-8 text-center shadow-[0_30px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-xl">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_40px_-10px_rgba(129,49,240,0.9)]">
        {icon}
      </span>
      <h2 className="mt-6 font-display text-2xl font-bold text-cloud">{title}</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-mist">
        {subtitle}
      </p>
      <div className="mt-7">{children}</div>
    </div>
  );
}
