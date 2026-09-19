"use client";
import DriftWall from "./DriftWall";
import { useLive } from "@/lib/live";

function isUploadedLogo(logo?: string) {
  if (!logo) return false;
  const v = logo.trim();
  if (!v) return false;
  if (v.includes("unsplash.com") || v.includes("picsum.photos") || v.includes("northline")) return false;
  return v.startsWith("http") || v.startsWith("data:");
}

export function BrandDriftWall({ fill = false }: { fill?: boolean }) {
  const { brands, ads, loaded } = useLive();
  const viewsByBrand = new Map<string, number>();
  for (const ad of ads) viewsByBrand.set(ad.brandId, (viewsByBrand.get(ad.brandId) ?? 0) + ad.views);
  const items = loaded
    ? [...brands]
        .filter((b) => isUploadedLogo(b.logo))
        .sort((a, b) => (viewsByBrand.get(b.id) ?? 0) - (viewsByBrand.get(a.id) ?? 0) || b.followers - a.followers)
        .slice(0, 12)
        .map((b) => ({ image: b.logo, title: b.name, href: `/brands/${b.slug}` }))
    : [];
  return (
    <div className={fill ? "h-full w-full bg-black" : "h-[420px] overflow-hidden rounded-3xl bg-black"}>
      {items.length > 0 && (
        <DriftWall
          items={items}
          columns={Math.min(5, Math.max(3, items.length))}
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
      )}
    </div>
  );
}
