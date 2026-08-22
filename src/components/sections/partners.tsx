import type { PartnerLogo } from "@/types";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { PartnerLogoCarousel } from "@/components/sections/partner-carousel";

async function fetchPartnerLogos(): Promise<PartnerLogo[]> {
  const res = await nextFetch<PartnerLogo[]>("/partner/logos", {
    method: "GET",
    cache: "force-cache",
    next: { tags: ["partners"], revalidate: 60 * 30 },
  });
  return res.success && Array.isArray(res.data) ? res.data : [];
}

export async function Partners() {
  const logos = await fetchPartnerLogos();
  return <PartnerLogoCarousel logos={logos} />;
}
