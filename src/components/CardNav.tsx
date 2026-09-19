"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./CardNav.css";

type LinkItem = { label: string; href?: string; ariaLabel?: string };
type NavItem = { label: string; bgColor: string; textColor: string; links: LinkItem[] };

export default function CardNav({
  logoText = "CSWA",
  items,
  ease = "power3.out",
  baseColor = "#fff",
  menuColor = "#000",
  buttonBgColor = "#111",
  buttonTextColor = "#fff",
  ctaHref = "/signup",
  ctaLabel = "Get in",
}: {
  logoText?: string;
  items: NavItem[];
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const height = () => (window.matchMedia("(max-width:768px)").matches ? 360 : 260);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    gsap.set(nav, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 40, opacity: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.to(nav, { height, duration: 0.4, ease });
    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.35, ease, stagger: 0.08 }, "-=0.12");
    tlRef.current = tl;
    return () => { tl.kill(); };
  }, [ease, items]);

  function toggle() {
    const tl = tlRef.current;
    if (!tl) return;
    if (!open) { setOpen(true); tl.play(0); }
    else { tl.eventCallback("onReverseComplete", () => setOpen(false)); tl.reverse(); }
  }

  return (
    <div className="card-nav-container">
      <nav ref={navRef} className={`card-nav ${open ? "open" : ""}`} style={{ backgroundColor: baseColor }}>
        <div className="card-nav-top">
          <div className={`hamburger-menu ${open ? "open" : ""}`} onClick={toggle} role="button" tabIndex={0} style={{ color: menuColor }}>
            <div className="hamburger-line" /><div className="hamburger-line" />
          </div>
          <a href="/" className="logo-container">{logoText}</a>
          <a href={ctaHref} className="card-nav-cta-button" style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}>{ctaLabel}</a>
        </div>
        <div className="card-nav-content">
          {items.slice(0, 3).map((item, idx) => (
            <div key={item.label} className="nav-card" ref={(el) => { if (el) cardsRef.current[idx] = el; }} style={{ backgroundColor: item.bgColor, color: item.textColor }}>
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links.map((l) => (
                  <a key={l.label} className="nav-card-link" href={l.href || "#"}>{l.label} ↗</a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
