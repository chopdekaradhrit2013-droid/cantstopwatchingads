"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLive } from "@/lib/live";

export function FluidGlassSection() {
  const { ads, loaded } = useLive();
  const stageRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items = loaded
    ? ads.filter((a) => a.media).slice(0, 8).map((a) => ({ id: a.id, image: a.media, title: a.title }))
    : [];

  useEffect(() => {
    const stage = stageRef.current;
    const list = listRef.current;
    if (!stage || !list) return;
    const onScroll = () => {
      const rect = stage.getBoundingClientRect();
      const span = Math.max(1, stage.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, -rect.top / span));
      list.style.transform = `translate3d(0, ${(1 - p) * 55}vh, 0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items.length]);

  useEffect(() => {
    const view = viewRef.current;
    const lens = lensRef.current;
    if (!view || !lens) return;
    const move = (e: PointerEvent) => {
      const r = view.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      lens.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };
    view.addEventListener("pointermove", move);
    view.addEventListener("pointerdown", move);
    return () => {
      view.removeEventListener("pointermove", move);
      view.removeEventListener("pointerdown", move);
    };
  }, [items.length]);

  if (!items.length) return null;

  return (
    <section ref={stageRef} className="relative left-1/2 h-[200vh] w-screen -translate-x-1/2 bg-[#0b0b10]">
      <div ref={viewRef} className="sticky top-0 h-screen overflow-hidden">
        <div
          ref={listRef}
          className="absolute inset-x-0 top-0 columns-2 gap-4 px-6 pt-[18vh] sm:columns-3"
          style={{ transform: "translate3d(0, 55vh, 0)" }}
        >
          {items.map((item) => (
            <Link key={item.id} href={`/ads/${item.id}`} className="mb-4 block break-inside-avoid overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} className="w-full object-cover" />
            </Link>
          ))}
        </div>
        <div
          ref={lensRef}
          className="pointer-events-none absolute left-0 top-0 z-20 h-44 w-44 rounded-full border border-white/35 bg-white/15 shadow-[0_8px_40px_rgba(255,255,255,0.16)] backdrop-blur-2xl"
          style={{ transform: "translate3d(50vw, 40vh, 0) translate(-50%, -50%)" }}
        />
      </div>
    </section>
  );
}
