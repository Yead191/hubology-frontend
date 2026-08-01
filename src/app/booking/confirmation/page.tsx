import type { Metadata } from "next";

import { getServicePackage } from "@/data/services";
import { BookingConfirmation } from "@/features/service-booking/sections/booking-confirmation";

import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata(
  "Booking confirmed",
  "Your Hubology service booking is confirmed.",
);

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{
    service?: string;
    ref?: string;
    date?: string;
    time?: string;
  }>;
}) {
  const { service, ref, date, time } = await searchParams;

  return (
    <BookingConfirmation
      service={service ? getServicePackage(service) : undefined}
      reference={ref}
      date={date}
      time={time}
    />
  );
}
