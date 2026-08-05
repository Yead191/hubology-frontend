"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

import type { CartData } from "@/types";
import { cn } from "@/lib/utils";
import { navItems } from "@/data/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { TopbarNotifications } from "@/components/layout/Notification/TopbarNotifications";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { CartMenu } from "@/components/layout/cart-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function Navbar({ user, cart }: { user: any; cart?: CartData | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet on route change.
  React.useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center pt-4 pr-(--removed-body-scroll-bar-size)">
      <div className="max-w-6xl w-full px-4 lg:px-6">
        <nav
          className={cn(
            "flex w-full items-center justify-between gap-4 rounded-full border px-3 py-2.5 transition-all duration-500 ease-out-soft glass-dark border-hairline-strong shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-2xl",
            scrolled && "shadow-[0_12px_48px_-12px_rgba(0,0,0,0.75)]",
          )}
        >
          <div className="flex items-center gap-2 pl-2">
            <Logo />
          </div>

          {/* Desktop nav items */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);

              if (item.subItems) {
                return (
                  <li key={item.href}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                            "relative flex cursor-pointer items-center gap-1 rounded-full px-4 py-2 text-xs font-medium outline-none transition-colors duration-300",
                            active
                              ? "text-cloud!"
                              : "text-mist! hover:text-cloud!",
                          )}
                        >
                          {active && (
                            <span className="absolute inset-0 rounded-full bg-white/6 ring-1 ring-hairline-strong" />
                          )}
                          <span className="relative">{item.label}</span>
                          <ChevronDown className="relative h-3 w-3 opacity-50" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-48">
                        {item.subItems.map((subItem) => (
                          <DropdownMenuItem key={subItem.href} asChild>
                            <Link href={subItem.href} className="w-full">
                              {subItem.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex items-center rounded-full px-4 py-2 text-xs font-medium transition-colors duration-300",
                      active ? "text-cloud" : "text-mist hover:text-cloud",
                    )}
                  >
                    {active && (
                      <span className="absolute inset-0 rounded-full bg-white/6 ring-1 ring-hairline-strong" />
                    )}
                    <span className="relative">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {user && user?._id && <CartMenu cart={cart} />}
            {user && user._id ? (
              <>
                {/* Single instance — also shown on mobile so socket/badge stay in sync */}
                <TopbarNotifications userId={user._id} />
                <div className="hidden items-center gap-2 sm:flex">
                  <ProfileMenu user={user} />
                </div>
              </>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/join">Join Hub</Link>
                </Button>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full border border-hairline bg-white/3 text-cloud transition-colors hover:bg-white/[0.07] lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile sheet */}
        <div
          className={cn(
            "fixed inset-x-4 top-21 z-40 origin-top rounded-3xl border border-hairline-strong backdrop-blur-2xl p-4 transition-all duration-300 ease-out-soft lg:hidden bg-[#212130]",
            mobileOpen
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-95 opacity-0",
          )}
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);

              if (item.subItems) {
                return (
                  <li key={item.href} className="flex flex-col gap-1">
                    <Collapsible defaultOpen={false}>
                      <CollapsibleTrigger asChild>
                        <button className="group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold tracking-wider text-mist transition-colors hover:bg-white/4">
                          {item.label}
                          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="flex flex-col gap-1 pb-1 pt-1">
                          {item.subItems.map((subItem) => {
                            const subActive = isActive(pathname, subItem.href);
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                  "ml-2 block rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                                  subActive
                                    ? "bg-white/6 text-cloud"
                                    : "text-mist hover:bg-white/4 hover:text-cloud",
                                )}
                              >
                                {subItem.label}
                              </Link>
                            );
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-white/6 text-cloud"
                        : "text-mist hover:bg-white/4 hover:text-cloud",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 flex flex-col gap-2 border-t border-hairline pt-3">
            {user && user._id ? (
              <div className="flex items-center gap-3 px-2">
                <ProfileMenu user={user} />
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-cloud">
                    {user.name}
                  </span>
                  <span className="text-xs text-mist">{user.email}</span>
                </span>
              </div>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/join">Join Hub</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
