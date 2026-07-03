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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getTangibleProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.title,
    description: product.subtitle,
  };
}

export default async function TangibleProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getTangibleProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <TangibleProductDetailView product={product} />;
}
