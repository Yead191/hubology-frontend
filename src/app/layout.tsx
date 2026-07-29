import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/components/auth/auth-context";
import { MembershipProvider } from "@/features/membership/membership-context";
import { PurchaseProvider } from "@/features/store/purchase-context";
import { CartProvider } from "@/components/cart/cart-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DemoAuthToggle } from "@/components/layout/demo-auth-toggle";
import { Toaster } from "sonner";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hubology — Launch, grow, and scale your business",
    template: "%s · Hubology",
  },
  description:
    "The all-in-one digital workspace to launch, grow, and scale your business. Access tools, resources, and a community of verified experts in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-ink text-cloud antialiased scroll-smooth">
        <Toaster
          position="bottom-right"
          richColors
          duration={2000}
          closeButton={true}
        />
        <AuthProvider>
          <MembershipProvider>
            <PurchaseProvider>
              <CartProvider>
                <Navbar />
                <main className="relative">{children}</main>
                <Footer />
                <DemoAuthToggle />
              </CartProvider>
            </PurchaseProvider>
          </MembershipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
