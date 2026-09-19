"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
const links = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/brands", label: "Brands" },
  { href: "/saved", label: "Saved" },
  { href: "/notifications", label: "Notifications" },
  { href: "/profile", label: "Profile" },
];
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, notifications } = useStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;
  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/explore?q=${encodeURIComponent(q.trim())}` : "/explore");
    setOpen(false);
  }
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="shrink-0 font-semibold text-neutral-900">CAN'T STOP WATCHING ADS</Link>
        <form onSubmit={onSearch} className="hidden flex-1 md:block">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search advertisements" className="w-full rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm outline-none" />
        </form>
        <nav className="hidden items-center gap-1 text-sm lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`relative rounded-full px-3 py-1.5 ${pathname === l.href ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"}`}>
              {l.label}
              {l.href === "/notifications" && unread > 0 && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {user ? <Link href="/profile" className="hidden text-sm sm:block">{user.name}</Link> : <Link href="/login" className="rounded-full bg-neutral-900 px-3 py-1.5 text-sm text-white">Log in</Link>}
          <button type="button" className="rounded-full border px-3 py-1.5 text-sm lg:hidden" onClick={() => setOpen((v) => !v)}>Menu</button>
        </div>
      </div>
      {open && (
        <div className="border-t bg-white px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {links.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg bg-neutral-50 px-3 py-2">{l.label}</Link>)}
          </div>
        </div>
      )}
    </header>
  );
}
