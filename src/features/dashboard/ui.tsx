import { cn, formatPrice } from "@/lib/utils";

export function DashboardPanel({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-gradient rounded-3xl bg-panel/50 p-5 backdrop-blur-md sm:p-6",
        className,
      )}
    >
      {(title || actions) && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="font-display text-xl font-semibold text-cloud">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-mist">{description}</p>
            ) : null}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatusPill({
  value,
  tone = "neutral",
}: {
  value: string;
  tone?: "success" | "warning" | "danger" | "neutral" | "info";
}) {
  const tones = {
    success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    warning: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    danger: "border-rose-400/25 bg-rose-400/10 text-rose-300",
    info: "border-sky-400/25 bg-sky-400/10 text-sky-300",
    neutral: "border-hairline-strong bg-white/5 text-mist",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        tones[tone],
      )}
    >
      {value}
    </span>
  );
}

export function statusTone(status?: string): "success" | "warning" | "danger" | "neutral" | "info" {
  const s = (status ?? "").toLowerCase();
  if (
    s.includes("paid") ||
    s.includes("confirm") ||
    s.includes("active") ||
    s.includes("complete") ||
    s.includes("deliver")
  ) {
    return "success";
  }
  if (s.includes("pend") || s.includes("process")) return "warning";
  if (s.includes("fail") || s.includes("cancel") || s.includes("expire")) {
    return "danger";
  }
  if (s.includes("refund")) return "info";
  return "neutral";
}

export function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function formatMoney(amount?: number) {
  if (amount == null || Number.isNaN(amount)) return "—";
  return formatPrice(amount);
}

export function DashboardTable({
  headers,
  children,
  empty,
}: {
  headers: string[];
  children: React.ReactNode;
  empty?: boolean;
}) {
  if (empty) return null;
  return (
    <div className="overflow-x-auto rounded-2xl border border-hairline">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-hairline bg-white/3 text-xs uppercase tracking-wide text-faint">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">{children}</tbody>
      </table>
    </div>
  );
}

export function EmptyDash({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-hairline-strong bg-white/2 px-6 py-14 text-center">
      <p className="font-display text-lg font-semibold text-cloud">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-mist">{message}</p>
    </div>
  );
}
