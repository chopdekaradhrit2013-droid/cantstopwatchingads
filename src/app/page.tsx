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
    <div className="rounded-3xl border border-white/15 bg-black/50 px-6 py-16 text-center text-white backdrop-blur">
      <p className="font-medium">There are no ads</p>
      <p className="mt-2 text-sm text-white/60">Published advertisements from CREATE will show up here.</p>
    </div>
  );
}

function HomeWall() {
  const { brands, ads } = useLive();
  const viewsByBrand = ads.reduce<Record<string, number>>((acc, ad) => {
    acc[ad.brandId] = (acc[ad.brandId] || 0) + (ad.views || 0);
    return acc;
  }, {});
  const logos = [...brands]
    .filter((b) => b.logo && b.logo.trim() && !b.logo.includes("picsum"))
    .sort((a, b) => (viewsByBrand[b.id] || b.followers || 0) - (viewsByBrand[a.id] || a.followers || 0))
    .map((b) => ({ image: b.logo, title: b.name, href: `/brands/${b.slug}` }));
  const extras = ads.filter((a) => a.media).map((a) => ({ image: a.media, title: a.title, href: `/ads/${a.id}` }));
  const items = (logos.length ? logos : extras).slice(0, 16);
  if (!items.length) return <div className="absolute inset-0 bg-neutral-950" />;
  return (
    <DriftWall
      items={items}
      columns={5}
      tileWidth={180}
      tileHeight={120}
      overlayColor="#050508"
      dim={0.7}
      fade={0.35}
      speed={28}
    />
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
    <div className="relative left-1/2 w-screen -translate-x-1/2 -mt-8 min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-neutral-950">
        <HomeWall />
      </div>
      <div className="mx-auto max-w-6xl space-y-12 px-4 pb-16 pt-2">
        <ScrollExpand
          useWindowScroll
          title="Ever experienced TIME SQUARE on your screen?"
          scrollHint="Scroll"
          startWidth={42}
          startHeight={58}
          mediaZoom={1.2}
          overlayScrim={0.35}
          src={hero?.media || ""}
          alt={hero?.title || ""}
          media={!hero ? <div className="h-full w-full bg-black/20" /> : undefined}
        >
          <h2>Presenting you<br />CantStopWatchingAds</h2>
          <p>Watch the world advertise</p>
        </ScrollExpand>
        {!loaded ? <p className="text-sm text-white/70">Loading…</p> : ads.length === 0 ? <Empty /> : (
          <div className="space-y-12 rounded-3xl bg-white/90 p-6 backdrop-blur">
            <section><div className="mb-4 flex justify-between"><h2 className="text-xl font-semibold">Trending Ads</h2><Link href="/explore?sort=trending" className="text-sm text-neutral-500">See all</Link></div><AdGrid ids={trending} /></section>
            <section><div className="mb-4 flex justify-between"><h2 className="text-xl font-semibold">Latest Ads</h2><Link href="/explore?sort=latest" className="text-sm text-neutral-500">See all</Link></div><AdGrid ids={latest} /></section>
            {popularBrands.length > 0 && <section><div className="mb-4 flex justify-between"><h2 className="text-xl font-semibold">Popular Brands</h2><Link href="/brands" className="text-sm text-neutral-500">See all</Link></div><div className="grid gap-3 sm:grid-cols-2">{popularBrands.map((b) => <BrandCard key={b.id} id={b.id} />)}</div></section>}
            <section><div className="mb-4 flex justify-between"><h2 className="text-xl font-semibold">Recommended For You</h2></div><AdGrid ids={recommended} /></section>
          </div>
        )}
      </div>
    </div>
  );
}
