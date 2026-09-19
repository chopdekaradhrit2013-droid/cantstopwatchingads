"use client";
import { useParams } from "next/navigation";
import { formatCount } from "@/lib/data";
import { useLive } from "@/lib/live";
import { useStore } from "@/lib/store";
import { AdGrid } from "@/components/AdCard";
import { useAuthGate } from "@/components/AuthGate";
export default function BrandProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { ads, brands, loaded } = useLive();
  const brand = brands.find((b) => b.slug === slug || b.id === slug);
  const { isFollowed, toggleFollow } = useStore();
  const guard = useAuthGate();
  if (!loaded) return <p>Loading…</p>;
  if (!brand) return <p>Brand not found.</p>;
  const brandAds = ads.filter((a) => a.brandId === brand.id);
  const latest = [...brandAds].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).map((a) => a.id);
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 sm:flex-row sm:items-center">
        {brand.logo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={brand.logo} alt="" className="h-20 w-20 rounded-full object-cover" />
        ) : <div className="h-20 w-20 rounded-full bg-neutral-100" />}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{brand.name}{brand.verified ? " ✓" : ""}</h1>
          <p className="mt-1 max-w-xl text-sm text-neutral-600">{brand.description}</p>
          <p className="mt-2 text-xs text-neutral-500">{formatCount(brand.followers + (isFollowed(brand.id) ? 1 : 0))} followers · {brandAds.length} ads</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => guard("follow this brand") && toggleFollow(brand.id)} className={`rounded-full px-4 py-2 text-sm ${isFollowed(brand.id) ? "border border-neutral-200" : "bg-neutral-900 text-white"}`}>{isFollowed(brand.id) ? "Following" : "Follow"}</button>
          {brand.website && <a href={brand.website} target="_blank" rel="noreferrer" className="rounded-full border border-neutral-200 px-4 py-2 text-sm">Website</a>}
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Advertisement gallery</h2>
        <AdGrid ids={latest} />
      </section>
    </div>
  );
}
