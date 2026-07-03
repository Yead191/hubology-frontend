"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Trash2 } from "lucide-react";

import { useCart } from "@/components/cart/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";

export default function CheckoutExperience() {
  const { items, cartTotal, updateQuantity, removeItem, clearCart } = useCart();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const shippingCost = items.length > 0 ? 15.0 : 0;
  const finalTotal = cartTotal + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    // Simulate API call for checkout
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="relative flex min-h-screen items-center justify-center pt-32 pb-20">
        <Aurora animated className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
        <Reveal className="relative z-10 mx-auto max-w-md text-center p-8 rounded-3xl border border-hairline-strong bg-panel/80 backdrop-blur-md shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-cloud mb-3">Order Confirmed</h1>
          <p className="text-mist mb-8">
            Thank you for your purchase! We've received your order and will begin processing it right away. You will receive an email confirmation shortly.
          </p>
          <Button asChild className="w-full h-12 rounded-full font-medium">
            <Link href="/tangible-products">Continue Shopping</Link>
          </Button>
        </Reveal>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <Aurora
        animated
        className="-top-20 left-1/2 h-140 w-176 -translate-x-1/2 opacity-30"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/tangible-products"
          className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-cloud mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Link>

        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Shipping Form */}
          <Reveal className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
            <div className="rounded-3xl border border-hairline-strong bg-panel/40 p-6 sm:p-8 backdrop-blur-md">
              <h2 className="font-display text-2xl font-bold text-cloud mb-6">
                Shipping Information
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required className="bg-ink/50 border-hairline" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required className="bg-ink/50 border-hairline" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" required className="bg-ink/50 border-hairline" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" required className="bg-ink/50 border-hairline" />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required className="bg-ink/50 border-hairline" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip / Postal Code</Label>
                    <Input id="zipCode" required className="bg-ink/50 border-hairline" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" defaultValue="United States" required className="bg-ink/50 border-hairline" />
                </div>

                <div className="mt-8 pt-6 border-t border-hairline">
                  <h3 className="font-display text-lg font-bold text-cloud mb-4">
                    Payment Method
                  </h3>
                  <div className="rounded-xl border border-hairline bg-ink/30 p-4">
                    <p className="text-sm text-mist text-center mb-2">
                      Future implementation will include Stripe integration here.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-faint">
                      <ShieldCheck className="h-4 w-4" />
                      Secure dummy checkout
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || items.length === 0} 
                  className="w-full h-14 rounded-xl text-lg font-medium shadow-[0_0_20px_rgba(129,49,240,0.3)] hover:shadow-[0_0_30px_rgba(129,49,240,0.5)] mt-8"
                >
                  {isSubmitting ? "Processing..." : `Place Order • ${formatPrice(finalTotal)}`}
                </Button>
              </form>
            </div>
          </Reveal>

          {/* Order Summary */}
          <Reveal className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2" delay={100}>
            <div className="sticky top-32 rounded-3xl border border-hairline-strong bg-panel/60 p-6 backdrop-blur-md shadow-xl">
              <h2 className="font-display text-xl font-bold text-cloud mb-6">
                Order Summary
              </h2>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-mist">
                    <Trash2 className="h-5 w-5" />
                  </div>
                  <p className="text-mist">Your cart is empty.</p>
                </div>
              ) : (
                <>
                  <ul className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
                    {items.map((item) => (
                      <li key={item.id} className="flex gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink border border-hairline">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between py-0.5">
                          <div>
                            <h4 className="text-sm font-medium text-cloud line-clamp-1">{item.title}</h4>
                            <p className="text-xs text-mist">{formatPrice(item.price)}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 border border-hairline rounded bg-ink/50">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 text-xs text-mist hover:text-cloud"
                              >
                                -
                              </button>
                              <span className="text-xs text-cloud w-3 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 text-xs text-mist hover:text-cloud"
                              >
                                +
                              </button>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3 border-t border-hairline pt-4 text-sm text-mist">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-cloud font-medium">{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-cloud font-medium">{formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between border-t border-hairline pt-4 text-base font-bold text-cloud">
                      <span>Total</span>
                      <span className="text-violet-bright">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
