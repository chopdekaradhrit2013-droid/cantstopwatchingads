"use client";
import Link from "next/link";
import { formatDate } from "@/lib/data";
import { useLive } from "@/lib/live";
import { useStore } from "@/lib/store";
export default function NotificationsPage() {
  const { brands } = useLive();
  const { notifications, followed } = useStore();
  const items = notifications.filter((n) => followed.length === 0 || followed.includes(n.brandId));
  return (
    <div>
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <p className="mt-1 text-sm text-neutral-500">Updates when brands you follow publish new ads.</p>
      <ul className="mt-6 space-y-3">
        {items.length === 0 && <li className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">There are no ads notifications yet.</li>}
        {items.map((n) => {
          const brand = brands.find((b) => b.id === n.brandId);
          return (
            <li key={n.id} className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
              <span className="text-lg">🔔</span>
              <div>
                <p>{n.message}</p>
                <p className="mt-1 text-xs text-neutral-500">{formatDate(n.createdAt)}{brand && <>{" · "}<Link href={`/brands/${brand.slug}`} className="underline">{brand.name}</Link></>}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
