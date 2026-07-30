"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, ShoppingCart } from "lucide-react";

import type { CartData } from "@/types";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CartMenu({ cart }: { cart?: CartData | null }) {
  const lines = cart?.cart ?? [];
  const count = lines.reduce((sum, line) => sum + (line.quantity || 0), 0);
  const subtotal = cart?.price_breakdown?.products_price;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Cart"
          className="relative grid h-10 w-10 place-items-center rounded-full border border-hairline bg-white/3 text-mist transition-colors hover:bg-white/[0.07] hover:text-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/40"
        >
          <ShoppingCart className="h-5 w-5" />
          {count > 0 ? (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-bright px-1 text-[10px] font-bold text-white">
              {count > 99 ? "99+" : count}
            </span>
          ) : null}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="flex items-center justify-between px-4 py-3 text-sm text-cloud">
          <span className="font-semibold">Cart</span>
          <span className="text-xs text-mist">
            {count === 0 ? "Empty" : `${count} item${count === 1 ? "" : "s"}`}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-0" />

        {lines.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet/10 text-violet-bright">
              <Package className="h-5 w-5" />
            </span>
            <p className="text-sm text-mist">Your cart is empty</p>
            <Button asChild variant="outline" size="sm" className="mt-1">
              <Link href="/office-supplies">Browse supplies</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="max-h-72 overflow-y-auto p-2">
              {lines?.map((line) => {
                const image = getImageUrl(line?.product?.image);
                return (
                  <li key={line?._id}>
                    <Link
                      href={`/office-supplies/${line?.product?._id}`}
                      className="flex gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/5"
                    >
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-hairline bg-ink/40">
                        {image ? (
                          <Image
                            src={image}
                            alt={line?.product?.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="grid h-full place-items-center text-violet-bright">
                            <Package className="h-4 w-4 opacity-60" />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 text-sm font-medium text-cloud">
                          {line?.product?.title}
                        </span>
                        <span className="mt-0.5 flex items-center justify-between text-xs text-mist">
                          <span>× {line?.quantity}</span>
                          <span className="font-medium text-cloud">
                            {formatPrice(line?.total_price)}
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <DropdownMenuSeparator className="my-0" />
            <div className="space-y-3 px-4 py-3">
              {subtotal != null ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-mist">Products</span>
                  <span className="font-medium text-cloud">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              ) : null}
              <Button asChild size="sm" className="w-full">
                <Link href="/checkout">Go to checkout</Link>
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
