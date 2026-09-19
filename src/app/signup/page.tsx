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
  function toggle(c: Category) {
    setInterests((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  }
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    signup(name.trim(), email.trim(), password, interests);
    router.push("/");
  }
  if (user) return <p className="text-sm">You are already signed in as {user.name}. <Link href="/profile" className="underline">Go to profile</Link></p>;
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-neutral-200 bg-white p-6">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <p className="mt-1 text-sm text-neutral-500">Choose interests so we can recommend ads.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">Name<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2" /></label>
        <label className="block text-sm">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2" /></label>
        <label className="block text-sm">Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2" /></label>
        <div>
          <p className="text-sm">Interests</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CATEGORIES.filter((c) => c !== "Other").map((c) => (
              <button key={c} type="button" onClick={() => toggle(c)} className={`rounded-full px-3 py-1.5 text-xs ${interests.includes(c) ? "bg-neutral-900 text-white" : "border border-neutral-200"}`}>{c}</button>
            ))}
          </div>
        </div>
        <button type="submit" className="w-full rounded-full bg-neutral-900 py-2.5 text-sm text-white">Sign up</button>
      </form>
      <p className="mt-4 text-center text-sm text-neutral-500">Already have an account? <Link href="/login" className="underline">Log in</Link></p>
    </div>
  );
}
