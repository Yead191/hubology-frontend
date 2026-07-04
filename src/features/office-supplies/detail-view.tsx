"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ShoppingCart, Star } from "lucide-react";

import type { TangibleProduct } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";

export default function TangibleProductDetailView({
  product,
}: {
  product: TangibleProduct;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [added, setAdded] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity,
      image: product.coverImage,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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
          Back to Tangible Products
        </Link>

        <Reveal className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Image Gallery area */}
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-hairline-strong bg-panel shadow-2xl">
            <Image
              src={product.coverImage}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex flex-col gap-2 border-b border-hairline pb-6">
              <h1 className="font-display text-4xl font-bold tracking-tight text-cloud sm:text-5xl">
                {product.title}
              </h1>
              <p className="text-xl text-mist">{product.subtitle}</p>

              <div className="mt-2 flex items-center gap-4 text-sm text-mist">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {product.rating.average} ({product.rating.totalReviews} reviews)
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {product.details.inStock ? "In Stock - Ready to Ship" : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="py-6 border-b border-hairline">
              <div className="font-display text-3xl font-bold text-cloud mb-6">
                {formatPrice(product.price)}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-hairline-strong rounded-lg bg-panel/50">
                  <button
                    className="px-4 py-2 text-mist hover:text-cloud transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-cloud font-medium">
                    {quantity}
                  </span>
                  <button
                    className="px-4 py-2 text-mist hover:text-cloud transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={!product.details.inStock || added}
                  className="flex-1 rounded-full h-12 text-base font-medium shadow-[0_0_20px_rgba(129,49,240,0.3)] transition-all hover:shadow-[0_0_25px_rgba(129,49,240,0.5)]"
                >
                  {added ? (
                    <>
                      <Check className="mr-2 h-5 w-5" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="py-6 space-y-6">
              <div>
                <h3 className="font-display text-lg font-semibold text-cloud mb-2">
                  Description
                </h3>
                <p className="text-mist leading-relaxed text-pretty">
                  {product.description}
                </p>
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold text-cloud mb-3">
                  Product Details
                </h3>
                <dl className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-2 text-sm">
                  {product.details.material && (
                    <div className="bg-panel/40 p-3 rounded-lg border border-hairline/50">
                      <dt className="text-faint font-medium">Material</dt>
                      <dd className="mt-1 text-cloud">{product.details.material}</dd>
                    </div>
                  )}
                  {product.details.dimensions && (
                    <div className="bg-panel/40 p-3 rounded-lg border border-hairline/50">
                      <dt className="text-faint font-medium">Dimensions</dt>
                      <dd className="mt-1 text-cloud">{product.details.dimensions}</dd>
                    </div>
                  )}
                  {product.details.weight && (
                    <div className="bg-panel/40 p-3 rounded-lg border border-hairline/50">
                      <dt className="text-faint font-medium">Weight</dt>
                      <dd className="mt-1 text-cloud">{product.details.weight}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
