import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  TrendingUp,
  CalendarClock,
  Users,
  Compass,
  MessagesSquare,
  Star,
} from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { RegisterBenefits } from "@/components/register/register-benefits";
import { MemberRegisterForm } from "@/components/register/member-register-form";
import { ExpertRegisterForm } from "@/components/register/expert-register-form";

type Role = "member" | "expert";

interface PageProps {
  params: Promise<{ role: string }>;
}

export function generateStaticParams() {
  return [{ role: "member" }, { role: "expert" }];
}

const copy: Record<
  Role,
  { title: string; subtitle: string; metaTitle: string }
> = {
  member: {
    metaTitle: "Join as a Member",
    title: "Create your member account",
    subtitle: "Seek expert advice and connect with a community of founders.",
  },
  expert: {
    metaTitle: "Apply as an Expert",
    title: "Apply to join as an expert",
    subtitle: "Share your expertise with high-level executives and founders.",
  },
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { role } = await params;
  if (role !== "member" && role !== "expert") return { title: "Register" };
  return { title: copy[role as Role].metaTitle };
}

export default async function RegisterPage({ params }: PageProps) {
  const { role } = await params;
  if (role !== "member" && role !== "expert") notFound();
  const typedRole = role as Role;
  const { title, subtitle } = copy[typedRole];

  return (
    <section className="relative min-h-screen overflow-hidden pt-28 pb-20">
      <Aurora className="-top-24 right-1/4 h-[34rem] w-[40rem] opacity-40" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2">
            <Link href="/join">
              <ArrowLeft className="h-4 w-4" /> Back to options
            </Link>
          </Button>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-start">
          {/* Form column */}
          <Reveal className="border-gradient relative rounded-[2rem] bg-panel/50 p-7 glow-soft sm:p-9">
            <Link href="/" className="mb-6 inline-block lg:hidden">
              <Logo />
            </Link>
            <div className="mb-8 flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-cloud">{title}</h1>
              <p className="text-sm text-mist">{subtitle}</p>
            </div>

            {typedRole === "expert" ? (
              <ExpertRegisterForm />
            ) : (
              <MemberRegisterForm />
            )}
          </Reveal>

          {/* Role-specific benefits sidebar */}
          <Reveal delay={120} className="lg:sticky lg:top-28">
            {typedRole === "expert" ? (
              <RegisterBenefits
                title="Why join Hubology?"
                items={[
                  {
                    icon: TrendingUp,
                    title: "High-value leads",
                    description:
                      "Get discovered by executives and founders actively looking for your expertise.",
                  },
                  {
                    icon: CalendarClock,
                    title: "Flexible consulting",
                    description:
                      "Set your own rates and availability. Take the sessions that fit your schedule.",
                  },
                  {
                    icon: Users,
                    title: "Professional networking",
                    description:
                      "Join an elite network of world-class consultants and grow your reputation.",
                  },
                ]}
                trust={{
                  title: "Verified Expert Status",
                  description:
                    "Every expert is manually reviewed, so members trust who they are talking to.",
                }}
              />
            ) : (
              <RegisterBenefits
                title="What members get"
                items={[
                  {
                    icon: Compass,
                    title: "Browse verified experts",
                    description:
                      "Explore an elite directory of consultants vetted across every business need.",
                  },
                  {
                    icon: MessagesSquare,
                    title: "Ask in secure forums",
                    description:
                      "Get answers from verified experts in private, focused community spaces.",
                  },
                  {
                    icon: CalendarClock,
                    title: "Book 1-on-1 sessions",
                    description:
                      "Schedule private strategy sessions with the right expert at the right moment.",
                  },
                ]}
                trust={{
                  title: "Members-only access",
                  description:
                    "View full vendor details and contact information once you join.",
                }}
              />
            )}

            <Reveal
              delay={200}
              className="mt-6 flex items-center gap-3 rounded-2xl border border-hairline bg-panel/30 px-5 py-4"
            >
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <p className="text-sm text-mist">
                Trusted by founders and consultants worldwide.
              </p>
            </Reveal>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
