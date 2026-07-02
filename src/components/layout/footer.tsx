import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Aurora } from "@/components/ui/aurora";

const footerLinks = [
  {
    heading: "Platform",
    links: [
      { label: "Services", href: "/services" },
      { label: "Store", href: "/store" },
      { label: "Community Forum", href: "/forum" },
      { label: "Membership", href: "/membership" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Contact", href: "/" },
      { label: "Blog", href: "/" },
    ],
  },
  {
    heading: "Get started",
    links: [
      { label: "Join as a Member", href: "/register/member" },
      { label: "Apply as an Expert", href: "/register/expert" },
      { label: "Login", href: "/login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-hairline">
      <Aurora className="-bottom-40 left-1/2 h-80 w-240 -translate-x-1/2 opacity-25" />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8 pt-16 pb-8">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-8 pb-16 relative z-10">
          {/* Left Side */}
          <div className="flex flex-col lg:pr-8">
            <Logo />

            <div className="mt-6 flex gap-4 text-mist">
              <Link href="#" className="hover:text-cloud transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-cloud transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-cloud transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-cloud transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>

            <div className="mt-10 mb-10 h-px w-full bg-hairline" />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {footerLinks.map((col) => (
                <div key={col.heading} className="flex flex-col gap-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">
                    {col.heading}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-mist transition-colors hover:text-cloud"
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

          {/* Right Side */}
          <div className="flex flex-col lg:pl-12 lg:border-l lg:border-hairline relative z-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-cloud mb-8">
              Request a<br />Demo
            </h2>

            <div className="relative flex w-full max-w-md items-center rounded-full bg-black lg:bg-white/5 border border-hairline p-1.5 shadow-xl backdrop-blur-3xl gap-2 ">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent back px-4 py-2.5 text-sm text-cloud placeholder:text-mist focus:outline-none rounded-full"
              />
              <button className="flex h-10 w-16 md:w-20 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Illustrations Container */}
        <div className="absolute bottom-32 left-6 right-6 lg:left-8 lg:right-8 flex items-end justify-between pointer-events-none">
          <div className="relative w-16 md:w-20 lg:w-24 hidden md:block opacity-80">
            <Image src="/assets/images/footer/footer-1.png" alt="Illustration 1" width={96} height={180} className="w-full h-auto object-contain object-bottom" draggable={false} />
          </div>
          <div className="flex">

            <div className="relative w-20 md:w-24 lg:w-28 opacity-80">
              <Image src="/assets/images/footer/footer-2.png" alt="Illustration 2" width={112} height={200} className="w-full h-auto object-contain object-bottom" draggable={false} />
            </div>
            <div className="relative w-20 md:w-24 lg:w-28 hidden md:block opacity-80">
              <Image src="/assets/images/footer/footer-3.png" alt="Illustration 3" width={112} height={200} className="w-full h-auto object-contain object-bottom" draggable={false} />
            </div>
          </div>
          <div className="relative w-32 md:w-40 lg:w-48 opacity-80 ">
            <Image src="/assets/images/footer/footer-4.png" alt="Illustration 4" width={192} height={280} className="w-full h-100 object-contain object-top scale-115" draggable={false} />
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-40 md:mt-56 lg:mt-80 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 text-sm text-faint sm:flex-row relative z-10 ">
          <p>© {new Date().getFullYear()} Hubology. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="transition-colors hover:text-mist">
              Privacy
            </Link>
            <Link href="/" className="transition-colors hover:text-mist">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
