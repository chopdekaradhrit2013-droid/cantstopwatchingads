"use client";

import { brands } from "@/lib/data";
import { BrandCard } from "@/components/BrandCard";

export default function BrandsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Brands</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Follow brands to hear when they publish new ads.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {brands.map((b) => (
          <BrandCard key={b.id} id={b.id} />
        ))}
      </div>
    </div>
  );
}
