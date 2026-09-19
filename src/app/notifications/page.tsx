"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatDate } from "@/lib/data";
import { useLive } from "@/lib/live";
import { useStore } from "@/lib/store";
import { activeAnnouncements, pullBoard, type Announcement } from "@/lib/adminBoard";

export default function NotificationsPage() {
  const { ads, brands } = useLive();
  const { followed } = useStore();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  useEffect(() => { pullBoard().then((b) => setAnnouncements(activeAnnouncements(b))).catch(() => {}); }, []);
  const items = useMemo(() => {
    const fromAds = ads
      .filter((a) => followed.includes(a.brandId))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 20)
      .map((a) => ({
        id: a.id,
        message: `${a.brandName || "A brand you follow"} published ${a.title}`,
        createdAt: a.createdAt,
        href: `/ads/${a.id}`,
      }));
    const fromAdmin = announcements.map((a) => ({
      id: a.id,
      message: a.text,
      createdAt: a.until,
      href: "/",
    }));
    return [...fromAdmin, ...fromAds];
  }, [ads, followed, announcements]);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <p className="mt-1 text-sm text-neutral-500">Announcements and new ads from brands you follow. Nothing fake.</p>
      <ul className="mt-6 space-y-3">
        {items.length === 0 && <li className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">There are no notifications yet.</li>}
        {items.map((n) => (
          <li key={n.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
            <Link href={n.href}>{n.message}</Link>
            <p className="mt-1 text-xs text-neutral-500">{formatDate(n.createdAt)}</p>
          </li>
        ))}
      </ul>
      {brands.length === 0 && followed.length === 0 ? null : null}
    </div>
  );
}
