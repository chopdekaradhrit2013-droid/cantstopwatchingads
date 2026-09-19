"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { AdGrid } from "@/components/AdCard";

export default function SavedPage() {
  const { saved } = useStore();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Saved</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Advertisements you want to watch again.
      </p>
      {saved.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
          <p className="font-medium">Nothing saved yet</p>
          <p className="mt-2 text-sm text-neutral-500">
            Tap Save on any advertisement to keep it here.
          </p>
          <Link
            href="/explore"
            className="mt-6 inline-block rounded-full bg-neutral-900 px-4 py-2 text-sm text-white"
          >
            Explore ads
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          <AdGrid ids={saved} />
        </div>
      )}
    </div>
  );
}
