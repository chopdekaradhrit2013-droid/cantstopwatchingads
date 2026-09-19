"use client";
import { useEffect, useState } from "react";
import { deleteRemoteAd, listAllAds, listRemoteBrands, upsertBrand } from "@/lib/catalog";
import {
  BOARD_ID,
  DURATIONS,
  activeAnnouncements,
  emptyBoard,
  listLocalAccounts,
  pullBoard,
  pushBoard,
  type AdminBoard,
} from "@/lib/adminBoard";

export default function AdminPage() {
  const [board, setBoard] = useState<AdminBoard>(emptyBoard());
  const [ads, setAds] = useState<{ id: string; title: string; brand_name: string; brand_id: string }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string; handle: string }[]>([]);
  const [text, setText] = useState("");
  const [dur, setDur] = useState(DURATIONS[2].ms);
  const [banEmail, setBanEmail] = useState("");
  const [banPhone, setBanPhone] = useState("");
  const [grantEmail, setGrantEmail] = useState("");
  const [grantPlan, setGrantPlan] = useState<"plus" | "premium">("plus");

  useEffect(() => {
    pullBoard().then(setBoard).catch(() => {});
    listAllAds().then(setAds).catch(() => {});
    listRemoteBrands().then((rows: { id: string; name: string; handle: string }[]) => setBrands(rows.filter((b) => b.id !== BOARD_ID))).catch(() => {});
  }, []);

  async function save(next: AdminBoard) {
    setBoard(next);
    await pushBoard(next);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Admin console</h1>

      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="font-semibold">Announcement</h2>
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" rows={3} placeholder="Message for every user" />
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <button key={d.label} type="button" onClick={() => setDur(d.ms)} className={`rounded-full px-3 py-1 text-xs ${dur === d.ms ? "bg-neutral-900 text-white" : "border"}`}>{d.label}</button>
          ))}
        </div>
        <button type="button" className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white" onClick={() => {
          if (!text.trim()) return;
          const item = { id: crypto.randomUUID(), text: text.trim(), until: new Date(Date.now() + dur).toISOString() };
          save({ ...board, announcements: [item, ...board.announcements] });
          setText("");
        }}>Publish</button>
        <ul className="text-sm space-y-2">
          {activeAnnouncements(board).map((a) => (
            <li key={a.id} className="flex justify-between gap-3 rounded-xl border px-3 py-2">
              <span>{a.text} <span className="text-neutral-400">until {new Date(a.until).toLocaleString()}</span></span>
              <button type="button" onClick={() => save({ ...board, announcements: board.announcements.filter((x) => x.id !== a.id) })}>Remove</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="font-semibold">Delete ads</h2>
        {ads.length === 0 && <p className="text-sm text-neutral-500">No ads</p>}
        {ads.map((ad) => (
          <div key={ad.id} className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm">
            <span>{ad.title} · {ad.brand_name}</span>
            <button type="button" className="text-red-600" onClick={async () => { await deleteRemoteAd(ad.id); setAds((s) => s.filter((x) => x.id !== ad.id)); }}>Delete</button>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="font-semibold">Ban brands</h2>
        {brands.map((b) => {
          const banned = board.bannedBrandIds.includes(b.id);
          return (
            <div key={b.id} className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
              <span>{b.name}</span>
              <button type="button" onClick={async () => {
                const bannedBrandIds = banned ? board.bannedBrandIds.filter((id) => id !== b.id) : [...board.bannedBrandIds, b.id];
                await save({ ...board, bannedBrandIds });
                await upsertBrand({ id: b.id, twitter: banned ? "" : "cswa-banned" }).catch(() => {});
              }}>{banned ? "Unban" : "Ban"}</button>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="font-semibold">Ban account / phone</h2>
        <div className="flex gap-2">
          <input value={banEmail} onChange={(e) => setBanEmail(e.target.value)} placeholder="email" className="flex-1 rounded-xl border px-3 py-2 text-sm" />
          <button type="button" onClick={() => { if (!banEmail.trim()) return; save({ ...board, bannedEmails: [...new Set([...board.bannedEmails, banEmail.trim()])] }); setBanEmail(""); }}>Ban email</button>
        </div>
        <div className="flex gap-2">
          <input value={banPhone} onChange={(e) => setBanPhone(e.target.value)} placeholder="phone" className="flex-1 rounded-xl border px-3 py-2 text-sm" />
          <button type="button" onClick={() => { if (!banPhone.trim()) return; save({ ...board, bannedPhones: [...new Set([...board.bannedPhones, banPhone.trim()])] }); setBanPhone(""); }}>Ban phone</button>
        </div>
        <ul className="text-sm text-neutral-600">
          {board.bannedEmails.map((e) => <li key={e}>email {e} <button type="button" onClick={() => save({ ...board, bannedEmails: board.bannedEmails.filter((x) => x !== e) })}>lift</button></li>)}
          {board.bannedPhones.map((e) => <li key={e}>phone {e} <button type="button" onClick={() => save({ ...board, bannedPhones: board.bannedPhones.filter((x) => x !== e) })}>lift</button></li>)}
        </ul>
      </section>

      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="font-semibold">Grant Plus / Premium</h2>
        <div className="flex flex-wrap gap-2">
          <input value={grantEmail} onChange={(e) => setGrantEmail(e.target.value)} placeholder="brand email" className="flex-1 rounded-xl border px-3 py-2 text-sm" />
          <select value={grantPlan} onChange={(e) => setGrantPlan(e.target.value as "plus" | "premium")} className="rounded-xl border px-2">
            <option value="plus">Plus</option>
            <option value="premium">Premium</option>
          </select>
          <button type="button" onClick={() => {
            if (!grantEmail.trim()) return;
            const grants = [{ email: grantEmail.trim().toLowerCase(), plan: grantPlan }, ...board.grants.filter((g) => g.email !== grantEmail.trim().toLowerCase())];
            save({ ...board, grants });
            setGrantEmail("");
          }}>Grant</button>
        </div>
        <ul className="text-sm">{board.grants.map((g) => <li key={g.email}>{g.email} → {g.plan}</li>)}</ul>
      </section>

      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="font-semibold">Accounts on this browser</h2>
        <ul className="text-sm space-y-1">
          {listLocalAccounts().length === 0 && <li className="text-neutral-500">No local accounts recorded yet.</li>}
          {listLocalAccounts().map((a) => (
            <li key={a.email} className="rounded-xl border px-3 py-2">{a.email} · {a.kind} · password: {a.password || "(not saved)"}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
