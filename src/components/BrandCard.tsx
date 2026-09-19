"use client";

import Link from "next/link";
import { brands, formatCount } from "@/lib/data";
import { useStore } from "@/lib/store";

export function BrandCard({ id }: { id: string }) {
  const brand = brands.find((b) => b.id === id);
  const { isFollowed, toggleFollow } = useStore();
  if (!brand) return null;

  return (
    <article className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={brand.logo} alt="" className="h-12 w-12 rounded-full object-cover" />
      <div className="min-w-0 flex-1">
        <Link href={`/brands/${brand.slug}`} className="font-medium">
          {brand.name}
        </Link>
        <p className="truncate text-xs text-neutral-500">
          {formatCount(brand.followers)} followers
        </p>
      </div>
      <button
        type="button"
        onClick={() => toggleFollow(brand.id)}
        className={`rounded-full px-3 py-1.5 text-xs ${
          isFollowed(brand.id) ? "border border-neutral-200" : "bg-neutral-900 text-white"
        }`}
      >
        {isFollowed(brand.id) ? "Following" : "Follow"}
      </button>
    </article>
  );
}
