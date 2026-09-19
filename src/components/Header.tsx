"use client";
import BubbleMenu from "./BubbleMenu";
import { useStore } from "@/lib/store";

export function Header() {
  const { user, isAdmin } = useStore();
  const items = [
    { label: "Home", href: "/", rotation: -8, hoverStyles: { bgColor: "#111", textColor: "#fff" } },
    { label: "Explore", href: "/explore", rotation: 8, hoverStyles: { bgColor: "#111", textColor: "#fff" } },
    { label: "Brands", href: "/brands", rotation: -8, hoverStyles: { bgColor: "#111", textColor: "#fff" } },
    { label: "Saved", href: "/saved", rotation: 8, hoverStyles: { bgColor: "#111", textColor: "#fff" } },
    { label: "Alerts", href: "/notifications", rotation: -8, hoverStyles: { bgColor: "#111", textColor: "#fff" } },
    { label: user ? "Profile" : "Log in", href: user ? "/profile" : "/login", rotation: 8, hoverStyles: { bgColor: "#111", textColor: "#fff" } },
  ];
  if (user) items.push({ label: "Log out", href: "/logout", rotation: 8, hoverStyles: { bgColor: "#111", textColor: "#fff" } });
  if (isAdmin) items.push({ label: "Admin", href: "/admin", rotation: -8, hoverStyles: { bgColor: "#111", textColor: "#fff" } });
  return (
    <>
      <div className="h-20" />
      <BubbleMenu
        logo={<span style={{ fontWeight: 700, fontSize: 13, letterSpacing: "0.06em" }}>CSWA</span>}
        items={items}
        menuBg="#f6f3ec"
        menuContentColor="#111"
        useFixedPosition
      />
    </>
  );
}
