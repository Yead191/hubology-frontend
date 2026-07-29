import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Book } from "@/types";
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
  if (!product) return { title: "Product not found" };
  return { title: product.title, description: product.subtitle };
}

export default async function TangibleProductPage({ params }: PageProps) {
  const { slug: id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return <TangibleProductDetailView product={product} />;
}
