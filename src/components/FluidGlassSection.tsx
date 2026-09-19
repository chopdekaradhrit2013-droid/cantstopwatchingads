"use client";
import dynamic from "next/dynamic";
import { useLive } from "@/lib/live";

const AdFluidGlass = dynamic(() => import("./AdFluidGlass"), { ssr: false });

export function FluidGlassSection() {
  const { ads, loaded } = useLive();
  if (!loaded) return null;
  const items = ads
    .filter((a) => a.media && (a.media.startsWith("http") || a.media.startsWith("data:image")))
    .slice(0, 5)
    .map((a) => ({ id: a.id, image: a.media, title: a.title, href: `/ads/${a.id}` }));
  if (!items.length) return null;
  return <AdFluidGlass items={items} />;
}
