"use client";
import Link from "next/link";
import { CATEGORIES, type Category } from "@/lib/types";
import { useStore } from "@/lib/store";
import { AdGrid } from "@/components/AdCard";
import { BrandCard } from "@/components/BrandCard";
export default function ProfilePage() {
  const { user, followed, saved, logout, updateInterests } = useStore();
  if (!user) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center">
        <p className="font-medium">You are not signed in</p>
        <div className="mt-4 flex justify-center gap-2">
          <Link href="/login" className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white">Log in</Link>
          <Link href="/signup" className="rounded-full border border-neutral-200 px-4 py-2 text-sm">Sign up</Link>
        </div>
      </div>
    );
  }
  function toggleInterest(c: Category) {
    const next = user.interests.includes(c) ? user.interests.filter((x) => x !== c) : [...user.interests, c];
    updateInterests(next);
  }
  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 sm:flex-row sm:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.avatar} alt="" className="h-16 w-16 rounded-full bg-neutral-200" />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{user.name}</h1>
          <p className="text-sm text-neutral-500">{user.email}</p>
        </div>
        <button type="button" onClick={logout} className="rounded-full border border-neutral-200 px-4 py-2 text-sm">Log out</button>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Interests</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c !== "Other").map((c) => (
            <button key={c} type="button" onClick={() => toggleInterest(c)} className={`rounded-full px-3 py-1.5 text-xs ${user.interests.includes(c) ? "bg-neutral-900 text-white" : "border border-neutral-200 bg-white"}`}>{c}</button>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Followed brands</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {followed.length === 0 && <p className="text-sm text-neutral-500">You are not following anyone yet.</p>}
          {followed.map((id) => <BrandCard key={id} id={id} />)}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Saved ads</h2>
        <div className="mt-4">{saved.length === 0 ? <p className="text-sm text-neutral-500">No saved ads.</p> : <AdGrid ids={saved} />}</div>
      </section>
    </div>
  );
}
