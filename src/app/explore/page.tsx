"use client";
import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { advertisements } from "@/lib/data";
import { CATEGORIES, type Category } from "@/lib/types";
import { AdGrid } from "@/components/AdCard";
type Sort = "latest" | "trending" | "liked" | "viewed";
function ExploreInner() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") ?? "";
  const category = (params.get("category") ?? "All") as Category | "All";
  const sort = (params.get("sort") ?? "latest") as Sort;
  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "All") next.delete(key);
    else next.set(key, value);
    router.push(`/explore?${next.toString()}`);
  }
  const ids = useMemo(() => {
    let list = [...advertisements];
    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(needle) || a.description.toLowerCase().includes(needle) || a.category.toLowerCase().includes(needle) || a.brandId.toLowerCase().includes(needle));
    }
    if (category !== "All") list = list.filter((a) => a.category === category);
    if (sort === "latest") list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (sort === "trending" || sort === "viewed") list.sort((a, b) => b.views - a.views);
    if (sort === "liked") list.sort((a, b) => b.likes - a.likes);
    return list.map((a) => a.id);
  }, [q, category, sort]);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Explore</h1>
      <p className="mt-1 text-sm text-neutral-500">Discover advertisements across categories.</p>
      <div className="mt-6 flex flex-col gap-3">
        <input defaultValue={q} onKeyDown={(e) => { if (e.key === "Enter") setParam("q", (e.target as HTMLInputElement).value); }} placeholder="Search titles, brands, categories" className="w-full rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none" />
        <div className="flex flex-wrap gap-2">
          {(["All", ...CATEGORIES] as const).map((c) => (
            <button key={c} type="button" onClick={() => setParam("category", c)} className={`rounded-full px-3 py-1.5 text-xs ${category === c ? "bg-neutral-900 text-white" : "border border-neutral-200 bg-white"}`}>{c}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {([["latest", "Latest"], ["trending", "Trending"], ["liked", "Most liked"], ["viewed", "Most viewed"]] as const).map(([key, label]) => (
            <button key={key} type="button" onClick={() => setParam("sort", key)} className={`rounded-full px-3 py-1.5 text-xs ${sort === key ? "bg-neutral-900 text-white" : "border border-neutral-200 bg-white"}`}>{label}</button>
          ))}
        </div>
      </div>
      <div className="mt-8"><AdGrid ids={ids} /></div>
    </div>
  );
}
export default function ExplorePage() {
  return <Suspense fallback={<p className="text-sm text-neutral-500">Loading…</p>}><ExploreInner /></Suspense>;
}
