"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { hasActiveSubscription } from "@/lib/forum";
import type { UserSubscription } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DASHBOARD_NAV } from "@/features/dashboard/nav";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export function DashboardShell({
  user,
  children,
}: {
  user: {
    name?: string;
    email?: string;
    image?: string;
    role?: string;
    subscription?: UserSubscription | null;
  };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const activePlan = hasActiveSubscription(user.subscription)
    ? user.subscription
    : null;

  /**
   * Production Router Cache can soft-navigate to the layout index (`/dashboard`)
   * without swapping the page slot when coming from `/dashboard/*`. Force a
   * refresh so Overview always remounts after build (`next start`).
   */
  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    if (pathname === href) {
      e.preventDefault();
      return;
    }

    const leavingNestedForOverview =
      href === "/dashboard" && pathname.startsWith("/dashboard/");

    if (leavingNestedForOverview) {
      e.preventDefault();
      router.push(href);
      router.refresh();
    }
  }

  return (
    <section className="relative min-h-screen pt-28 pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(129,49,240,0.18),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Member dashboard</p>
            <h1 className="mt-1 font-display text-3xl font-bold text-cloud sm:text-4xl">
              Welcome back
              {user.name ? (
                <>
                  , <span className="text-gradient">{user.name.split(" ")[0]}</span>
                </>
              ) : null}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-mist">
              Manage your profile, bookings, digital library, and orders in one
              place.
            </p>
          </div>
          {activePlan?.name ? (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-violet/30 bg-violet/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-violet-bright">
              {activePlan.name} plan
            </span>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
          {/*
            Sticky needs a non-overflow-hidden ancestor (removed from <section>).
            top-32 clears the fixed site navbar; z-10 keeps links above page chrome.
          */}
          <aside className="relative z-10 lg:sticky lg:top-32 lg:self-start lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto">
            <div className="border-gradient overflow-hidden rounded-3xl bg-panel/60 backdrop-blur-md">
              <div className="border-b border-hairline bg-white/2 p-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-hairline-strong">
                    <AvatarImage
                      src={getImageUrl(user.image || "")}
                      alt={user.name || "Profile"}
                    />
                    <AvatarFallback>
                      {initials(user.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-cloud">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-mist">{user.email}</p>
                    {user.role ? (
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-violet-bright">
                        {user.role}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <nav className="flex flex-col gap-1 p-2">
                {DASHBOARD_NAV.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-white/6 text-cloud ring-1 ring-hairline-strong"
                          : "text-mist hover:bg-white/4 hover:text-cloud",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4.5 w-4.5 shrink-0",
                          active ? "text-violet-bright" : "text-faint",
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div key={pathname} className="min-w-0">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
