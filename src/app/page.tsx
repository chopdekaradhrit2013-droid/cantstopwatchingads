"use client";
import Link from "next/link";
import { useLive } from "@/lib/live";
import { useStore } from "@/lib/store";
import { AdGrid } from "@/components/AdCard";
import { BrandCard } from "@/components/BrandCard";
function Empty() {
  return (
    <div className="rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
      <p className="font-medium">There are no ads</p>
      <p className="mt-2 text-sm text-neutral-500">Published advertisements from CREATE will show up here.</p>
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
  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-neutral-900 px-6 py-12 text-white">
        <p className="text-xs uppercase tracking-widest text-white/50">Viewer</p>
        <h1 className="mt-2 text-3xl font-semibold">Can't Stop Watching Ads</h1>
        <p className="mt-2 max-w-xl text-sm text-white/70">Watch the world advertise. Only real published ads.</p>
      </section>
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
