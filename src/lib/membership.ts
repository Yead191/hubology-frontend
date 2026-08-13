import type { MembershipRecurring } from "@/types";

export function parseRecurring(value?: string): MembershipRecurring {
  if (value === "year" || value === "week") return value;
  return "month";
}

export function recurringHref(
  basePath: string,
  recurring: MembershipRecurring,
) {
  if (recurring === "month") return basePath;
  return `${basePath}?recurring=${recurring}`;
}

export function recurringPeriodLabel(
  recurring?: MembershipRecurring | string | null,
) {
  if (recurring === "year") return "year";
  if (recurring === "week") return "week";
  return "month";
}

export function recurringBillingCopy(
  recurring?: MembershipRecurring | string | null,
) {
  if (recurring === "year") return "Billed yearly · cancel anytime";
  if (recurring === "week") return "Billed weekly · cancel anytime";
  return "Billed monthly · cancel anytime";
}
