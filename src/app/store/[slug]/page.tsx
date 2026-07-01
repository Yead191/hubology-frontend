import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBookBySlug, getBookSlugs } from "@/data/books";
import { BookDetail } from "@/features/store/sections/book-detail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getBookSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return { title: "Book not found" };
  return { title: book.title, description: book.subtitle };
}

export default async function BookDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  return <BookDetail book={book} />;
}
