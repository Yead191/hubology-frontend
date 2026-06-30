import Link from "next/link";
import { ArrowRight, BrainCog, BadgeCheck, Check } from "lucide-react";

import type { RegistrationOption } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const iconMap = {
  "brain-gear": BrainCog,
  "badge-check": BadgeCheck,
} as const;

export function RoleCard({ option }: { option: RegistrationOption }) {
  const Icon = iconMap[option.icon as keyof typeof iconMap] ?? BadgeCheck;
  const isSolid = option.button.variant === "solid";

  return (
    <div
      className={cn(
        "border-gradient group relative flex h-full flex-col rounded-[1.75rem] p-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5",
        isSolid
          ? "bg-panel/70 glow-violet"
          : "bg-panel/40 hover:bg-panel/70 hover:glow-violet",
      )}
    >
      <span
        className={cn(
          "grid h-14 w-14 place-items-center rounded-2xl transition-transform duration-500 group-hover:scale-110",
          isSolid
            ? "bg-brand-gradient text-white shadow-[0_10px_30px_-8px_rgba(129,49,240,0.9)]"
            : "border border-hairline-strong bg-white/[0.04] text-violet-bright",
        )}
      >
        <Icon className="h-7 w-7" />
      </span>

      <h3 className="mt-6 text-2xl font-bold text-cloud">{option.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-mist">
        {option.description}
      </p>

      <ul className="mt-7 flex flex-1 flex-col gap-3.5">
        {option.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm text-cloud/85"
          >
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet/15 text-violet-bright">
              <Check className="h-3 w-3" />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Button
        asChild
        size="lg"
        variant={isSolid ? "default" : "outline"}
        className="mt-8 w-full"
      >
        <Link href={`/register/${option.role}`}>
          {option.button.text}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </Button>
    </div>
  );
}
