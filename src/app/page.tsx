"use client";

import Link from "next/link";
import { advertisements, brands } from "@/lib/data";
import { useStore } from "@/lib/store";
import { AdGrid } from "@/components/AdCard";
import { BrandCard } from "@/components/BrandCard";

export default function HomePage() {
  const { user } = useStore();
  const trending = [...advertisements].sort((a, b) => b.views - a.views).slice(0, 6).map((a) => a.id);
  const latest = [...advertisements].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 6).map((a) => a.id);
  const popularBrands = [...brands].sort((a, b) => b.followers - a.followers).slice(0, 4);
  const recommended = advertisements.filter((a) => user?.interests?.length ? user.interests.includes(a.category) : true).slice(0, 6).map((a) => a.id);

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-neutral-200 bg-white px-6 py-12 text-center sm:px-12">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Viewer</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">CAN’T STOP WATCHING ADS</h1>
        <p className="mx-auto mt-4 max-w-xl text-neutral-600">Discover the ads you actually want to watch.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/explore" className="rounded-full bg-neutral-900 px-5 py-2 text-sm text-white">Explore ads</Link>
          {!user && (
            <Link href="/signup" className="rounded-full border border-neutral-300 px-5 py-2 text-sm">Create account</Link>
          )}
        </div>
      </section>
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Trending Ads</h2>
          <Link href="/explore?sort=trending" className="text-sm text-neutral-500">See all</Link>
        </div>
        <AdGrid ids={trending} />
      </section>
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Latest Ads</h2>
          <Link href="/explore?sort=latest" className="text-sm text-neutral-500">See all</Link>
        </div>
        <AdGrid ids={latest} />
      </section>
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Popular Brands</h2>
          <Link href="/brands" className="text-sm text-neutral-500">See all</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {popularBrands.map((b) => (
            <BrandCard key={b.id} id={b.id} />
          ))}
        </div>
      </section>
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Recommended For You</h2>
          {user?.interests?.length ? (
            <p className="text-sm text-neutral-500">Based on {user.interests.slice(0, 3).join(", ")}</p>
          ) : (
            <Link href="/signup" className="text-sm text-neutral-500">Select interests</Link>
          )}
        </div>
        <AdGrid ids={recommended} />
      </section>
    </div>
  );
}
