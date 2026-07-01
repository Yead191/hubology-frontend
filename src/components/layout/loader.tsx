import { cn } from "@/lib/utils";

/* ============================================================
   Hubology — premium shared loader
   A self-contained brand loader built on pure CSS animation:
   the "hub" spinner (dual counter-rotating gradient rings, a
   breathing core and an orbiting node) paired with the real
   wordmark carrying a light-sweep shimmer.

   No animation library; honours prefers-reduced-motion via
   globals.css.
   ============================================================ */

type Size = "sm" | "md" | "lg";

const SPINNER_PX: Record<Size, number> = { sm: 40, md: 72, lg: 104 };
const WORDMARK_H: Record<Size, string> = {
  sm: "h-4",
  md: "h-6",
  lg: "h-8",
};

/**
 * The animated brand mark on its own — a compact "hub" of two
 * counter-rotating gradient arcs, a pulsing core and a node
 * orbiting the outer ring. Drop it anywhere a spinner is needed.
 */
export function BrandSpinner({
  size = "md",
  className,
}: {
  size?: Size;
  className?: string;
}) {
  const px = SPINNER_PX[size];
  return (
    <span
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: px, height: px }}
      role="status"
      aria-label="Loading"
    >
      {/* Ambient violet glow */}
      <span
        aria-hidden
        className="loader-glow absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(129,49,240,0.55), rgba(3,193,251,0.18) 55%, transparent 72%)",
          filter: "blur(6px)",
        }}
      />

      <svg
        viewBox="0 0 100 100"
        width={px}
        height={px}
        fill="none"
        aria-hidden
        className="relative"
      >
        <defs>
          <linearGradient id="hubViolet" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0" stopColor="#9a55ff" />
            <stop offset="0.55" stopColor="#8131f0" />
            <stop offset="1" stopColor="#4a1c8a" />
          </linearGradient>
          <linearGradient id="hubCyan" x1="0" y1="100" x2="100" y2="0">
            <stop offset="0" stopColor="#136FF4" />
            <stop offset="1" stopColor="#03C1FB" />
          </linearGradient>
          <radialGradient id="hubCore" cx="0.5" cy="0.45" r="0.6">
            <stop offset="0" stopColor="#c9b4ff" />
            <stop offset="0.5" stopColor="#8131f0" />
            <stop offset="1" stopColor="#03C1FB" />
          </radialGradient>
        </defs>

        {/* faint full rings for depth */}
        <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle cx="50" cy="50" r="30" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />

        {/* outer ring — violet arc, clockwise */}
        <g className="hub-rot">
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="url(#hubViolet)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="150 114"
          />
        </g>

        {/* inner ring — cyan arc, counter-clockwise */}
        <g className="hub-rot-rev">
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="url(#hubCyan)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="98 91"
          />
        </g>

        {/* node tracing the outer orbit */}
        <g className="hub-orbit">
          <circle cx="50" cy="8" r="4.5" fill="#03C1FB" />
          <circle cx="50" cy="8" r="7" fill="#03C1FB" opacity="0.25" />
        </g>

        {/* breathing core */}
        <circle className="hub-core" cx="50" cy="50" r="11" fill="url(#hubCore)" />
        <circle cx="50" cy="50" r="11" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
      </svg>
    </span>
  );
}

/**
 * Full loader: the brand spinner above the wordmark (with a
 * light-sweep shimmer clipped to the logo silhouette) and an
 * optional caption. Use inline, or set `fullscreen` for a
 * centred overlay on the brand background.
 */
export function Loader({
  size = "md",
  label,
  showWordmark = true,
  fullscreen = true,
  className,
}: {
  size?: Size;
  label?: string;
  showWordmark?: boolean;
  fullscreen?: boolean;
  className?: string;
}) {
  const content = (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      <BrandSpinner size={size} />

      {showWordmark && (
        <div
          className="logo-sweep logo-sweep-loop relative"
          style={{ ["--logo-src" as string]: "url('/logo-hubology.svg')" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-hubology.svg"
            alt="Hubology"
            className={cn("w-auto select-none opacity-95", WORDMARK_H[size])}
            draggable={false}
          />
        </div>
      )}

      {label && (
        <p className="text-sm font-medium tracking-wide text-mist" aria-live="polite">
          {label}
        </p>
      )}
    </div>
  );

  if (!fullscreen) return content;

  return (
    <div
      role="status"
      aria-busy="true"
      className="loader-in fixed inset-0 z-100 grid place-items-center overflow-hidden bg-ink"
    >
      {/* signature ambient aurora */}
      <span
        aria-hidden
        className="aurora animate-drift"
        style={{ width: 420, height: 420, left: "50%", top: "42%", transform: "translate(-50%,-50%)" }}
      />
      <div className="relative">{content}</div>
    </div>
  );
}

export default Loader;
