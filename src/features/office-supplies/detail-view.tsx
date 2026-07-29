"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Loader2,
  Lock,
  Package,
  Ruler,
  Scale,
  ShoppingCart,
  Star,
} from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

import type { Book } from "@/types";
import { formatPrice } from "@/lib/utils";
import { bookCoverUrl, bookId } from "@/lib/book";
import { addToCart } from "@/helpers/next-fetch/cartActions";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { Modal } from "@/components/ui/modal";

function hasAccessToken() {
  return Boolean(Cookies.get("accessToken"));
}

function looksUnauthorized(response: {
  message?: string;
  error?: unknown;
}) {
  const msg = `${response.message ?? ""} ${typeof response.error === "string" ? response.error : ""}`.toLowerCase();
  return (
    msg.includes("unauthorized") ||
    msg.includes("unauthenticated") ||
    msg.includes("not authenticated") ||
    msg.includes("please login") ||
    msg.includes("please log in") ||
    msg.includes("jwt") ||
    msg.includes("token")
  );
}

/** Detail view for an office / tangible product (API book with type=office). */
export default function TangibleProductDetailView({
  product,
}: {
  product: Book;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const id = bookId(product);
  const cover = bookCoverUrl(product);
  const details = product.details ?? {};
  const inStock =
    details.inStock !== false && details.status !== "out-of-stock";
  const loginHref = `/login?redirect=${encodeURIComponent(pathname)}`;

  const [quantity, setQuantity] = React.useState(1);
  const [adding, setAdding] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    setIsLoggedIn(hasAccessToken());
  }, []);

  function requireLogin() {
    setLoginOpen(true);
  }

  async function handleAddToCart() {
    if (!inStock) return;

    if (!hasAccessToken()) {
      setIsLoggedIn(false);
      requireLogin();
      return;
    }
    setIsLoggedIn(true);

    setAdding(true);
    try {
      const response = await addToCart({
        product: id,
        quantity,
      });

      if (!response?.success) {
        if (looksUnauthorized(response)) {
          requireLogin();
          setAdding(false);
          return;
        }
        toast.error(response?.message || "Could not add to cart.", {
          id: "office-add-cart",
        });
        setAdding(false);
        return;
      }

      toast.success("Added to cart", {
        id: "office-add-cart",
        description: `${product.title} × ${quantity}`,
      });
      setAdded(true);
      router.refresh();
      window.setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Network error. Please try again.", {
        id: "office-add-cart",
      });
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <Aurora
        animated
        className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-30"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/office-supplies"
          className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-cloud"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to office supplies
        </Link>

        <Reveal className="mt-12 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-hairline-strong bg-panel shadow-2xl">
            {cover ? (
              <Image
                src={cover}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="grid h-full place-items-center bg-violet/10 text-violet-bright">
                <Package className="h-16 w-16 opacity-50" />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-col gap-2 border-b border-hairline pb-6">
              <h1 className="font-display text-4xl font-bold tracking-tight text-cloud sm:text-5xl">
                {product.title}
              </h1>
              <p className="text-xl text-mist">{product.subtitle}</p>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-mist">
                {product.rating ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {product.rating.average} ({product.rating.totalReviews}{" "}
                    reviews)
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${inStock ? "bg-emerald-500" : "bg-rose-400"}`}
                  />
                  {inStock ? "In stock — ready to ship" : "Out of stock"}
                </span>
              </div>
            </div>

            <div className="border-b border-hairline py-6">
              <div className="mb-6 font-display text-3xl font-bold text-cloud">
                {formatPrice(product.price)}
              </div>

              <div className="mb-2 flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-hairline-strong bg-panel/50">
                  <button
                    type="button"
                    className="px-4 py-2 text-mist transition-colors hover:text-cloud"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    disabled={adding}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium text-cloud">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="px-4 py-2 text-mist transition-colors hover:text-cloud"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    disabled={adding}
                  >
                    +
                  </button>
                </div>

                <Button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!inStock || adding || added}
                  size="lg"
                  className="flex-1"
                >
                  {adding ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Adding…
                    </>
                  ) : added ? (
                    <>
                      <Check className="h-5 w-5" /> Added to cart
                    </>
                  ) : isLoggedIn ? (
                    <>
                      <ShoppingCart className="h-5 w-5" /> Add to cart
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" /> Sign in to add
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-6 py-6">
              <div>
                <h3 className="mb-2 font-display text-lg font-semibold text-cloud">
                  Description
                </h3>
                <p className="text-pretty leading-relaxed text-mist">
                  {product.description}
                </p>
              </div>

              {(details.material || details.dimensions || details.weight) && (
                <div>
                  <h3 className="mb-3 font-display text-lg font-semibold text-cloud">
                    Product details
                  </h3>
                  <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    {details.material ? (
                      <div className="rounded-lg border border-hairline/50 bg-panel/40 p-3">
                        <dt className="flex items-center gap-1.5 font-medium text-faint">
                          <Package className="h-3.5 w-3.5" /> Material
                        </dt>
                        <dd className="mt-1 text-cloud">{details.material}</dd>
                      </div>
                    ) : null}
                    {details.dimensions ? (
                      <div className="rounded-lg border border-hairline/50 bg-panel/40 p-3">
                        <dt className="flex items-center gap-1.5 font-medium text-faint">
                          <Ruler className="h-3.5 w-3.5" /> Dimensions
                        </dt>
                        <dd className="mt-1 text-cloud">{details.dimensions}</dd>
                      </div>
                    ) : null}
                    {details.weight ? (
                      <div className="rounded-lg border border-hairline/50 bg-panel/40 p-3">
                        <dt className="flex items-center gap-1.5 font-medium text-faint">
                          <Scale className="h-3.5 w-3.5" /> Weight
                        </dt>
                        <dd className="mt-1 text-cloud">{details.weight}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      <Modal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        title="Sign in to add to cart"
        description="Your cart is tied to your Hubology account so you can check out anytime."
      >
        <div className="flex flex-col items-center gap-5 py-2 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_40px_-10px_rgba(129,49,240,0.9)]">
            <Lock className="h-6 w-6" />
          </span>
          <p className="max-w-xs text-sm text-mist">
            Sign in to add{" "}
            <span className="text-cloud">{product.title}</span> to your cart.
          </p>
          <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href={loginHref}>Sign in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/join">Create an account</Link>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
