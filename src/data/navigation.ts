export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Store", href: "/store" },
  { label: "Community Forum", href: "/forum" },
  { label: "Membership", href: "/membership" },
];
