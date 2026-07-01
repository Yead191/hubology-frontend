import type { LucideIcon } from "lucide-react";

/** Icon + title + description header shown at the top of each wizard step. */
export function StepHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet-bright">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h2 className="text-lg font-semibold text-cloud">{title}</h2>
        <p className="mt-1 text-sm text-mist">{description}</p>
      </div>
    </div>
  );
}
