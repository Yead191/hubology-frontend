import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "What does my membership unlock?",
    a: "Every plan includes full access to the community forum — where founders and verified experts share advice — plus the expert directory and member resources. Higher tiers add private sessions, events, and store discounts.",
  },
  {
    q: "Do I need a membership to use the forum?",
    a: "Yes. The community forum is a members-only space, so a plan is your key in. Verified experts are granted access as part of their vendor status.",
  },
  {
    q: "Can I change or cancel my plan later?",
    a: "Absolutely. You can upgrade, downgrade, or cancel at any time — changes take effect from your next billing cycle and you keep access until then.",
  },
  {
    q: "What's the difference between monthly and yearly billing?",
    a: "Yearly billing gives you the same membership at a lower effective monthly rate — roughly 20% off compared with paying month to month.",
  },
];

/** Lightweight, accessible FAQ using native <details> disclosure. */
export function MembershipFaq() {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-center font-display text-2xl font-bold text-cloud sm:text-3xl">
        Questions, answered
      </h2>

      <div className="mt-8 flex flex-col gap-3">
        {FAQS.map((item) => (
          <details
            key={item.q}
            className="group border-gradient rounded-2xl bg-panel/40 px-5 py-4 transition-colors hover:bg-panel/60 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-[15px] font-medium text-cloud">
              {item.q}
              <Plus className="h-5 w-5 shrink-0 text-violet-bright transition-transform duration-300 group-open:rotate-45" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-mist">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
