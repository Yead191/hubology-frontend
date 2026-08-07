import Link from "next/link";
import Image from "next/image";
import { FaTiktok } from "react-icons/fa";
import { Facebook, Instagram } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Aurora } from "@/components/ui/aurora";

const footerLinks = [
  {
    heading: "Platform",
    links: [
      { label: "Services", href: "/services" },
      { label: "Vendors", href: "/vendors" },
      { label: "Store", href: "/store" },
      { label: "Community Forum", href: "/forum" },
      { label: "Member Membership", href: "/membership" },
      { label: "Vendor Membership", href: "/membership/vendor" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Our Partners", href: "/partners" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms and Condition", href: "/terms" },
      { label: "Refund Policy", href: "/refund" },
    ],
  },
  {
    heading: "Get started",
    links: [
      { label: "Join as a Member", href: "/register/member" },
      { label: "Apply as a Vendor", href: "/register/expert" },
      { label: "Login", href: "/login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-32 min-h-112.5 overflow-hidden border-t border-hairline bg-ink">
      <div className="absolute top-2  sm:hidden flex-col lg:col-span-4 items-start justify-start px-6">
        <Logo />
      </div>

      {/* Premium ambient glow */}
      <Aurora className="-bottom-40 left-1/2 h-96 w-240 -translate-x-1/2 opacity-25" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8 pt-8 sm:pt-16 pb-12 z-10">
        {/* Decorative Images */}

        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute  bottom-41 sm:bottom-30 left-0 w-40 h-40 md:w-48 lg:w-56 md:h-48 lg:h-72 opacity-100 overflow-hidden z-30">
            <Image
              src="/assets/images/footer/left-footer.png"
              alt="Professional Man"
              fill
              className="object-cover object-top brightness-70"
            />
          </div>
          <div className="absolute  bottom-41 sm:bottom-30 left-22 lg:left-28 w-40 h-40 md:w-48 lg:w-56 md:h-48 lg:h-72 opacity-100 overflow-hidden z-10">
            <Image
              src="/assets/images/footer/middle-footer.png"
              alt="Professional woman"
              fill
              className="object-cover object-top brightness-70"
            />
          </div>
          <div className="absolute hidden sm:flex sm:bottom-28 right-0 w-32 h-32 md:w-60 md:h-40 opacity-100 overflow-hidden">
            <Image
              src="/assets/images/footer/right-footer.png"
              alt="Student with Laptop"
              fill
              className="object-cover brightness-70"
            />
          </div>
          <div className="absolute sm:hidden top-0 right-0 w-34 h-32 md:w-40 md:h-40 opacity-100 overflow-hidden z-0">
            <Image
              src="/assets/images/footer/right-footer.png"
              alt="Student with Laptop"
              fill
              className="object-cover brightness-70"
            />
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 pb-20 ">
          {/* Logo & Tagline (Left) */}
          <div className="hidden sm:flex flex-col lg:col-span-4 absolute top-2">
            <Logo />
          </div>
          <div className="hidden sm:flex flex-col lg:col-span-4 "></div>

          {/* Links Grid (Right) */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8 pt-16 sm:pt-0 relative z-20">
            {footerLinks.map((col) => (
              <div key={col.heading} className="flex flex-col gap-5">
                <h3 className="text-sm font-semibold text-cloud">
                  {col.heading}
                </h3>
                <ul className="flex flex-col gap-3.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-mist transition-colors hover:text-violet-bright"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col-reverse items-center justify-between gap-6 border-t border-hairline mt-26 sm:mt-0 pt-8 md:flex-row">
          <p className="text-sm text-faint">
            © {new Date().getFullYear()} Hubology. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-5">
            <Link
              href="https://www.facebook.com/share/1EBwf2EKjB/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-primary transition-all duration-300 hover:-translate-y-1 hover:bg-violet-bright hover:text-white hover:shadow-[0_0_15px_rgba(154,85,255,0.5)]"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </Link>
            <Link
              href="https://www.instagram.com/thehubology?Igsh=MTI2bmRkaXIkMIJseA%3D%3D&utm"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-primary transition-all duration-300 hover:-translate-y-1 hover:bg-violet-bright hover:text-white hover:shadow-[0_0_15px_rgba(154,85,255,0.5)]"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </Link>
            <Link
              href="https://www.tiktok.com/@thehubology?_r=1&_t=ZT-97hyzNRc1k6"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-primary transition-all duration-300 hover:-translate-y-1 hover:bg-violet-bright hover:text-white hover:shadow-[0_0_15px_rgba(154,85,255,0.5)]"
              aria-label="Tiktok"
            >
              <FaTiktok />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
