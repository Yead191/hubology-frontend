"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { Aurora } from "@/components/ui/aurora";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/ui/reveal";

export function PartnerApplyForm() {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [contactPhone, setContactPhone] = React.useState("");
  const [offers, setOffers] = React.useState<string[]>([""]);
  const [logo, setLogo] = React.useState<File | null>(null);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (!logo) {
      setLogoPreview(null);
      return;
    }
    const url = URL.createObjectURL(logo);
    setLogoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logo]);

  function updateOffer(index: number, value: string) {
    setOffers((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function addOffer() {
    setOffers((prev) => [...prev, ""]);
  }

  function removeOffer(index: number) {
    setOffers((prev) =>
      prev.length <= 1 ? [""] : prev.filter((_, i) => i !== index),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedOffers = offers.map((o) => o.trim()).filter(Boolean);

    if (!trimmedName) {
      toast.error("Company name is required.", { id: "partner-apply" });
      return;
    }
    if (trimmedDescription.length < 10) {
      toast.error("Description must be at least 10 characters.", {
        id: "partner-apply",
      });
      return;
    }
    if (trimmedOffers.length < 1) {
      toast.error("Add at least one offer or service.", { id: "partner-apply" });
      return;
    }
    if (!contactEmail.trim()) {
      toast.error("Contact email is required.", { id: "partner-apply" });
      return;
    }
    if (!logo) {
      toast.error("Please upload your company logo.", { id: "partner-apply" });
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", trimmedName);
      fd.append("description", trimmedDescription);
      // Use bracket notation so a single offer is parsed as an array, not a string.
      for (const offer of trimmedOffers) fd.append("offers[]", offer);
      if (website.trim()) fd.append("website", website.trim());
      fd.append("contactEmail", contactEmail.trim());
      if (contactPhone.trim()) fd.append("contactPhone", contactPhone.trim());
      fd.append("image", logo);

      const res = await nextFetch("/partner/apply", {
        method: "POST",
        body: fd,
      });

      if (!res.success) {
        toast.error(res.message || "Could not submit your application.", {
          id: "partner-apply",
        });
        return;
      }

      toast.success(res.message || "Application submitted successfully.", {
        id: "partner-apply",
      });
      setSubmitted(true);
    } catch {
      toast.error("Network error. Please try again.", { id: "partner-apply" });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="relative min-h-screen overflow-x-clip pb-20 pt-32">
        <Aurora
          animated
          className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-35"
        />
        <div className="relative mx-auto max-w-lg px-4 text-center sm:px-6">
          <Reveal>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h1 className="mt-6 font-display text-3xl font-bold text-cloud">
              Application received
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">
              Thanks for applying to join the Hubology partner network. Our team
              will review your submission and get back to you by email.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link href="/partners">Back to partners</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-x-clip pb-20 pt-32">
      <Aurora
        animated
        className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-35"
      />

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6">
        <Reveal>
          <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
            <Link href="/partners">
              <ArrowLeft className="h-4 w-4" />
              All partners
            </Link>
          </Button>

          <header>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">
              Partner application
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-cloud sm:text-4xl">
              Become a <span className="text-gradient">Hubology partner</span>
            </h1>
            <p className="mt-2 text-sm text-mist sm:text-base">
              Tell us about your organization. Applications are reviewed before
              being listed in the partner directory.
            </p>
          </header>
        </Reveal>

        <Reveal delay={80} className="mt-8">
          <form
            onSubmit={(e) => void handleSubmit(e)}
            className="space-y-6 rounded-3xl border border-hairline bg-panel/45 p-5 backdrop-blur-md sm:p-8"
          >
            <div className="space-y-2">
              <Label htmlFor="partnerName">Company name</Label>
              <Input
                id="partnerName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your company name"
                required
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerDescription">Description</Label>
              <Textarea
                id="partnerDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does your company do?"
                rows={4}
                required
                disabled={submitting}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label>Offers / services</Label>
                <button
                  type="button"
                  onClick={addOffer}
                  disabled={submitting}
                  className="inline-flex items-center gap-1 text-xs font-medium text-violet-bright hover:text-violet"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add offer
                </button>
              </div>
              <div className="space-y-2">
                {offers.map((offer, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={offer}
                      onChange={(e) => updateOffer(index, e.target.value)}
                      placeholder="e.g. Cloud consulting"
                      disabled={submitting}
                      aria-label={`Offer ${index + 1}`}
                    />
                    {offers.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeOffer(index)}
                        disabled={submitting}
                        aria-label="Remove offer"
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-hairline text-faint hover:bg-white/6 hover:text-cloud"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="partnerWebsite">Website</Label>
                <Input
                  id="partnerWebsite"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnerPhone">Contact phone</Label>
                <Input
                  id="partnerPhone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 555 000 0000"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerEmail">Contact email</Label>
              <Input
                id="partnerEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@company.com"
                required
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerLogo">Company logo</Label>
              <label
                htmlFor="partnerLogo"
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline-strong bg-white/2 px-4 py-8 text-center transition-colors hover:bg-white/4"
              >
                {logoPreview ? (
                  <div className="relative h-16 w-40">
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      fill
                      sizes="160px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <>
                    <ImagePlus className="h-6 w-6 text-violet-bright" />
                    <span className="text-sm font-medium text-cloud">
                      Upload logo
                    </span>
                    <span className="text-xs text-faint">PNG or JPG</span>
                  </>
                )}
                <input
                  id="partnerLogo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={submitting}
                  onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            <div className="flex justify-end border-t border-hairline pt-5">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit application"
                )}
              </Button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
