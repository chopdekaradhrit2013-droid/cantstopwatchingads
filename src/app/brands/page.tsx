"use client";
import { useLive } from "@/lib/live";
import { BrandCard } from "@/components/BrandCard";
export default function BrandsPage() {
  const { brands, loaded } = useLive();
  return (
    <div>
      <h1 className="text-2xl font-semibold">Brands</h1>
      <p className="mt-1 text-sm text-neutral-500">Only live brands. Banned accounts stay hidden.</p>
      {!loaded ? <p className="mt-8 text-sm text-neutral-500">Loading…</p> : brands.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-dashed p-10 text-center text-sm text-neutral-500">No brands yet.</p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">{brands.map((b) => <BrandCard key={b.id} id={b.id} />)}</div>
      )}
    </div>
  );
}
