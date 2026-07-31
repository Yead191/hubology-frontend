"use server";

import { nextFetch } from "./NextFetch";

/** POST /subscription/subscribe/:planId — returns a Stripe payment link in `data`. */
export async function subscribeToPlan(planId: string) {
  return nextFetch(`/subscription/subscribe/${planId}`, {
    method: "POST",
  });
}
