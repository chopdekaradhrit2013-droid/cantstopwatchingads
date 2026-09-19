"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./AccordionGallery.css";

type Item = { image: string; label?: string; link?: string; alt?: string };

export default function AccordionGallery({
  items,
  defaultIndex = 0,
  height = 420,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  duration = 0.6,
  trigger = "hover",
}: {
  items: Item[];
  defaultIndex?: number;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  duration?: number;
  trigger?: "hover" | "click";
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLElement | null)[]>([]);
  const barRefs = useRef<(HTMLElement | null)[]>([]);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), Math.max(0, count - 1)));

  const apply = useCallback(() => {
    const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
    const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      const isActive = i === active;
      gsap.to(panel, { flexGrow: isActive ? grow : 1, duration, ease: "power3.out" });
      const media = mediaRefs.current[i];
      if (media) gsap.to(media, { "--ag-gray": isActive ? 0 : 1, "--ag-dim": isActive ? 0 : 0.35, duration });
      const bar = barRefs.current[i];
      const text = textRefs.current[i];
      if (bar && text) gsap.to([bar, text], { opacity: isActive ? 1 : 0, x: isActive ? 0 : -10, duration: duration * 0.7 });
    });
  }, [active, count, duration, expandRatio]);

  useEffect(() => { apply(); }, [apply]);

  if (!count) return null;
  return (
    <div ref={rootRef} className="accordion-gallery" style={{ height, gap }} role="list">
      {items.map((item, i) => {
        const Tag: "a" | "div" = item.link ? "a" : "div";
        return (
          <Tag
            key={i}
            ref={(el: HTMLElement | null) => { panelRefs.current[i] = el; }}
            className={`ag-panel${i === active ? " ag-panel--active" : ""}`}
            href={item.link}
            onMouseEnter={() => trigger === "hover" && setActive(i)}
            onClick={(e: React.MouseEvent) => { if (i !== active) { e.preventDefault(); setActive(i); } }}
            style={{ borderRadius: radius }}
          >
            <span className="ag-panel__frame">
              <span className="ag-panel__media" ref={(el) => { mediaRefs.current[i] = el; }}>
                <img src={item.image} alt={item.label || ""} />
              </span>
              <span className="ag-panel__overlay" />
            </span>
            <span className="ag-panel__label">
              <span className="ag-panel__bar" ref={(el) => { barRefs.current[i] = el; }} />
              <span className="ag-panel__text" ref={(el) => { textRefs.current[i] = el; }}>{item.label}</span>
            </span>
          </Tag>
        );
      })}
    </div>
  );
}
