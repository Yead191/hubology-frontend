import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-20">
      <Aurora
        animated
        className="left-1/2 top-1/3 h-[30rem] w-[40rem] -translate-x-1/2 opacity-45"
      />
      <div className="relative mx-auto max-w-xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-hairline-strong bg-white/[0.04] text-violet-bright">
          <Compass className="h-8 w-8" />
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-violet-bright">
          404
        </p>
        <h1 className="mt-4 text-balance text-4xl font-bold text-cloud sm:text-5xl">
          This page wandered off
        </h1>
        <p className="mt-4 text-lg text-mist">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Back home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/services">Browse services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
