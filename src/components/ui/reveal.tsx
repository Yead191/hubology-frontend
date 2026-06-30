"use client";

import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/use-reveal";

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  /** Stagger the reveal by N milliseconds. */
  delay?: number;
  as?: "div" | "section" | "article" | "li";
}

/**
 * Wraps content so it fades + slides in when scrolled into view.
 * Animation is pure CSS (see globals.css); this only toggles the class.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  ...props
}: RevealProps) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      data-reveal=""
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={cn(className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
