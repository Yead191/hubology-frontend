import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Star,
  MapPin,
  BadgeCheck,
  Mail,
  Phone,
  Clock,
  Briefcase,
  GraduationCap,
  Linkedin,
  Check,
} from "lucide-react";

import type { Vendor } from "@/types";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";

function MetaTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-white/[0.02] px-4 py-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet-bright">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-faint">{label}</p>
        <p className="truncate text-sm font-medium text-cloud">{value}</p>
      </div>
    </div>
  );
}

/** Full vendor profile with a sticky contact card (call / email). */
export function VendorDetail({ vendor }: { vendor: Vendor }) {
  const phoneHref = `tel:${vendor.contact.phone.replace(/\s+/g, "")}`;

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <Aurora
        animated
        className="-top-16 right-0 h-112 w-xl opacity-35"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2">
            <Link href="/vendors">
              <ArrowLeft className="h-4 w-4" /> All vendors
            </Link>
          </Button>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-start">
          {/* Main profile */}
          <Reveal className="border-gradient rounded-[2rem] bg-panel/50 p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl ring-2 ring-violet/25">
                <Image
                  src={vendor.profile}
                  alt={vendor.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="min-w-0">
                <h1 className="flex items-center gap-2 text-2xl font-bold text-cloud sm:text-3xl">
                  {vendor.name}
                  <BadgeCheck
                    className="h-5 w-5 shrink-0 text-violet-bright"
                    aria-label="Verified expert"
                  />
                </h1>
                <p className="mt-1 text-violet-bright">
                  {vendor.role}
                  <span className="text-mist"> · {vendor.company}</span>
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-mist">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-cloud">
                      {vendor.rating.toFixed(1)}
                    </span>
                    <span className="text-faint">({vendor.reviews} reviews)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {vendor.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Meta tiles */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <MetaTile
                icon={Briefcase}
                label="Experience"
                value={vendor.yearsExperience}
              />
              <MetaTile
                icon={Clock}
                label="Availability"
                value={vendor.availability}
              />
              <MetaTile
                icon={GraduationCap}
                label="Credentials"
                value={vendor.degree ?? "—"}
              />
            </div>

            {/* About */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-cloud">About</h2>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                {vendor.about}
              </p>
            </div>

            {/* Expertise */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-cloud">
                Areas of expertise
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {vendor.expertise.map((e) => (
                  <span
                    key={e}
                    className="rounded-full border border-violet/25 bg-violet/10 px-3 py-1.5 text-sm text-violet-bright"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>

            {/* Consultation types */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-cloud">
                How they consult
              </h2>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {vendor.consultationTypes.map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2.5 text-sm text-cloud/85"
                  >
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet/15 text-violet-bright">
                      <Check className="h-3 w-3" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {vendor.linkedin && (
              <div className="mt-8 border-t border-hairline pt-6">
                <a
                  href={vendor.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-violet-bright transition-colors hover:text-violet"
                >
                  <Linkedin className="h-4 w-4" />
                  View LinkedIn profile
                </a>
              </div>
            )}
          </Reveal>

          {/* Contact card */}
          <Reveal delay={120} className="lg:sticky lg:top-28">
            <div className="border-gradient glow-soft rounded-[2rem] bg-panel/60 p-6 sm:p-7">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-bold text-cloud">
                  {vendor.hourlyRate}
                </span>
                <span className="text-sm text-mist">/ hour</span>
              </div>
              <p className="mt-2 text-sm text-mist">
                Reach out directly to book a session — Hubology doesn&apos;t take a
                cut or handle payment here.
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                <Button asChild className="w-full">
                  <a href={phoneHref}>
                    <Phone className="h-4 w-4" />
                    Call {vendor.contact.phone}
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <a href={`mailto:${vendor.contact.email}`}>
                    <Mail className="h-4 w-4" />
                    Email expert
                  </a>
                </Button>
              </div>

              <p className="mt-4 text-center text-xs text-faint">
                Typically responds within a day
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
