"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLive } from "@/lib/live";

export function FluidGlassSection() {
  const { ads, loaded } = useLive();
  const stageRef = useRef<HTMLDivElement>(null);
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
    const stage = stageRef.current;
    const lens = lensRef.current;
    if (!stage || !lens) return;
    const move = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      lens.style.left = `${e.clientX - r.left}px`;
      lens.style.top = `${e.clientY - r.top}px`;
    };
    stage.addEventListener("pointermove", move);
    return () => stage.removeEventListener("pointermove", move);
  }, []);

  if (!items.length) return null;

  return (
    <section ref={stageRef} className="relative left-1/2 h-[200vh] w-screen -translate-x-1/2 bg-[#0b0b10]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          ref={listRef}
          className="absolute inset-x-0 top-0 columns-2 gap-4 px-6 pt-[18vh] sm:columns-3"
          style={{ transform: "translate3d(0, 55vh, 0)", transition: "transform 0.05s linear" }}
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
          className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.12)] backdrop-blur-xl"
        />
      </div>
    </section>
  );
}
