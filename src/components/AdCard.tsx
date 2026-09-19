"use client";
import Link from "next/link";
import { formatCount } from "@/lib/data";
import { useLive } from "@/lib/live";
import { useStore } from "@/lib/store";
import { useAuthGate } from "./AuthGate";
import TiltedCard from "./TiltedCard";

export function AdCard({ id }: { id: string }) {
  const { ads, brands } = useLive();
  const ad = ads.find((a) => a.id === id);
  const { isLiked, isSaved, toggleLike, toggleSave } = useStore();
  const guard = useAuthGate();
  if (!ad) return null;
  const brand = brands.find((b) => b.id === ad.brandId);
  const brandName = ad.brandName || brand?.name || "Brand";
  return (
    <article className="space-y-2">
      <Link href={`/ads/${ad.id}`} className="block">
        <TiltedCard imageSrc={ad.thumbnail || ad.media} altText={ad.title} captionText={ad.title} overlayContent={<span>{ad.title}</span>} />
      </Link>
      <div className="flex items-start justify-between gap-2 px-1">
        <div className="min-w-0">
          <Link href={`/brands/${brand?.slug ?? ad.brandId}`} className="text-xs text-white/50">{brandName}</Link>
          <p className="truncate text-sm">{ad.category} · {formatCount(ad.views)} views</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button type="button" onClick={() => guard("like this ad") && toggleLike(ad.id)} className="rounded-full border border-white/15 px-2.5 py-1 text-xs">{isLiked(ad.id) ? "Liked" : "Like"}</button>
          <button type="button" onClick={() => guard("save this ad") && toggleSave(ad.id)} className="rounded-full border border-white/15 px-2.5 py-1 text-xs">{isSaved(ad.id) ? "Saved" : "Save"}</button>
        </div>
      </div>
    </article>
  );
}
export function AdGrid({ ids }: { ids: string[] }) {
  if (!ids.length) return <p className="py-12 text-center text-sm text-white/50">There are no ads</p>;
  return <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{ids.map((id) => <AdCard key={id} id={id} />)}</div>;
}
