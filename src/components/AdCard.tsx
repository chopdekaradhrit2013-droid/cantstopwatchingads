"use client";
import Link from "next/link";
import { formatCount } from "@/lib/data";
import { useLive } from "@/lib/live";
import { useStore } from "@/lib/store";
import { useAuthGate } from "./AuthGate";
export function AdCard({ id }: { id: string }) {
  const { ads, brands } = useLive();
  const ad = ads.find((a) => a.id === id);
  const { isLiked, isSaved, toggleLike, toggleSave } = useStore();
  const guard = useAuthGate();
  if (!ad) return null;
  const brand = brands.find((b) => b.id === ad.brandId);
  const brandName = ad.brandName || brand?.name || "Brand";
  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <Link href={`/ads/${ad.id}`}>
        <img src={ad.thumbnail || ad.media} alt={ad.title} className="aspect-[4/3] w-full object-cover" />
      </Link>
      <div className="p-3">
        <Link href={`/brands/${brand?.slug ?? ad.brandId}`} className="text-xs text-neutral-500">{brandName}</Link>
        <Link href={`/ads/${ad.id}`} className="mt-0.5 block truncate font-medium">{ad.title}</Link>
        <div className="mt-2 flex gap-1">
          <button type="button" onClick={() => guard("like this ad") && toggleLike(ad.id)} className="rounded-full border px-2.5 py-1 text-xs">{isLiked(ad.id) ? "Liked" : "Like"}</button>
          <button type="button" onClick={() => guard("save this ad") && toggleSave(ad.id)} className="rounded-full border px-2.5 py-1 text-xs">{isSaved(ad.id) ? "Saved" : "Save"}</button>
        </div>
        <p className="mt-2 text-[11px] text-neutral-400">{formatCount(ad.likes)} likes · {formatCount(ad.views)} views</p>
      </div>
    </article>
  );
}
export function AdGrid({ ids }: { ids: string[] }) {
  if (!ids.length) return <p className="py-12 text-center text-sm text-neutral-500">There are no ads</p>;
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{ids.map((id) => <AdCard key={id} id={id} />)}</div>;
}
