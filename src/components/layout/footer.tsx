import Link from "next/link";
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
      <Aurora className="-bottom-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 opacity-25" />
      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-mist">
              The all-in-one digital workspace to launch, grow, and scale your
              business — alongside verified experts and a community that gets it.
            </p>
          </div>

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

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 text-sm text-faint sm:flex-row">
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
