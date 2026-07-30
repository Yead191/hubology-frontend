import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  BookOpen,
  Package,
  Crown,
  Lock,
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export const DASHBOARD_NAV: DashboardNavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Your Hubology account at a glance",
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
    description: "Personal details & password",
  },
  {
    label: "Bookings",
    href: "/dashboard/bookings",
    icon: CalendarCheck,
    description: "Purchased service sessions",
  },
  {
    label: "Digital library",
    href: "/dashboard/digital",
    icon: BookOpen,
    description: "Books and downloads you own",
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: Package,
    description: "Office supply order history",
  },
  {
    label: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: Crown,
    description: "Membership plans",
  },
];

export const DASHBOARD_SECURITY_NAV: DashboardNavItem = {
  label: "Password",
  href: "/dashboard/profile#password",
  icon: Lock,
  description: "Update your sign-in password",
};
