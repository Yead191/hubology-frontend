import type { LucideIcon } from "lucide-react";

/** Centred placeholder shown when a filtered feed has no posts. */
export function EmptyState({
  icon: Icon,
  title,
  message,
}: {
  icon: LucideIcon;
  title: string;
  message: string;
}) {
  return (
    <div className="border-gradient flex flex-col items-center rounded-3xl bg-panel/30 px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.04] text-violet-bright">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-cloud">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-mist">{message}</p>
    </div>
  );
}
