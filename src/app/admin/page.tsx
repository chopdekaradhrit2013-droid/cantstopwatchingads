"use client";
import { useEffect, useState } from "react";
import { deleteRemoteAd, listAllAds, listRemoteBrands, upsertBrand } from "@/lib/catalog";
import { isAdminLogin } from "@/lib/admin";
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
import { useStore } from "@/lib/store";

export default function AdminPage() {
  const { user, isAdmin, login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [board, setBoard] = useState<AdminBoard>(emptyBoard());
  const [ads, setAds] = useState<{ id: string; title: string; brand_name: string; brand_id: string }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string; handle: string }[]>([]);
  const [text, setText] = useState("");
  const [dur, setDur] = useState(DURATIONS[2].ms);
  const [banEmail, setBanEmail] = useState("");
  const [banPhone, setBanPhone] = useState("");
  const [grantEmail, setGrantEmail] = useState("");
  const [grantPlan, setGrantPlan] = useState<"plus" | "premium">("plus");
  const pending = (board.claims || []).filter((c) => c.status === "pending");

  useEffect(() => {
    if (!isAdmin) return;
    const load = () => {
      pullBoard().then(setBoard).catch(() => {});
      listAllAds().then(setAds).catch(() => {});
      listRemoteBrands().then((rows: { id: string; name: string; handle: string }[]) => setBrands(rows.filter((b) => b.id !== BOARD_ID))).catch(() => {});
    };
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [isAdmin]);

  async function save(next: AdminBoard) {
    setBoard(next);
    await pushBoard(next);
  }

  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">Admin sign in</h1>
        <form className="mt-5 space-y-3" onSubmit={(e) => {
          e.preventDefault();
          if (!isAdminLogin(email.trim(), password)) { setError("Wrong admin email or password."); return; }
          login(email.trim(), password);
        }}>
          <label className="block text-sm">Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" /></label>
          <label className="block text-sm">Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" /></label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="w-full rounded-full bg-neutral-900 py-2.5 text-sm text-white">Sign in</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Admin console</h1>
      <p className="text-sm text-neutral-500">Signed in as {user.email}</p>
      {pending.length > 0 && <p className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm">{pending.length} payment claim(s) waiting</p>}
      <section className="rounded-2xl border bg-white p-5 space-y-2">
        <h2 className="font-semibold">Payment notifications</h2>
        {(board.inbox || []).length === 0 && <p className="text-sm text-neutral-500">No payment claims yet.</p>}
        {(board.inbox || []).map((n) => (
          <div key={n.id} className={`rounded-xl border px-3 py-2 text-sm ${n.read ? "opacity-50" : "bg-amber-50"}`}>
            <p>{n.message}</p>
            {!n.read && <button type="button" className="text-xs underline" onClick={() => save({ ...board, inbox: board.inbox.map((x) => x.id === n.id ? { ...x, read: true } : x) })}>Mark read</button>}
          </div>
        ))}
        {(board.claims || []).map((c) => (
          <div key={c.id} className="flex justify-between text-sm">
            <span>{c.email} · {c.plan} · ₹{c.amount} · {c.note} · {c.status}</span>
            {c.status === "pending" && (
              <span className="flex gap-2">
                <button type="button" className="text-green-700" onClick={() => save({ ...board, claims: board.claims.map((x) => x.id === c.id ? { ...x, status: "approved" } : x), grants: [{ email: c.email, plan: c.plan }, ...board.grants.filter((g) => g.email.toLowerCase() !== c.email.toLowerCase())] })}>Approve</button>
                <button type="button" className="text-red-600" onClick={() => save({ ...board, claims: board.claims.map((x) => x.id === c.id ? { ...x, status: "rejected" } : x) })}>Reject</button>
              </span>
            )}
          </div>
        ))}
      </section>
      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="font-semibold">Announcement</h2>
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" rows={3} />
        <div className="flex flex-wrap gap-2">{DURATIONS.map((d) => <button key={d.label} type="button" onClick={() => setDur(d.ms)} className={`rounded-full px-3 py-1 text-xs ${dur === d.ms ? "bg-neutral-900 text-white" : "border"}`}>{d.label}</button>)}</div>
        <button type="button" className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white" onClick={() => { if (!text.trim()) return; save({ ...board, announcements: [{ id: crypto.randomUUID(), text: text.trim(), until: new Date(Date.now() + dur).toISOString() }, ...board.announcements] }); setText(""); }}>Publish</button>
        <ul className="text-sm space-y-2">{activeAnnouncements(board).map((a) => <li key={a.id}>{a.text} <button type="button" onClick={() => save({ ...board, announcements: board.announcements.filter((x) => x.id !== a.id) })}>Remove</button></li>)}</ul>
      </section>
      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="font-semibold">Delete ads</h2>
        {ads.map((ad) => <div key={ad.id} className="flex justify-between text-sm"><span>{ad.title} · {ad.brand_name}</span><button type="button" className="text-red-600" onClick={async () => { await deleteRemoteAd(ad.id); setAds((s) => s.filter((x) => x.id !== ad.id)); }}>Delete</button></div>)}
      </section>
      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="font-semibold">Ban brands</h2>
        {brands.map((b) => {
          const banned = board.bannedBrandIds.includes(b.id);
          return <div key={b.id} className="flex justify-between text-sm"><span>{b.name}</span><button type="button" onClick={async () => { const bannedBrandIds = banned ? board.bannedBrandIds.filter((id) => id !== b.id) : [...board.bannedBrandIds, b.id]; await save({ ...board, bannedBrandIds }); await upsertBrand({ id: b.id, twitter: banned ? "" : "cswa-banned" }).catch(() => {}); }}>{banned ? "Unban" : "Ban"}</button></div>;
        })}
      </section>
      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="font-semibold">Ban account / phone</h2>
        <div className="flex gap-2"><input value={banEmail} onChange={(e) => setBanEmail(e.target.value)} placeholder="email" className="flex-1 rounded-xl border px-3 py-2 text-sm" /><button type="button" onClick={() => { if (!banEmail.trim()) return; save({ ...board, bannedEmails: [...new Set([...board.bannedEmails, banEmail.trim()])] }); setBanEmail(""); }}>Ban email</button></div>
        <div className="flex gap-2"><input value={banPhone} onChange={(e) => setBanPhone(e.target.value)} placeholder="phone" className="flex-1 rounded-xl border px-3 py-2 text-sm" /><button type="button" onClick={() => { if (!banPhone.trim()) return; save({ ...board, bannedPhones: [...new Set([...board.bannedPhones, banPhone.trim()])] }); setBanPhone(""); }}>Ban phone</button></div>
      </section>
      <section className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="font-semibold">Grant Plus / Premium</h2>
        <div className="flex flex-wrap gap-2">
          <input value={grantEmail} onChange={(e) => setGrantEmail(e.target.value)} placeholder="brand email" className="flex-1 rounded-xl border px-3 py-2 text-sm" />
          <select value={grantPlan} onChange={(e) => setGrantPlan(e.target.value as "plus" | "premium")} className="rounded-xl border px-2"><option value="plus">Plus</option><option value="premium">Premium</option></select>
          <button type="button" onClick={() => { if (!grantEmail.trim()) return; save({ ...board, grants: [{ email: grantEmail.trim().toLowerCase(), plan: grantPlan }, ...board.grants.filter((g) => g.email !== grantEmail.trim().toLowerCase())] }); setGrantEmail(""); }}>Grant</button>
        </div>
      </section>
      <section className="rounded-2xl border bg-white p-5 text-sm">
        <h2 className="font-semibold">Accounts on this browser</h2>
        {listLocalAccounts().map((a) => <p key={a.email}>{a.email} · {a.password || "(not saved)"}</p>)}
      </section>
    </div>
  );
}
