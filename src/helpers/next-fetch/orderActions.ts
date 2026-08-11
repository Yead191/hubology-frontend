"use server";

import { nextFetch } from "./NextFetch";
import { revalidateTags } from "./revalidateTags";

export interface CreateOrderPayload {
  city: string;
  postal_code: string;
  street_address: string;
  country: string;
  contact_number: string;
  /** Optional coupon code — omit when empty. */
  coupon?: string;
}

/** POST /order — creates order and returns Stripe checkout URL on `data`. */
export async function createOrder(body: CreateOrderPayload) {
  const result = await nextFetch("/order", {
    method: "POST",
    body,
  });

  if (result.success) {
    await revalidateTags(["cart"]);
  }

  return result;
}
