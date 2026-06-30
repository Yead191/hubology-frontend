import { cn } from "@/lib/utils";

interface AuroraProps {
  className?: string;
  /** Adds the gentle drift animation. */
  animated?: boolean;
}

/**
 * The signature ambient glow. Position it with className (size + placement);
 * it renders behind content and never intercepts pointer events.
 */
export function Aurora({ className, animated = false }: AuroraProps) {
  return (
    <div
      aria-hidden
      className={cn("aurora", animated && "animate-drift", className)}
    />
  );
}
