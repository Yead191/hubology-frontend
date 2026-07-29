import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
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
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { getAvailabilityLabel } from "@/lib/validators";
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
    <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-white/2 px-4 py-3">
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
  const profile = vendor.vendorProfile;
  const imageSrc = getImageUrl(vendor.image);
  const phone = profile?.contactNo;
  const phoneHref = phone ? `tel:${phone.replace(/\s+/g, "")}` : undefined;
  const expertise = profile?.expertise ?? [];
  const consultationTypes = profile?.consultationTypes ?? [];
  const linkedin = profile?.linkedin;

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <Aurora animated className="-top-16 right-0 h-112 w-xl opacity-35" />

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
          <Reveal className="border-gradient rounded-4xl bg-panel/50 p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl bg-panel ring-2 ring-violet/25">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={vendor.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                    priority
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <h1 className="flex items-center gap-2 text-2xl font-bold text-cloud sm:text-3xl">
                  {vendor.name}
                  {vendor.verified ? (
                    <BadgeCheck
                      className="h-5 w-5 shrink-0 text-violet-bright"
                      aria-label="Verified expert"
                    />
                  ) : null}
                </h1>
                <p className="mt-1 text-violet-bright">
                  {profile?.jobTitle || "Expert"}
                  {vendor.company ? (
                    <span className="text-mist"> · {vendor.company}</span>
                  ) : null}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <MetaTile
                icon={Briefcase}
                label="Experience"
                value={profile?.yearsExperience || "—"}
              />
              <MetaTile
                icon={Clock}
                label="Availability"
                value={
                  profile?.availability
                    ? getAvailabilityLabel(profile.availability)
                    : "—"
                }
              />
              <MetaTile
                icon={GraduationCap}
                label="Credentials"
                value={profile?.degree || "—"}
              />
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-cloud">About</h2>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                {profile?.bio || "No bio provided yet."}
              </p>
            </div>

            {expertise.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-cloud">
                  Areas of expertise
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {expertise.map((e) => (
                    <span
                      key={e}
                      className="rounded-full border border-violet/25 bg-violet/10 px-3 py-1.5 text-sm text-violet-bright"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {consultationTypes.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-cloud">
                  How they consult
                </h2>
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {consultationTypes.map((t) => (
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
            ) : null}

            {linkedin ? (
              <div className="mt-8 border-t border-hairline pt-6">
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-violet-bright transition-colors hover:text-violet"
                >
                  <Linkedin className="h-4 w-4" />
                  View LinkedIn profile
                </a>
              </div>
            ) : null}
          </Reveal>

          {/* Contact card */}
          <Reveal delay={120} className="lg:sticky lg:top-28">
            <div className="border-gradient glow-soft rounded-4xl bg-panel/60 p-6 sm:p-7">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-bold text-cloud">
                  {formatPrice(profile?.hourlyRate ?? 0)}
                </span>
                <span className="text-sm text-mist">/ hour</span>
              </div>
              <p className="mt-2 text-sm text-mist">
                Reach out directly to book a session — Hubology doesn&apos;t take
                a cut or handle payment here.
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                {phoneHref ? (
                  <Button asChild className="w-full">
                    <a href={phoneHref}>
                      <Phone className="h-4 w-4" />
                      Call {phone}
                    </a>
                  </Button>
                ) : null}
                <Button asChild variant="outline" className="w-full">
                  <a href={`mailto:${vendor.email}`}>
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
