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

/** PATCH /cart/:cartId — change quantity by +1 or -1. */
export async function updateCartQuantity(cartId: string, amount: 1 | -1) {
  const result = await nextFetch<CartData>(`/cart/${cartId}`, {
    method: "PATCH",
    body: { amount },
  });

  if (result.success) {
    await revalidateTags(["cart"]);
  }

  return result;
}
