"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, type Category } from "@/lib/types";
import { useStore } from "@/lib/store";
export default function SignupPage() {
  const { signup, user } = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [interests, setInterests] = useState<Category[]>([]);
  if (user) return <p className="text-sm">Already signed in as {user.name}.</p>;
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-neutral-200 bg-white p-6">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <form onSubmit={(e) => { e.preventDefault(); signup(name.trim(), email.trim(), password, interests); router.push("/"); }} className="mt-6 space-y-4">
        <label className="block text-sm">Name<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" /></label>
        <label className="block text-sm">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" /></label>
        <label className="block text-sm">Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" /></label>
        <div className="flex flex-wrap gap-2">{CATEGORIES.filter((c) => c !== "Other").map((c) => (
          <button key={c} type="button" onClick={() => setInterests((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c])} className={`rounded-full px-3 py-1.5 text-xs ${interests.includes(c) ? "bg-neutral-900 text-white" : "border"}`}>{c}</button>
        ))}</div>
        <button className="w-full rounded-full bg-neutral-900 py-2.5 text-sm text-white">Sign up</button>
      </form>
      <p className="mt-4 text-center text-sm text-neutral-500">Already have an account? <Link href="/login" className="underline">Log in</Link></p>
    </div>
  );
}
