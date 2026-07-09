"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { Input } from "@/components/ui/input";
import { ProductGrid } from "@/features/office-supplies/sections/product-grid";
import { getAllTangibleProducts } from "@/data/office-supplies";

export default function OfficeSuppliesExperience() {
  const allProducts = React.useMemo(() => getAllTangibleProducts(), []);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery) return allProducts;
    const lowerQuery = searchQuery.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.subtitle.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, allProducts]);

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <Aurora
        animated
        className="-top-10 left-1/2 h-120 w-176 -translate-x-1/2 opacity-40"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <header className="max-w-2xl">
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-cloud sm:text-4xl">
              Office <span className="text-gradient">Supplies</span>
            </h1>
            <p className="mt-3 text-pretty text-mist">
              Premium physical goods designed to keep founders organized and focused on what matters most. From notebooks to vision boards, equip your office with the best tools.
            </p>
          </header>

          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-9 bg-white/5 border-hairline-strong focus:border-violet-bright"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Reveal>

        {/* Experience */}
        <div className="mt-10">
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-hairline-strong bg-panel/30">
              <p className="text-mist">No products found for "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-sm text-violet-bright hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
