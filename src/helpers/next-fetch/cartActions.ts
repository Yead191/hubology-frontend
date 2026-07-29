"use server";

import { nextFetch } from "./NextFetch";
import { revalidateTags } from "./revalidateTags";
import type { CartData } from "@/types";

/** POST /cart — add (or increment) a product line, then refresh the cart cache. */
export async function addToCart(body: { product: string; quantity: number }) {
  const result = await nextFetch<CartData>("/cart", {
    method: "POST",
    body,
  });

  if (result.success) {
    await revalidateTags(["cart"]);
  }

  return result;
}
