export interface NavItem {
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Vendors", href: "/vendors" },
  {
    label: "Store",
    href: "/store",
    subItems: [
      { label: "Digital Products", href: "/store" },
      { label: "Office Supplies", href: "/office-supplies" },
    ]
  },
  { label: "Community Forum", href: "/forum" },
  { label: "Membership", href: "/membership" },
  // { label: "IFundAyiti", href: "/ifundayiti" },
];
