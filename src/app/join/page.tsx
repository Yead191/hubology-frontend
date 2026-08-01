import type { Metadata } from "next";

import { registrationOptions } from "@/data/registration";
import { RoleCard } from "@/components/register/role-card";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Aurora } from "@/components/ui/aurora";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Join Hubology",
  description:
    "Join Hubology as a member to access experts and the community forum, or apply as a verified expert to advise founders and grow your practice.",
  path: "/join",
  keywords: [
    "join Hubology",
    "sign up as member",
    "apply as expert",
    "become a verified consultant",
    "founder membership signup",
    "expert vendor application",
  ],
});

export default function JoinPage() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-36 pb-20">
      <Aurora
        animated
        className="-top-10 left-1/2 h-128 w-176 -translate-x-1/2 opacity-50"
      />
      <div className="relative mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Join the Hub"
          title={
            <>
              Choose how you want to{" "}
              <span className="text-gradient">show up</span>
            </>
          }
          subtitle="Whether you are looking for guidance or ready to share your expertise, there is a place for you at Hubology"
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {registrationOptions.map((option, i) => (
            <Reveal key={option.id} delay={i * 100} className="h-full">
              <RoleCard option={option} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-10 text-center text-sm text-mist">
          Already a member?{" "}
          <a href="/login" className="font-medium text-violet-bright hover:underline">
            Sign in instead
          </a>
        </Reveal>
      </div>
    </section>
  );
}
