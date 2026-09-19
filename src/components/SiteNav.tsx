"use client";
import CardNav from "./CardNav";
import { useStore } from "@/lib/store";

export function SiteNav() {
  const { user } = useStore();
  const items = [
    {
      label: "Watch",
      bgColor: "#16131c",
      textColor: "#fff",
      links: [
        { label: "Home", href: "/", ariaLabel: "Home" },
        { label: "Explore", href: "/explore", ariaLabel: "Explore ads" },
        { label: "Saved", href: "/saved", ariaLabel: "Saved ads" },
      ],
    },
    {
      label: "Brands",
      bgColor: "#211c28",
      textColor: "#fff",
      links: [
        { label: "All brands", href: "/brands", ariaLabel: "Brands" },
        { label: "Alerts", href: "/notifications", ariaLabel: "Notifications" },
      ],
    },
    {
      label: "You",
      bgColor: "#2a2230",
      textColor: "#fff",
      links: [
        { label: user ? "Profile" : "Log in", href: user ? "/profile" : "/login", ariaLabel: "Account" },
        { label: "Sign up", href: "/signup", ariaLabel: "Sign up" },
      ],
    },
  ];
  return (
    <CardNav
      logoText="CSWA"
      items={items}
      baseColor="#f6f3ec"
      menuColor="#111"
      buttonBgColor="#111"
      buttonTextColor="#fff"
      ctaHref={user ? "/profile" : "/signup"}
      ctaLabel={user ? "Studio" : "Get in"}
    />
  );
}
