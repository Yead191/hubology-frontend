"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { getImageUrl } from "@/lib/getImageUrl";
import { Button } from "@/components/ui/button";
import {
  DashboardPanel,
  DashboardTable,
  EmptyDash,
  StatusPill,
  formatDate,
  formatMoney,
  statusTone,
} from "@/features/dashboard/ui";

export interface DashboardDigitalItem {
  _id: string;
  product?: { _id?: string; title?: string; image?: string | null };
  price?: number;
  paymentStatus?: string;
  paymentIntentId?: string;
  createdAt?: string;
}

export function DigitalTable({ items }: { items: DashboardDigitalItem[] }) {
  return (
    <DashboardPanel
      title="Digital library"
      description="Books and digital products you’ve purchased."
    >
      {items.length === 0 ? (
        <>
          <EmptyDash
            title="No digital products yet"
            message="Explore the store and unlock founder-built books and tools."
          />
          <div className="mt-4 flex justify-center">
            <Button asChild size="sm">
              <Link href="/store">Browse store</Link>
            </Button>
          </div>
        </>
      ) : (
        <DashboardTable
          headers={["Product", "Purchased", "Price", "Payment", ""]}
        >
          {items.map((item) => {
            const image = getImageUrl(item.product?.image);
            const href = item.product?._id
              ? `/store/${item.product._id}`
              : "/store";
            return (
              <tr key={item._id} className="hover:bg-white/2">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md border border-hairline bg-ink">
                      {image ? (
                        <Image
                          src={image}
                          alt={item.product?.title || "Product"}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      ) : null}
                    </span>
                    <span className="font-medium text-cloud">
                      {item.product?.title || "Digital product"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-mist">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-4 py-3 text-cloud">
                  {formatMoney(item.price)}
                </td>
                <td className="px-4 py-3">
                  <StatusPill
                    value={item.paymentStatus || "—"}
                    tone={statusTone(item.paymentStatus)}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button asChild size="sm" variant="outline">
                    <Link href={href}>
                      <ExternalLink className="h-4 w-4" /> Open
                    </Link>
                  </Button>
                </td>
              </tr>
            );
          })}
        </DashboardTable>
      )}
    </DashboardPanel>
  );
}
