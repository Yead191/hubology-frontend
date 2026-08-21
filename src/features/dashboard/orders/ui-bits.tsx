import { cn } from "@/lib/utils";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
      {children}
    </h3>
  );
}

export function PriceLine({
  label,
  value,
  muted,
  accent,
}: {
  label: string;
  value: string;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="mt-2.5 flex items-center justify-between gap-3 first:mt-0">
      <span className="text-sm text-mist">{label}</span>
      <span
        className={cn(
          "text-sm font-medium",
          muted && "text-faint",
          accent && "text-emerald-300",
          !muted && !accent && "text-cloud",
        )}
      >
        {value}
      </span>
    </div>
  );
}
