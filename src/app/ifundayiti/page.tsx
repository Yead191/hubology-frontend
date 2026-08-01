import type { Metadata } from "next";
import IFundAyiti from "@/features/ifundayiti";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "IFundAyiti Micro-Grants",
  description:
    "IFundAyiti empowers Haitian entrepreneurs with up to $1,000 equity-free micro-grants. Apply, track your application, and support the program fund.",
  path: "/ifundayiti",
  keywords: [
    "IFundAyiti",
    "Haiti micro grants",
    "equity-free grants for entrepreneurs",
    "Haitian startup funding",
    "small business grants Haiti",
  ],
});

export default function IFundAyitiPage() {
  return <IFundAyiti />;
}
