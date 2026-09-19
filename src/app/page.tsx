"use client";
import Link from "next/link";
import { useLive } from "@/lib/live";
import { useStore } from "@/lib/store";
import { AdGrid } from "@/components/AdCard";
import { BrandCard } from "@/components/BrandCard";
import ScrollExpand from "@/components/ScrollExpand";
import DriftWall from "@/components/DriftWall";

function Empty() {
  return (
    <div className="rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
      <p className="font-medium">There are no ads</p>
      <p className="mt-2 text-sm text-neutral-500">Published advertisements from CREATE will show up here.</p>
    </div>
  );
}

function BrandDrift() {
  const { brands, ads } = useLive();
  const viewsByBrand = ads.reduce<Record<string, number>>((acc, ad) => {
    acc[ad.brandId] = (acc[ad.brandId] || 0) + (ad.views || 0);
    return acc;
  }, {});
  const items = [...brands]
    .filter((b) => b.logo && b.logo.trim() && !b.logo.includes("picsum"))
    .sort((a, b) => (viewsByBrand[b.id] || b.followers || 0) - (viewsByBrand[a.id] || a.followers || 0))
    .slice(0, 12)
    .map((b) => ({ image: b.logo, title: b.name, href: `/brands/${b.slug}` }));
  if (!items.length) return null;
  return (
    <div className="relative left-1/2 h-[420px] w-screen -translate-x-1/2 overflow-hidden bg-neutral-950">
      <DriftWall items={items} columns={Math.min(5, items.length)} tileWidth={160} tileHeight={110} overlayColor="#0b0b10" />
    </div>
  );
}

export default function HomePage() {
  const { user } = useStore();
  const { ads, brands, loaded } = useLive();
  const trending = [...ads].sort((a, b) => b.views - a.views).slice(0, 6).map((a) => a.id);
  const latest = [...ads].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 6).map((a) => a.id);
  const popularBrands = [...brands].sort((a, b) => b.followers - a.followers).slice(0, 4);
  const recommended = ads.filter((a) => (user?.interests?.length ? user.interests.includes(a.category) : true)).slice(0, 6).map((a) => a.id);
  const hero = ads.find((a) => a.media);
  return (
    <div className="space-y-12">
      <div className="relative left-1/2 w-screen -translate-x-1/2 -mt-8">
        <ScrollExpand
          useWindowScroll
          title="Ever experienced TIME SQUARE on your screen?"
          scrollHint="Scroll"
          startWidth={42}
          startHeight={58}
          mediaZoom={1.2}
          overlayScrim={0.55}
          src={hero?.media || ""}
          alt={hero?.title || ""}
          media={!hero ? <div className="h-full w-full bg-neutral-900" /> : undefined}
        >
          <h2>Presenting you<br />CantStopWatchingAds</h2>
          <p>Watch the world advertise</p>
        </ScrollExpand>
      </div>
      <BrandDrift />
      {!loaded ? <p className="text-sm text-neutral-500">Loading…</p> : ads.length === 0 ? <Empty /> : (
        <>
          <section><div className="mb-4 flex justify-between"><h2 className="text-xl font-semibold">Trending Ads</h2><Link href="/explore?sort=trending" className="text-sm text-neutral-500">See all</Link></div><AdGrid ids={trending} /></section>
          <section><div className="mb-4 flex justify-between"><h2 className="text-xl font-semibold">Latest Ads</h2><Link href="/explore?sort=latest" className="text-sm text-neutral-500">See all</Link></div><AdGrid ids={latest} /></section>
          {popularBrands.length > 0 && <section><div className="mb-4 flex justify-between"><h2 className="text-xl font-semibold">Popular Brands</h2><Link href="/brands" className="text-sm text-neutral-500">See all</Link></div><div className="grid gap-3 sm:grid-cols-2">{popularBrands.map((b) => <BrandCard key={b.id} id={b.id} />)}</div></section>}
          <section><div className="mb-4 flex justify-between"><h2 className="text-xl font-semibold">Recommended For You</h2></div><AdGrid ids={recommended} /></section>
        </>
      )}
    </div>
  );
}
