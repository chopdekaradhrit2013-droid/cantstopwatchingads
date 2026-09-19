"use client";
import AccordionGallery from "./AccordionGallery";
import { useLive } from "@/lib/live";

export function FluidGlassSection() {
  const { ads, loaded } = useLive();
  if (!loaded) return null;
  const items = ads.filter((a) => a.media).slice(0, 5).map((a) => ({
    image: a.media,
    label: a.title,
    link: `/ads/${a.id}`,
  }));
  if (!items.length) return null;
  return (
    <section className="space-y-3">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">Featured advertisements</p>
      <AccordionGallery items={items} defaultIndex={0} height={440} trigger="hover" />
    </section>
  );
}
