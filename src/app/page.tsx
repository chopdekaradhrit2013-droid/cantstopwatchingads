"use client";
import Link from "next/link";
import { useLive } from "@/lib/live";
import { useStore } from "@/lib/store";
import { AdGrid } from "@/components/AdCard";
import { BrandCard } from "@/components/BrandCard";
import { BrandDriftWall } from "@/components/BrandDriftWall";
import ScrollExpand from "@/components/ScrollExpand";
import { FluidGlassSection } from "@/components/FluidGlassSection";

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
      <div className="relative left-1/2 w-screen -translate-x-1/2 -mt-28">
        <ScrollExpand
          useWindowScroll
          title="Ever experienced TIME SQUARE on your screen?"
          scrollHint="Scroll"
          startWidth={42}
          startHeight={58}
          mediaZoom={1.2}
          overlayScrim={0.55}
          media={<BrandDriftWall fill />}
        >
          <h2>Presenting you<br />CantStopWatchingAds</h2>
          <p>Watch the world advertise</p>
        </ScrollExpand>
      </div>
      <FluidGlassSection />
      {!loaded ? <p className="text-sm text-neutral-500">Loading…</p> : ads.length === 0 ? <Empty /> : (
        <>
          <section>
            <div className="mb-4 flex items-end justify-between"><h2 className="text-xl font-semibold">Trending Ads</h2><Link href="/explore?sort=trending" className="text-sm text-neutral-500">See all</Link></div>
            <AdGrid ids={trending} />
          </section>
          <section>
            <div className="mb-4 flex items-end justify-between"><h2 className="text-xl font-semibold">Latest Ads</h2><Link href="/explore?sort=latest" className="text-sm text-neutral-500">See all</Link></div>
            <AdGrid ids={latest} />
          </section>
          {popularBrands.length > 0 && (
            <section>
              <div className="mb-4 flex items-end justify-between"><h2 className="text-xl font-semibold">Popular Brands</h2><Link href="/brands" className="text-sm text-neutral-500">See all</Link></div>
              <div className="grid gap-3 sm:grid-cols-2">{popularBrands.map((b) => <BrandCard key={b.id} id={b.id} />)}</div>
            </section>
          )}
          <section>
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-xl font-semibold">Recommended For You</h2>
              {user?.interests?.length ? <p className="text-sm text-neutral-500">Based on {user.interests.slice(0, 3).join(", ")}</p> : <Link href="/signup" className="text-sm text-neutral-500">Select interests</Link>}
            </div>
            <AdGrid ids={recommended} />
          </section>
        </>
      )}
    </div>
  );
}
