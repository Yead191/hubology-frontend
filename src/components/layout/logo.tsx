import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Brand wordmark. Uses the supplied SVG asset; falls back gracefully
 * with an accessible label. Sized via height, width auto-scales.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Hubology — home"
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-90",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-hubology.svg"
        alt="Hubology"
        width={150}
        height={25}
        className="h-6 w-auto select-none md:h-7"
        draggable={false}
      />
    </Link>
  );
}
