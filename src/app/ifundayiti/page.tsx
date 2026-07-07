import type { Metadata } from "next";
import IFundAyiti from "@/features/ifundayiti";

export const metadata: Metadata = {
  title: "IFundAyiti Micro-Grants",
  description:
    "Empowering Haitian entrepreneurs with up to $1,000 equity-free micro-grants. Track applications and support our program fund directly.",
};

export default function IFundAyitiPage() {
  return <IFundAyiti />;
}
