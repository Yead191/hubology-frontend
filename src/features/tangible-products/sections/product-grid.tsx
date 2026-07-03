import Link from "next/link";
import Image from "next/image";
import { Star, Share2, ArrowRight } from "lucide-react";

import type { TangibleProduct } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

export function ProductCard({ product }: { product: TangibleProduct }) {
  return (
    <Link
      href={`/tangible-products/${product.slug}`}
      className="border-gradient group flex h-full flex-col rounded-3xl bg-panel/40 p-4 transition-all duration-500 ease-out-soft hover:-translate-y-1 hover:bg-panel/70 hover:glow-violet"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ink/50">
        <Image
          src={product.coverImage}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 ease-out-soft group-hover:scale-105"
        />
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="font-display text-base font-semibold text-cloud">
          {product.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-mist">{product.subtitle}</p>

        <div className="mt-2 flex items-center gap-3 text-xs text-mist">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {product.rating.average}
          </span>
          <span className="inline-flex items-center gap-1">
            <Share2 className="h-3.5 w-3.5" />
            {product.shares.toLocaleString()}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
          <span className="font-display text-lg font-bold text-cloud">
            {formatPrice(product.price)}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-violet-bright">
            View
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: TangibleProduct[] }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <Reveal key={product.id} delay={(i % 4) * 70} className="h-full">
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}
