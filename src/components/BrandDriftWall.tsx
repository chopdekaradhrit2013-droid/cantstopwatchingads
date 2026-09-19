"use client";
import DriftWall from "./DriftWall";
import { useLive } from "@/lib/live";

function isUploadedLogo(logo?: string) {
  if (!logo) return false;
  const v = logo.trim();
  if (!v) return false;
  if (v.includes("unsplash.com")) return false;
  if (v.includes("picsum.photos")) return false;
  if (v.includes("northline")) return false;
  return v.startsWith("http") || v.startsWith("data:");
}

export function BrandDriftWall() {
  const { brands, ads, loaded } = useLive();
  if (!loaded) return null;
  const viewsByBrand = new Map<string, number>();
  for (const ad of ads) viewsByBrand.set(ad.brandId, (viewsByBrand.get(ad.brandId) ?? 0) + ad.views);
  const items = [...brands]
    .filter((b) => isUploadedLogo(b.logo))
    .sort((a, b) => (viewsByBrand.get(b.id) ?? 0) - (viewsByBrand.get(a.id) ?? 0) || b.followers - a.followers)
    .slice(0, 12)
    .map((b) => ({ image: b.logo, title: b.name, href: `/brands/${b.slug}` }));
  if (items.length === 0) return null;
  return (
    <div className="h-[420px] overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-950">
      <DriftWall
        items={items}
        columns={Math.min(5, items.length)}
        tileWidth={200}
        tileHeight={132}
        gap={18}
        tilt={16}
        turn={-14}
        perspective={1200}
        depth={120}
        speed={42}
        direction="up"
        variance={0.45}
        parallax={0.6}
        lift={64}
        fade={0.6}
        dim={0.55}
        overlayColor="#060010"
      />
    </div>
  );
}
