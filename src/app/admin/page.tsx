"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";

export default function AdminPage() {
  const { user, isAdmin } = useStore();
  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border bg-white p-6 text-sm">
        <p>Admin only.</p>
        <Link href="/login" className="mt-3 inline-block underline">Log in</Link>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-sm text-neutral-500">Signed in as {user.email}</p>
      <p className="rounded-2xl border bg-white p-5 text-sm">Use CREATE admin at <a className="underline" href="https://cantstopwatchingadscreate.vercel.app/admin">cantstopwatchingadscreate.vercel.app/admin</a> to approve brand verification.</p>
    </div>
  );
}
