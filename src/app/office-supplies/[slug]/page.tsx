import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Book } from "@/types";
import { getImageUrl } from "@/lib/getImageUrl";
import { buildMetadata } from "@/lib/seo";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import TangibleProductDetailView from "@/features/office-supplies/detail-view";

interface PageProps {
  /** Route param is named `slug` but carries the product `_id`. */
  params: Promise<{ slug: string }>;
}

async function getProduct(id: string) {
  const res = await nextFetch<Book>(`/books/${id}`, {
    method: "GET",
    cache: "force-cache",
    next: { tags: ["office-supplies", `book-${id}`], revalidate: 60 * 60 },
  });
  return res.success ? res.data : null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug: id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return buildMetadata({
      title: "Product not found",
      description: "This Hubology office supply product could not be found.",
      path: `/office-supplies/${id}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: product.title,
    description: (
      product.subtitle ||
      product.description ||
      `Shop ${product.title} — premium office supplies for founders on Hubology.`
    ).slice(0, 160),
    path: `/office-supplies/${id}`,
    image: getImageUrl(product.image),
    keywords: [
      product.title,
      "founder office supplies",
      "Hubology store",
      "business workspace products",
    ],
  });
}

export default async function TangibleProductPage({ params }: PageProps) {
  const { slug: id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return <TangibleProductDetailView product={product} />;
}
