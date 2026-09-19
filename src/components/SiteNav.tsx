"use client";
import BubbleMenu from "./BubbleMenu";
import { useStore } from "@/lib/store";

export function SiteNav() {
  const { user } = useStore();
  const items = [
    { label: "home", href: "/", ariaLabel: "Home", rotation: -8, hoverStyles: { bgColor: "#111111", textColor: "#ffffff" } },
    { label: "explore", href: "/explore", ariaLabel: "Explore", rotation: 8, hoverStyles: { bgColor: "#3b82f6", textColor: "#ffffff" } },
    { label: "brands", href: "/brands", ariaLabel: "Brands", rotation: 8, hoverStyles: { bgColor: "#10b981", textColor: "#ffffff" } },
    { label: "saved", href: "/saved", ariaLabel: "Saved", rotation: -8, hoverStyles: { bgColor: "#f59e0b", textColor: "#ffffff" } },
    { label: "alerts", href: "/notifications", ariaLabel: "Notifications", rotation: 8, hoverStyles: { bgColor: "#ef4444", textColor: "#ffffff" } },
    { label: user ? "profile" : "log in", href: user ? "/profile" : "/login", ariaLabel: user ? "Profile" : "Log in", rotation: -8, hoverStyles: { bgColor: "#8b5cf6", textColor: "#ffffff" } },
  ];
  return (
    <BubbleMenu
      logo={<span>CAN’T STOP WATCHING ADS</span>}
      items={items}
      menuAriaLabel="Toggle navigation"
      menuBg="#ffffff"
      menuContentColor="#111111"
      useFixedPosition
      animationEase="back.out(1.5)"
      animationDuration={0.5}
      staggerDelay={0.12}
    />
  );
}
