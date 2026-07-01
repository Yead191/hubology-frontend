import { ShieldCheck, type LucideIcon } from "lucide-react";

interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface RegisterBenefitsProps {
  title: string;
  items: BenefitItem[];
  trust: {
    title: string;
    description: string;
  };
}

export function RegisterBenefits({ title, items, trust }: RegisterBenefitsProps) {
  return (
    <aside className="flex flex-col gap-6">
      <div className="border-gradient relative overflow-hidden rounded-[1.75rem] bg-panel/40 p-7">
        <h3 className="text-lg font-semibold text-cloud">{title}</h3>
        <ul className="mt-6 flex flex-col gap-6">
          {items.map((item) => (
            <li key={item.title} className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-hairline-strong bg-white/4 text-violet-bright">
                <item.icon className="h-5 w-5" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-cloud">
                  {item.title}
                </span>
                <span className="text-sm leading-relaxed text-mist">
                  {item.description}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-gradient relative flex items-start gap-4 overflow-hidden rounded-[1.75rem] bg-brand-gradient/[0.08] p-6">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_8px_24px_-8px_rgba(129,49,240,0.9)]">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-cloud">{trust.title}</span>
          <span className="text-sm leading-relaxed text-mist">
            {trust.description}
          </span>
        </div>
      </div>
    </aside>
  );
}
