"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { adsByBrand, brands, formatCount, formatDate, getAd } from "@/lib/data";
import { useStore } from "@/lib/store";
import { AdGrid } from "@/components/AdCard";
export default function AdPage() {
  const { id } = useParams<{ id: string }>();
  const ad = getAd(id);
  const { isLiked, isSaved, isFollowed, toggleLike, toggleSave, toggleFollow } = useStore();
  if (!ad) return <p>Advertisement not found.</p>;
  const brand = brands.find((b) => b.id === ad.brandId);
  const more = adsByBrand(ad.brandId).filter((a) => a.id !== ad.id).map((a) => a.id);
  async function share() {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: ad.title, url });
    else { await navigator.clipboard.writeText(url); alert("Link copied."); }
  }
  return (
    <div className="space-y-10">
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ad.media} alt={ad.title} className="max-h-[520px] w-full object-cover" />
        <div className="p-6">
          <p className="text-xs uppercase tracking-wide text-neutral-500">{ad.category} · {formatDate(ad.createdAt)}</p>
          <h1 className="mt-2 text-3xl font-semibold">{ad.title}</h1>
          {brand && <Link href={`/brands/${brand.slug}`} className="mt-2 inline-block text-sm">{brand.name}</Link>}
          <p className="mt-4 max-w-2xl text-neutral-600">{ad.description}</p>
          <p className="mt-3 text-xs text-neutral-400">{formatCount(ad.likes)} likes · {formatCount(ad.views)} views</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={() => toggleLike(ad.id)} className={`rounded-full px-4 py-2 text-sm ${isLiked(ad.id) ? "bg-neutral-900 text-white" : "border border-neutral-200"}`}>{isLiked(ad.id) ? "Liked" : "Like"}</button>
            <button type="button" onClick={() => toggleSave(ad.id)} className={`rounded-full px-4 py-2 text-sm ${isSaved(ad.id) ? "bg-neutral-900 text-white" : "border border-neutral-200"}`}>{isSaved(ad.id) ? "Saved" : "Save"}</button>
            <button type="button" onClick={share} className="rounded-full border border-neutral-200 px-4 py-2 text-sm">Share</button>
            {brand && (
              <>
                <button type="button" onClick={() => toggleFollow(brand.id)} className={`rounded-full px-4 py-2 text-sm ${isFollowed(brand.id) ? "border border-neutral-200" : "bg-neutral-900 text-white"}`}>{isFollowed(brand.id) ? "Following" : "Follow brand"}</button>
                <a href={brand.website} target="_blank" rel="noreferrer" className="rounded-full border border-neutral-200 px-4 py-2 text-sm">Visit brand website</a>
              </>
            )}
          </div>
        </div>
      </div>
      {more.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">More from {brand?.name}</h2>
          <AdGrid ids={more} />
        </section>
      )}
    </div>
  );
}
