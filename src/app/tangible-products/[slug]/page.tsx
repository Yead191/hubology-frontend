import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTangibleProductBySlug, getAllTangibleProducts } from "@/data/tangible-products";
import TangibleProductDetailView from "@/features/tangible-products/detail-view";

export async function generateStaticParams() {
  return getAllTangibleProducts().map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = getTangibleProductBySlug(params.slug);
  if (!product) return {};

  return {
    title: product.title,
    description: product.subtitle,
  };
}

export default function TangibleProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getTangibleProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <TangibleProductDetailView product={product} />;
}
