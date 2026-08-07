import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Book } from "@/types";
import { getImageUrl } from "@/lib/getImageUrl";
import { buildMetadata } from "@/lib/seo";
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
  return Boolean(res.success && res.data);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug: id } = await params;
  const book = await getBook(id);
  if (!book) {
    return buildMetadata({
      title: "Book not found",
      description: "This Hubology digital book could not be found.",
      path: `/store/${id}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: book.title,
    description: (
      book.description ||
      book.subtitle ||
      `Buy and download ${book.title} from the Hubology digital bookstore.`
    ).slice(0, 160),
    path: `/store/${id}`,
    image: getImageUrl(book.image),
    keywords: [
      book.title,
      "digital business book",
      "founder ebook download",
      "Hubology bookstore",
    ],
  });
}

export default async function BookDetailPage({ params }: PageProps) {
  const { slug: id } = await params;
  const book = await getBook(id);
  if (!book) notFound();

  const user = await getProfile();
  const purchased = user ? await hasPurchasedBook(id) : false;

  return <BookDetail book={book} purchased={purchased} />;
}
