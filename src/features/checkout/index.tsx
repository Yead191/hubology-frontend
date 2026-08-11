"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

import type { CartData } from "@/types";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { updateCartQuantity } from "@/helpers/next-fetch/cartActions";
import { createOrder } from "@/helpers/next-fetch/orderActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";

function resolveStripeUrl(data: unknown): string | undefined {
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    const candidate =
      d.url ?? d.checkoutUrl ?? d.paymentUrl ?? d.stripeUrl ?? d.sessionUrl;
    if (typeof candidate === "string") return candidate;
  }
  return undefined;
}

export default function CheckoutExperience({
  cart,
  user,
}: {
  cart: CartData | null;
  user: { name: string; email: string };
}) {
  const router = useRouter();
  const lines = cart?.cart ?? [];
  const breakdown = cart?.price_breakdown;

  const [city, setCity] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [streetAddress, setStreetAddress] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [contactNumber, setContactNumber] = React.useState("");
  const [coupon, setCoupon] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  async function handleQuantity(cartId: string, amount: 1 | -1) {
    setUpdatingId(cartId);
    try {
      const res = await updateCartQuantity(cartId, amount);
      if (!res.success) {
        toast.error(res.message || "Could not update quantity.", {
          id: "cart-qty",
        });
        return;
      }
      router.refresh();
    } catch (err) {
      console.error("Cart quantity error:", err);
      toast.error("Network error. Please try again.", { id: "cart-qty" });
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lines.length === 0) {
      toast.error("Your cart is empty.", { id: "checkout" });
      return;
    }

    setSubmitting(true);
    try {
      const couponCode = coupon.trim();
      const response = await createOrder({
        city: city.trim(),
        postal_code: postalCode.trim(),
        street_address: streetAddress.trim(),
        country: country.trim(),
        contact_number: contactNumber.trim(),
        ...(couponCode ? { coupon: couponCode } : {}),
      });

      if (!response?.success) {
        toast.error(response?.message || "Could not create your order.", {
          id: "checkout",
        });
        setSubmitting(false);
        return;
      }

      const stripeUrl = resolveStripeUrl(response.data);
      if (!stripeUrl) {
        toast.error("Payment link unavailable. Please try again.", {
          id: "checkout",
        });
        setSubmitting(false);
        return;
      }

      window.location.href = stripeUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Network error. Please try again.", { id: "checkout" });
      setSubmitting(false);
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <Aurora
        animated
        className="-top-20 left-1/2 h-140 w-176 -translate-x-1/2 opacity-30"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/office-supplies"
          className="mb-8 inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-cloud"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to office supplies
        </Link>

        <div className="grid items-start gap-12 lg:grid-cols-12">
          <Reveal className="order-2 lg:order-1 lg:col-span-7 xl:col-span-8">
            <div className="rounded-3xl border border-hairline-strong bg-panel/40 p-6 backdrop-blur-md sm:p-8">
              <h2 className="mb-6 font-display text-2xl font-bold text-cloud">
                Shipping information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={user.name}
                      disabled
                      className="border-hairline bg-ink/50 opacity-70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="border-hairline bg-ink/50 opacity-70"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street_address">Street address</Label>
                  <Input
                    id="street_address"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="border-hairline bg-ink/50"
                    placeholder="House, road, or area"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="border-hairline bg-ink/50"
                      placeholder="Your city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal code</Label>
                    <Input
                      id="postal_code"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="border-hairline bg-ink/50"
                      placeholder="Postal code"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="border-hairline bg-ink/50"
                      placeholder="Your country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_number">Contact number</Label>
                    <Input
                      id="contact_number"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="border-hairline bg-ink/50"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coupon">
                    Coupon code{" "}
                    <span className="font-normal text-faint">(optional)</span>
                  </Label>
                  <Input
                    id="coupon"
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="border-hairline bg-ink/50"
                    placeholder="Paste your coupon code"
                  />
                </div>

                <div className="mt-8 border-t border-hairline pt-6">
                  <div className="rounded-xl border border-hairline bg-ink/30 p-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-mist">
                      <ShieldCheck className="h-4 w-4 text-violet-bright" />
                      You&apos;ll complete payment securely with Stripe
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting || lines.length === 0}
                  size="lg"
                  className="mt-4 h-14 w-full text-base"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Redirecting
                      to payment…
                    </>
                  ) : (
                    `Pay ${formatPrice(breakdown?.total_price ?? breakdown?.subtotal ?? 0)}`
                  )}
                </Button>
              </form>
            </div>
          </Reveal>

          <Reveal
            className="order-1 lg:order-2 lg:col-span-5 xl:col-span-4"
            delay={100}
          >
            <div className="sticky top-32 rounded-3xl border border-hairline-strong bg-panel/60 p-6 shadow-xl backdrop-blur-md">
              <h2 className="mb-6 font-display text-xl font-bold text-cloud">
                Order summary
              </h2>

              {lines.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-mist">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <p className="text-mist">Your cart is empty.</p>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link href="/office-supplies">Browse supplies</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <ul className="mb-6 max-h-[40vh] space-y-4 overflow-y-auto pr-1">
                    {lines?.map((line) => {
                      const image = getImageUrl(line?.product?.image);
                      const busy = updatingId === line?._id;
                      return (
                        <li key={line?._id} className="flex gap-4">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-hairline bg-ink">
                            {image ? (
                              <Image
                                src={image}
                                alt={line?.product?.title}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            ) : (
                              <span className="grid h-full place-items-center text-violet-bright">
                                <Package className="h-5 w-5 opacity-60" />
                              </span>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col justify-between py-0.5">
                            <div>
                              <h4 className="line-clamp-1 text-sm font-medium text-cloud">
                                {line?.product?.title}
                              </h4>
                              <p className="text-xs text-mist">
                                {formatPrice(line?.unit_price)} each
                              </p>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center rounded border border-hairline bg-ink/50">
                                <button
                                  type="button"
                                  disabled={busy || submitting}
                                  onClick={() =>
                                    handleQuantity(line?._id, -1)
                                  }
                                  className="px-2 py-1 text-mist transition-colors hover:text-cloud disabled:opacity-40"
                                  aria-label="Decrease quantity"
                                >
                                  {busy ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Minus className="h-3 w-3" />
                                  )}
                                </button>
                                <span className="w-6 text-center text-xs text-cloud">
                                  {line?.quantity}
                                </span>
                                <button
                                  type="button"
                                  disabled={busy || submitting}
                                  onClick={() => handleQuantity(line?._id, 1)}
                                  className="px-2 py-1 text-mist transition-colors hover:text-cloud disabled:opacity-40"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <span className="text-sm font-medium text-cloud">
                                {formatPrice(line?.total_price)}
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {breakdown ? (
                    <div className="space-y-3 border-t border-hairline pt-4 text-sm text-mist">
                      <div className="flex justify-between">
                        <span>Products</span>
                        <span className="font-medium text-cloud">
                          {formatPrice(breakdown.products_price)}
                        </span>
                      </div>
                      {breakdown.serviceFee != null ? (
                        <div className="flex justify-between">
                          <span>Service fee</span>
                          <span className="font-medium text-cloud">
                            {formatPrice(breakdown.serviceFee)}
                          </span>
                        </div>
                      ) : null}
                      {breakdown.delivery_charge != null ? (
                        <div className="flex justify-between">
                          <span>Delivery</span>
                          <span className="font-medium text-cloud">
                            {formatPrice(breakdown.delivery_charge)}
                          </span>
                        </div>
                      ) : null}
                      {breakdown.tax != null && breakdown.tax > 0 ? (
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span className="font-medium text-cloud">
                            {formatPrice(breakdown.tax)}
                          </span>
                        </div>
                      ) : null}
                      {breakdown.discount_amount != null &&
                      breakdown.discount_amount > 0 ? (
                        <div className="flex justify-between">
                          <span>Discount</span>
                          <span className="font-medium text-emerald-400">
                            −{formatPrice(breakdown.discount_amount)}
                          </span>
                        </div>
                      ) : null}
                      <div className="flex justify-between border-t border-hairline pt-4 text-base font-bold text-cloud">
                        <span>Total</span>
                        <span className="text-violet-bright">
                          {formatPrice(
                            breakdown.total_price ?? breakdown.subtotal,
                          )}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
