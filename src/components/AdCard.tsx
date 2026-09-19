"use client";
import Link from "next/link";
import { formatCount } from "@/lib/data";
import { useLive } from "@/lib/live";
import { useStore } from "@/lib/store";
export function AdCard({ id }: { id: string }) {
  const { ads, brands } = useLive();
  const ad = ads.find((a) => a.id === id);
  const { isLiked, isSaved, toggleLike, toggleSave } = useStore();
  if (!ad) return null;
  const brand = brands.find((b) => b.id === ad.brandId);
  return (
    <article className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:shadow-md">
      <Link href={`/ads/${ad.id}`} className="block overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ad.thumbnail} alt={ad.title} className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
      </Link>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/brands/${brand?.slug ?? ad.brandId}`} className="text-xs text-neutral-500">{brand?.name}</Link>
            <Link href={`/ads/${ad.id}`} className="mt-0.5 block truncate font-medium">{ad.title}</Link>
            <p className="mt-1 text-xs text-neutral-500">{ad.category}</p>
          </div>
          <div className="flex shrink-0 gap-1">
            <button type="button" onClick={() => toggleLike(ad.id)} className={`rounded-full border px-2.5 py-1 text-xs ${isLiked(ad.id) ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200"}`}>{isLiked(ad.id) ? "Liked" : "Like"}</button>
            <button type="button" onClick={() => toggleSave(ad.id)} className={`rounded-full border px-2.5 py-1 text-xs ${isSaved(ad.id) ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200"}`}>{isSaved(ad.id) ? "Saved" : "Save"}</button>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-neutral-400">{formatCount(ad.likes)} likes · {formatCount(ad.views)} views</p>
      </div>
    </article>
  );
}
export function AdGrid({ ids }: { ids: string[] }) {
  if (!ids.length) return <p className="py-12 text-center text-sm text-neutral-500">No advertisements found.</p>;
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{ids.map((id) => <AdCard key={id} id={id} />)}</div>;
}
