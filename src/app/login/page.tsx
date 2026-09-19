"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
export default function LoginPage() {
  const { login, user } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  if (user) return <p className="text-sm">Signed in as {user.name}. <Link href="/" className="underline">Home</Link></p>;
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-neutral-200 bg-white p-6">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <form onSubmit={(e) => { e.preventDefault(); if (!login(email.trim(), password)) setError("No matching account."); else router.push("/"); }} className="mt-6 space-y-4">
        <label className="block text-sm">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" /></label>
        <label className="block text-sm">Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" /></label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-full bg-neutral-900 py-2.5 text-sm text-white">Log in</button>
      </form>
      <p className="mt-4 text-center text-sm text-neutral-500">New here? <Link href="/signup" className="underline">Create an account</Link></p>
    </div>
  );
}
