import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Book } from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import getProfile from "@/helpers/next-fetch/getProfile";
import { BookDetail } from "@/features/store/sections/book-detail";

interface PageProps {
  /** Route param is named `slug` but carries the book `_id`. */
  params: Promise<{ slug: string }>;
}

async function getBook(id: string) {
  const res = await nextFetch<Book>(`/books/${id}`, {
    method: "GET",
    cache: "force-cache",
    next: { tags: ["books", `book-${id}`], revalidate: 60 * 60 },
  });
  return res.success ? res.data : null;
}

/** True when the signed-in user already owns this digital book. */
async function hasPurchasedBook(bookId: string) {
  const res = await nextFetch(`/digital/${bookId}`, {
    method: "GET",
    cache: "no-store",
  });
  // console.log(res)
  return Boolean(res.success && res.data);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug: id } = await params;
  const book = await getBook(id);
  if (!book) return { title: "Book not found" };
  return { title: book.title, description: book.subtitle };
}

export default async function BookDetailPage({ params }: PageProps) {
  const { slug: id } = await params;
  const book = await getBook(id);
  if (!book) notFound();

  const user = await getProfile();
  const purchased = user ? await hasPurchasedBook(id) : false;

  return <BookDetail book={book} purchased={purchased} />;
}
