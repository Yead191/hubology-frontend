import { Plus } from "lucide-react";

import type { Faq } from "@/types";

/** Lightweight, accessible FAQ using native <details> disclosure. */
export function MembershipFaq({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-center font-display text-2xl font-bold text-cloud sm:text-3xl">
        Questions, answered
      </h2>

      <div className="mt-8 flex flex-col gap-3">
        {faqs?.map((item) => (
          <details
            key={item?._id}
            className="group border-gradient rounded-2xl bg-panel/40 px-5 py-4 transition-colors hover:bg-panel/60 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-[15px] font-medium text-cloud">
              {item?.question}
              <Plus className="h-5 w-5 shrink-0 text-violet-bright transition-transform duration-300 group-open:rotate-45" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-mist">{item?.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
