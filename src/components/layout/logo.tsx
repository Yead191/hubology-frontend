import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Brand wordmark for the navbar. Renders the supplied SVG asset
 * with two premium, lightweight touches:
 *  - a soft violet glow that warms on hover, and
 *  - a light-sweep shimmer clipped to the exact logo silhouette
 *    (via mask) that plays once on hover/focus.
 *
 * Pure CSS (see globals.css); animations are disabled under
 * prefers-reduced-motion. Sized via height; width auto-scales.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Hubology — home"
      className={cn(
        "group logo-sweep logo-sweep-hover relative inline-flex items-center outline-none",
        className,
      )}
      style={{ ["--logo-src" as string]: "url('/logo-hubology.svg')" }}
    >
      {/* Soft brand glow — subtle at rest, blooms on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-full opacity-0 blur-md transition-opacity duration-500 ease-out-soft group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(60% 120% at 30% 50%, rgba(129,49,240,0.35), transparent 70%)",
        }}
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-hubology.svg"
        alt="Hubology"
        width={150}
        height={25}
        className="relative h-6 w-auto select-none transition-transform duration-500 ease-out-soft group-hover:scale-[1.03] md:h-7"
        draggable={false}
      />
    </Link>
  );
}
